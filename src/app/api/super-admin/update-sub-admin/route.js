// app/api/SuperAdmins/route.js
import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";

export async function POST(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");

        const { name, email, phone, permission } = await req.json();

        const superAdmin = await SuperAdmin.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            permission
        }, { new: true });

        if (!superAdmin) {
            return Response.json({ status: false, message: "Super Admin not found" }, { status: 404 });
        }

        return Response.json({ status: true, message: "SuperAdmin updated successfully", superAdmin }, { status: 201 });

    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};