import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search } = await req.json();

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { leader: { $regex: search, $options: "i" } },
                { "members.name": { $regex: search, $options: "i" } },
                { "members.email": { $regex: search, $options: "i" } },
                { "members.phone": { $regex: search, $options: "i" } },
            ]
        };

        const totalTeams = await Team.countDocuments(query);

        const teams = await Team.find(query)
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ created_at: -1 });

        return NextResponse.json(
            { status: true, teams, totalTeams },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error searching team:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};