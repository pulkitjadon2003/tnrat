import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search } = await req.json();

        const query = {
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { memberId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } }
            ]
        }

        const totalMembers = await Member.countDocuments(query);

        const members = await Member.find(query)
            .sort({ caseDate: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10);

        return NextResponse.json(
            { status: true, members, totalMembers },
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