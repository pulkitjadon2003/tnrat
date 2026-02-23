import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();

        const { email, phone } = body;

        const emailExists = await Member.findOne({ email: email });
        if (emailExists) {
            return Response.json({ status: false, message: "Email already exists" }, { status: 400 });
        }

        const phoneExists = await Member.findOne({ phone: phone });
        if (phoneExists) {
            return Response.json({ status: false, message: "Phone number already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(email + phone, 10);

        const totalMembers = await Member.countDocuments();
        const memberId = `${String(totalMembers + 1).padStart(5, "0")}`;
        body.memberId = memberId;

        // Save member to DB
        const member = await Member.create({
            ...body,
            password: hashedPassword,
        });

        const res = NextResponse.json({ status: true, message: "Member created successfully", user: member }, { status: 200 });

        return res;
    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
}