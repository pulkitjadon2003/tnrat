import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const data = await req.json();

        const { currentPassword, newPassword } = data;

        const admin = await SuperAdmin.findById(req?.user?._id);

        if (!admin) {
            return Response.json({ status: false, message: "Admin not found" }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, admin.password)

        if (passwordMatch) {
            const hash = await bcrypt.hash(newPassword, 10);

            const adminUpdated = await SuperAdmin.findByIdAndUpdate(req?.user?._id, { password: hash }, {
                new: true,
                runValidators: true,
            });

            return Response.json({ status: true, message: "SuperAdmin updated successfully", adminUpdated }, { status: 201 });

        }
        else {
            return Response.json({ status: false, message: "Invalid current password" }, { status: 401 });
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
