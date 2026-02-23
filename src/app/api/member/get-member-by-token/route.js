import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Member from "@/models/member";

export async function POST(req) {
    await connectDB();

    try {
        const { token } = await req.json();

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return Response.json({ status: false, message: "Invalid Link or expired" }, { status: 401 });
        }

        return NextResponse.json({ status: true, member: decoded }, { status: 200 });
    } catch (error) {
        console.error("Error fetching Members:", error);
        return Response.json({ status: false, message: "Server Error" }, { status: 500 });
    }
};