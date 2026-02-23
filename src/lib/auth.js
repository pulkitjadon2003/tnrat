// src/lib/auth.js
import Member from "@/models/member";
import SuperAdmin from "@/models/super-admin";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req) => {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) return { valid: false, message: "No token provided" };

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const admin = await SuperAdmin.findById(decoded.id);

        const member = await Member.findById(decoded.id);

        if (admin) {
            req.user = admin
        };

        if (member) {
            req.user = member
        };

        if (req.user) {
            return { valid: true, message: "User authenticated" };
        } else {
            return { valid: false, message: "User not authenticate, Please Re-login" };
        }
    } catch (error) {
        console.error("JWT verification error:", error);
        if (error.name === "TokenExpiredError")
            return { valid: false, message: "Token expired" };
        return { valid: false, message: "Invalid token" };
    }
};