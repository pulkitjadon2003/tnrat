import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Post from "@/models/post";
import Team from "@/models/team";

export async function GET(req) {
    try {
        await connectDB();
        
        const id = req.nextUrl.searchParams.get("id");

        const post = await Post.findById(id)
            .populate("team");

        return NextResponse.json(
            { status: true, post },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating posts:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};