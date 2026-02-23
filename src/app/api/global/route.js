import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Global from "@/models/global";
import { NextResponse } from "next/server";


export async function GET(req) {
    await connectDB();

    try {
        const global = await Global.find();

        return Response.json({ status: true, global: global[0] }, { status: 200 });
    } catch (error) {
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};

export async function POST(req) {
    await connectDB();

    const { valid, message } = await verifyJwt(req);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {
        const body = await req.json();

        const global = await Global.find();


        if (global.length === 0) {
            const createdGlobal = await Global.create({ ...body });
            return Response.json({ status: true, global: createdGlobal }, { status: 201 });
        }

        const updatedGlobal = await Global.findByIdAndUpdate(global[0]._id, { ...body }, {
            new: true,
            runValidators: true,
        });

        return Response.json({ status: true, global: updatedGlobal }, { status: 200 });
    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
}