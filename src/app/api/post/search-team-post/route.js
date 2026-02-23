import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/post";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search, state, city, year } = await req.json();

        let query = {};

        if (state) {
            query.state = state;
        }

        if (city) {
            query.city = city;
        }

        if (year) {
            const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
            query.caseDate = { $gte: startOfYear, $lte: endOfYear };
        }

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { state: { $regex: search, $options: "i" } },
                    { city: { $regex: search, $options: "i" } }
                ],
                team: req.nextUrl.searchParams.get("team")
            }
        }

        const totalPosts = await Post.countDocuments(query);

        const posts = await Post.find(query)
            .sort({ caseDate: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15)
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