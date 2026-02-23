import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Donate from "@/models/donate";
import dayjs from "dayjs";

export async function GET(req) {
  try {
    await connectDB();

    const { valid, message } = await verifyJwt(req);
    if (!valid) {
      return Response.json({ status: false, message }, { status: 401 });
    }

    // ✅ Calculate 6-month range (including current month)
    const now = dayjs();
    const sixMonthsAgo = now.subtract(5, "month").startOf("month").toDate();

    // ✅ Aggregate donations grouped by month/year safely
    const donations = await Donate.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: now.toDate() },
          status: "success",
        },
      },
      {
        $addFields: {
          numericAmount: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$numericAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ✅ Build 6-month result (fill missing with 0)
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = now.subtract(i, "month");
      const month = monthDate.month() + 1;
      const year = monthDate.year();
      const monthName = monthDate.format("MMM YYYY");

      const found = donations.find(
        (d) => d._id.month === month && d._id.year === year
      );

      result.push({
        month: monthName,
        totalDonations: found ? found.totalAmount : 0,
        totalTransactions: found ? found.count : 0,
      });
    }

    return Response.json(
      {
        status: true,
        message: "6-month donation analytics fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donation analytics:", error);
    return Response.json(
      { status: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
