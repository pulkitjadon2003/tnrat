import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/post";
import Team from "@/models/team";

export async function GET(req) {
    await connectDB();
    
    try {
        const posts = await Post.find({})
            .sort({ caseDate: -1 })
            .limit(4)
            .populate('team');

        return NextResponse.json(
            { status: true, posts },
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