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
        const member = await Member.findById(req.nextUrl.searchParams.get("id"));

        return NextResponse.json(
            { status: true, member },
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