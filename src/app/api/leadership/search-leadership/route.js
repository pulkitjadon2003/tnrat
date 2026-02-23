import { connectDB } from "@/lib/mongodb";
import LeaderShip from "@/models/leadership";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const { search } = await req.json();

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { designation: { $regex: search, $options: "i" } },
            ]
        };

        const totalLeadership = await LeaderShip.countDocuments(query);

        const leadership = await LeaderShip.find(query)
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ created_at: -1 });

        return NextResponse.json(
            { status: true, leadership, totalLeadership },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error searching team:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
};