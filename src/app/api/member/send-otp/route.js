import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Otp from "@/models/otp";
import twilioClient from "@/lib/twilio";

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();

        const { phone, email } = body;

        const emailExists = await Member.findOne({ email: email });
        if (emailExists) {
            return Response.json({ status: false, message: "Email already exists" }, { status: 400 });
        }

        const phoneExists = await Member.findOne({ phone: phone });
        if (phoneExists) {
            return Response.json({ status: false, message: "Phone number already exists" }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`OTP for ${phone}: ${otp}`);

        await Otp.create({ phone: phone, otp: otp, otpExpiry: new Date(Date.now() + 20 * 60 * 1000) });

        // await twilioClient.messages.create({
        //     body: `Your OTP is ${otp}. Valid for 20 minutes.`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: phone,
        // });


        return NextResponse.json(
            { status: true, message: "OTP sent successfully", otp },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending otp:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};