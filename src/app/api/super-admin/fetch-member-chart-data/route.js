import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import dayjs from "dayjs";

export async function GET(req) {
  connectDB()
  try {
    const { valid, message } = await verifyJwt(req);
    if (!valid) {
      return Response.json({ status: false, message }, { status: 401 });
    }

    //  Calculate range: last 6 months (including current month)
    const now = dayjs();
    const sixMonthsAgo = now.subtract(5, "month").startOf("month").toDate();

    //  Fetch member counts grouped by month and year
    const members = await Member.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: now.toDate() },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    //  Prepare 6-month result (fill missing months with 0)
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = now.subtract(i, "month");
      const month = monthDate.month() + 1; // 1–12
      const year = monthDate.year();
      const monthName = monthDate.format("MMM YYYY");

      const found = members.find(
        (m) => m._id.month === month && m._id.year === year
      );

      result.push({
        month: monthName,
        members: found ? found.count : 0,
      });
    }

    return Response.json(
      { status: true, message: "6-month member analytics fetched", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching member analytics:", error);
    return Response.json(
      { status: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
