import { connectDB } from "@/lib/mongodb";
import LeaderShip from "@/models/leadership";

export async function GET(req) {
    await connectDB();
    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalLeadership = await LeaderShip.countDocuments({});

        const leadership = await LeaderShip.find()
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ createdAt: -1 });

        return Response.json({ status: true, leadership, totalLeadership }, { status: 200 });
    } catch (error) {
        console.error("Error creating LeaderShip:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
}