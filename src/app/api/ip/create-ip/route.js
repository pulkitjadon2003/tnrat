import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import IP from "@/models/ips";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const body = await req.json();

        const ip = await IP.create({ ...body });

        return Response.json({ status: true, ip }, { status: 200 });
    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
}