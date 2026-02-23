// app/api/SuperAdmins/route.js
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Global from "@/models/global";
import IP from "@/models/ips";
import Member from "@/models/member";

export async function POST(req) {
    await connectDB();

    try {
        const { email, password } = await req.json();

        const superAdmin = await SuperAdmin.findOne({ email });

        if (!superAdmin) {
            return Response.json({ status: false, message: "Email not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);

        if (!isPasswordValid) {
            return Response.json({ status: false, message: "Invalid password" }, { status: 401 });
        }

        const global = await Global.find();

        const whitelistEnabled = global[0]?.whitelistEnabled || false;


        if (whitelistEnabled && superAdmin?.isSubAdmin) {
            const forwardedFor = req.headers.get("x-forwarded-for");

            const clientIP =
                forwardedFor?.split(",")[0]?.trim() ||
                req.headers.get("x-real-ip") ||
                "unknown";

            console.log("Client IP:", clientIP);

            if (clientIP !== "::1") { // localhost IP address 
                const isWhitelisted = await IP.findOne({ ip: clientIP });

                if (!isWhitelisted) {
                    return Response.json({ status: false, message: "You are not whitelisted" }, { status: 401 });
                }
            }
        }

        const sessionTimeout = global[0]?.sessionTimeout || 0;

        const token = jwt.sign(
            { id: superAdmin._id, ...superAdmin?._doc },
            process.env.JWT_SECRET_KEY,
            { expiresIn: `${sessionTimeout}m` || process.env.JWT_EXPIRES }
        );

        const res = NextResponse.json({ status: true, message: "SuperAdmin logged in successfully", token, user: superAdmin }, { status: 200 });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: sessionTimeout * 60 || 7 * 24 * 60 * 60 * 1000,
        });

        return res;
    } catch (error) {
        console.error("Error fetching SuperAdmins:", error);
        return Response.json({ status: false, message: "Server Error" }, { status: 500 });
    }
};