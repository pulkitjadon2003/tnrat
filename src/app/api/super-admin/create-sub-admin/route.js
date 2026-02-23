import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();

        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const data = await req.json();

        const { email, password, phone, permission } = data;

        const hash = await bcrypt.hash(password, 10);

        const subAdminExist = await SuperAdmin.findOne({ email });

        if (subAdminExist) {
            return Response.json({ status: false, message: "Email already exist" }, { status: 400 });
        }

        const phoneNumberExist = await SuperAdmin.findOne({ phone: phone });

        if (phoneNumberExist) {
            return Response.json({ status: false, message: "Phone number already exist" }, { status: 400 });
        }

        const newSubAdmin = await SuperAdmin.create({
            ...data,
            password: hash,
            permission,
            role: "subAdmin",
            isSubAdmin: true
        });

        return Response.json({ status: true, message: "Sub Admin created successfully", newSubAdmin }, { status: 201 });
    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return res?.status(500).json({ status: false, error: "Sever Error" });
    }
};