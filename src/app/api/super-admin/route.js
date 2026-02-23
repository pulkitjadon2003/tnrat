// app/api/SuperAdmins/route.js
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import SuperAdmin from "@/models/super-admin";
import bcrypt from "bcryptjs";

export async function GET() {
    await connectDB();
    try {
        const SuperAdmins = await SuperAdmin.find();
        return Response.json({ status: true, SuperAdmins }, { status: 200 });
    } catch (error) {
        console.error("Error fetching SuperAdmins:", error);
        return Response.json({ status: false, message: "Server Error" }, { status: 500 });
    }
};

export async function POST(req) {
    await connectDB();

    try {
        const data = await req.json();

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const superAdmin = await SuperAdmin.create(data);

        console.log('SuperAdmin created:', superAdmin);

        return Response.json({ status: true, message: "SuperAdmin created successfully", superAdmin }, { status: 201 });

    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};