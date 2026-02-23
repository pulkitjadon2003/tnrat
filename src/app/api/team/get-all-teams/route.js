import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";

export async function GET(req) {
    await connectDB();
    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalTeams = await Team.countDocuments({});

        const teams = await Team.find()
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ createdAt: -1 });

        return Response.json({ status: true, teams, totalTeams }, { status: 200 });
    } catch (error) {
        console.error("Error creating Team:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
}