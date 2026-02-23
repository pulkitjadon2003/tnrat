import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import Donate from "@/models/donate";

export async function GET(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalDonations = await Donate.countDocuments();

        const donations = await Donate.find({})
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10);

        return NextResponse.json(
            { status: true, donations, totalDonations },
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