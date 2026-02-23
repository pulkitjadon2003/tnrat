import { verifyJwt } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Member from '@/models/member';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import Global from '@/models/global';
import jwt from "jsonwebtoken";

export async function POST(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const body = await req.json();

        const global = await Global.find();

        if (global.length === 0) {
            return NextResponse.json({ message: 'Subscription Fee not found', status: false }, { status: 404 });
        }

        const { id } = body;

        const member = await Member.findById(id);

        if (!member) {
            return NextResponse.json({ message: 'Member not found', status: false }, { status: 404 });
        }

        let amt = 0;
        let plan;

        if (new Date(member?.yearlySubscriptionExpiry) < new Date() && new Date(member?.memberShipExpiry) < new Date()) {
            amt = parseInt(global[0]?.memberEntryFee) + parseInt(global[0]?.memberSubscriptionFee);
            plan = "वर्षिक सदस्यता और मासिक चंदा";
        } else if (new Date(member?.yearlySubscriptionExpiry) < new Date()) {
            amt = parseInt(global[0]?.memberEntryFee);
            plan = "वर्षिक सदस्यता";
        } else if (new Date(member?.memberShipExpiry) < new Date()) {
            amt = parseInt(global[0]?.memberSubscriptionFee);
            plan = "मासिक चंदा";
        }

        if (amt === 0) {
            return NextResponse.json({ message: 'Member subscription not expired yet', status: false }, { status: 200 });
        }

        const token = jwt.sign(
            { id: member._id, fullName: member?.fullName, email: member?.email, phone: member?.phone, amount: amt },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        return NextResponse.json({ status: true, message: "Payment link generated successfully", token, amount: amt, plan: plan }, { status: 200 });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};