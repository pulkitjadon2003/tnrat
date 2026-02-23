import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from 'crypto';

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

            return NextResponse.json({ status: true, message: "Payment verified successfully" }, { status: 200 });

            // const hashedPassword = await bcrypt.hash(data.password, 10);

            // const lastMember = await Member.findOne().sort({ createdAt: -1 });

            // const lastIdNumber = lastMember?.memberId
            //     ? parseInt(lastMember?.memberId, 10)  
            //     : 0;

            // const memberId = String(lastIdNumber + 1).padStart(5, "0");

            // data.memberId = memberId;

            // const member = await Member.create({
            //     ...data,
            //     password: hashedPassword,
            //     transactions: [{
            //         transactionId: razorpay_payment_id,
            //         amount: amount,
            //         description: 'Membership Joining Fee',
            //         date: new Date()
            //     }],
            //     // memberShipStartDate: new Date(),
            //     // memberShipExpiry: new Date(),
            //     // memberShipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            //     // yearlySubscriptionStart: new Date(),
            //     // yearlySubscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            // });


        } else {
            return NextResponse.json({ status: false, message: 'Invalid Payment' }, { status: 400 });
        }
    } catch (error) {
        console.error('payment verification error:', error);
        return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
    }
};