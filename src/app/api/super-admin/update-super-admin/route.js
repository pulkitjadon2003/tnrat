// app/api/SuperAdmins/route.js
import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";

export async function PUT(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const data = await req.json();

        console.log("Updating SuperAdmin with data:", data);

        const superAdmin = await SuperAdmin.findByIdAndUpdate(req.user?._id, data, { new: true });

        return Response.json({ status: true, message: "SuperAdmin updated successfully", superAdmin }, { status: 201 });

    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};