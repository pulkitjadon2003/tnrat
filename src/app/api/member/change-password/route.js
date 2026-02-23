import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    await connectDB();

    try {
        const body = await req.json();

        const { phone, newPassword } = body;

        const member = await Member.findOne({ phone: phone });

        if (!member) {
            return NextResponse.json({ status: false, message: "Phone number not exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        member.password = hashedPassword;

        await member.save();

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