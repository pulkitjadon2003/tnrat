import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Otp from "@/models/otp";

export async function POST(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const body = await req.json();

        const { id, phone, otp } = body;

        const otpExist = await Otp.findOne({ phone, otp }).sort({ createdAt: -1 });

        if (!otpExist) {
            return NextResponse.json({ status: false, message: "Invalid OTP" }, { status: 400 });
        }

        if (otpExist?.otpExpiry < Date.now()) {
            return NextResponse.json({ status: false, message: "OTP expired" }, { status: 400 });
        }

        const member = await Member.findByIdAndUpdate(id, { phone: phone }, { new: true });

        return NextResponse.json(
            { status: true, message: "OTP verified successfully", member },
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
