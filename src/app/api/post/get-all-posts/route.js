import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Post from "@/models/post";

export async function GET(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalPosts = await Post.countDocuments();

        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .populate("team");

        return NextResponse.json(
            { status: true, posts, totalPosts },
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