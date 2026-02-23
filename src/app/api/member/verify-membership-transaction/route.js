import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { verifyJwt } from "@/lib/auth";
import dayjs from "dayjs";

export async function POST(req) {
    await connectDB();

    try {
        const data = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {

            const res = NextResponse.json({ status: true, message: "Renewal successfully" }, { status: 200 });

            return res;
        } else {
            return NextResponse.json({ status: false, message: 'Invalid Payment' }, { status: 400 });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
    }
};