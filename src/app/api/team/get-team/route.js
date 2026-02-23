import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Team from "@/models/team";

export async function GET(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const team = await Team.findById(req.nextUrl.searchParams.get("id"));

        return NextResponse.json(
            { status: true, team },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching team:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};