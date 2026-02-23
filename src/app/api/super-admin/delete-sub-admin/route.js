import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";
import bcrypt from "bcryptjs";

export async function DELETE(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id") || 1;

        const subAdmin = await SuperAdmin.findByIdAndDelete(id);

        if (!subAdmin) {
            return Response.json({ status: false, message: "Sub Admin not found" }, { status: 404 });
        }

        return Response.json({ status: true, message: "Sub Admin delete successfully", subAdmin }, { status: 201 });

} catch (error) {
    return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
}
};
