import { verifyJwt } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Member from '@/models/member';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import Order from '@/models/order';
import bcrypt from "bcryptjs";
import PaymentOrder from '@/models/paymentOrder';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { amount, email, phone, membershipRenew, password, membershipRenewLink } = body;

        if (membershipRenew) {
            const { valid, message } = await verifyJwt(req);

            if (!valid) {
                return NextResponse.json({ status: false, message: message }, { status: 401 });
            }
        }

        const emailExists = await Member.findOne({ email: email });

        if (membershipRenew || membershipRenewLink) {
            if (!emailExists) {
                return Response.json({ status: false, message: "Member email not exists" }, { status: 400 });
            }

            const phoneExists = await Member.findOne({ phone: phone });

            if (!phoneExists) {
                return Response.json({ status: false, message: "Phone number not exists" }, { status: 400 });
            }

            const options = {
                amount: amount * 100,
                currency: "INR",
                notes: {
                    page: 'membershipRenew',
                }
            };

            const response = await razorpay.orders.create(options);

            await PaymentOrder.create({ orderId: response.id, memberId: emailExists?._id, amount: amount });

            return NextResponse.json({ status: true, order: response }, { status: 200 });
        } else {
            if (emailExists) {
                return Response.json({ status: false, message: "Email already exists" }, { status: 400 });
            }

            const phoneExists = await Member.findOne({ phone: phone });

            if (phoneExists) {
                return Response.json({ status: false, message: "Phone number already exists" }, { status: 400 });
            }

            const options = {
                amount: amount * 100,
                currency: "INR",
                notes: {
                    page: 'becomeMember',
                }
            };

            const response = await razorpay.orders.create(options);

            const hashedPassword = await bcrypt.hash(password, 10);

            const lastMember = await Member.findOne().sort({ createdAt: -1 });

            const lastIdNumber = lastMember?.memberId
                ? parseInt(lastMember?.memberId, 10)
                : 0;

            const memberId = String(lastIdNumber + 1).padStart(5, "0");

            const order = await Order.create({
                ...body,
                orderId: response.id,
                memberId: memberId,
                password: hashedPassword,
            });

            return NextResponse.json({ status: true, order: response, user: order }, { status: 200 });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};