import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function PUT(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const body = await req.json();

        const { id, isEmailChange, isPhoneChange, email, phone, isStatusChange, status } = body;

        if (isEmailChange) {
            const emailExists = await Member.findOne({ email: email });

            if (emailExists) {
                return NextResponse.json({ status: false, message: "Email already exists" }, { status: 400 });
            }
        }

        if (isPhoneChange) {
            const phoneExists = await Member.findOne({ phone: phone });

            if (phoneExists) {
                return NextResponse.json({ status: false, message: "Phone number already exists" }, { status: 400 });
            }
        }


        if (isStatusChange && status === "active") {
            const member = await Member.findById(id);
            const now = new Date();

            const isYearlySubscriptionExpired = !member?.yearlySubscriptionExpiry || new Date(member.yearlySubscriptionExpiry) < now;

            body.memberShipStartDate = now;
            body.memberShipExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            body.yearlySubscriptionStart = isYearlySubscriptionExpired
                ? now
                : member.yearlySubscriptionStart;

            body.yearlySubscriptionExpiry = isYearlySubscriptionExpired
                ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
                : member.yearlySubscriptionExpiry;
        }


        const member = await Member.findByIdAndUpdate(id, body, { new: true });

        if (!member) {
            return NextResponse.json({ status: false, message: "Member not found" }, { status: 404 });
        }

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