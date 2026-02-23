import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";

export async function GET(req) {
    await connectDB();
    try {

        const teams = await Team.find()

        return Response.json({ status: true, teams }, { status: 200 });
    } catch (error) {
        console.error("Error creating Team:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
}