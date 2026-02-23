// pages/api/create-order.js
import Donate from '@/models/donate';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const body = await req.json();

        const { amount } = body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            notes: {
                page: 'donation'
            }
        };

        const response = await razorpay.orders.create(options);

        await Donate.create({
            ...body,
            orderId: response.id,
            status: 'pending',
        });

        return NextResponse.json({ status: true, order: response }, { status: 200 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}