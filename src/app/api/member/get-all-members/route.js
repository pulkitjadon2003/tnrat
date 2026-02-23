import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function GET(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalMembers = await Member.countDocuments();

        const members = await Member.find({})
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10);

        return NextResponse.json(
            { status: true, members, totalMembers },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};