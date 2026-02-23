import { connectDB } from "@/lib/mongodb";
import Donate from "@/models/donate";
import Member from "@/models/member";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search } = await req.json();

        const query = {
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { amount: { $regex: search, $options: "i" } },
                { transactionId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ]
        }

        const totalDonations = await Donate.countDocuments(query);

        const donations = await Donate.find(query)
            .sort({ caseDate: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10);

        return NextResponse.json(
            { status: true, donations, totalDonations },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating posts:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};