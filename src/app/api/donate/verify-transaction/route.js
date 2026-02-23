// pages/api/create-order.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donate from '@/models/donate';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    await connectDB();

    try {
        const data = await req.json();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = data;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return NextResponse.json({ status: true, message: "Payment verified successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ status: false, message: 'Invalid Payment' }, { status: 400 });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};