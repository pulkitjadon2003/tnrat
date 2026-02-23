import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Member from "@/models/member";

export async function POST(req) {
    await connectDB();

    try {
        const { phone, password } = await req.json();

        const member = await Member.findOne({ phone });

        if (!member) {
            return Response.json({ status: false, message: "Phone number not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, member?.password);

        if (!isPasswordValid) {
            return Response.json({ status: false, message: "Invalid password" }, { status: 401 });
        }

        if (member?.status == "pending") {
            return Response.json({ status: false, message: "Account is under review" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: member._id, ...member?._doc },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        const res = NextResponse.json({ status: true, message: "Member logged in successfully", token, user: member }, { status: 200 });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res;
    } catch (error) {
        console.error("Error fetching Members:", error);
        return Response.json({ status: false, message: "Server Error" }, { status: 500 });
    }
};