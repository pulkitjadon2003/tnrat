import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import SuperAdmin from "@/models/super-admin";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search } = await req.json();

        const query = {
            role: "subAdmin",
            isSubAdmin: true,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
            ]
        };

        const totalSubAdmin = await SuperAdmin.countDocuments(query);

        const subAdmin = await SuperAdmin.find(query)
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ created_at: -1 });

        return NextResponse.json(
            { status: true, subAdmin, totalSubAdmin },
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