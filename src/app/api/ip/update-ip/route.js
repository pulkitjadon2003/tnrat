import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import IP from "@/models/ips";

export async function POST(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const data = await req.json();

        const ip = await IP.findByIdAndUpdate(data?._id, data, { new: true });

        if (!ip) {
            return Response.json({ status: false, message: "IP not found" }, { status: 404 });
        }


        return Response.json({ status: true, message: "IP updated successfully", ip }, { status: 201 });
    } catch (error) {
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};
