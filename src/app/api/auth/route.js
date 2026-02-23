import Member from "@/models/member";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { verifyJwt } from "@/lib/auth";
import Global from "@/models/global";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  try {
    const { valid, message } = await verifyJwt(request);

    if (!valid) {
      return Response.json({ status: false, message: message }, { status: 401 });
    }

    if (request?.user?.isSuperAdmin === true || request?.user?.isSubAdmin === true) {
      const global = await Global.find();

      const sessionTimeout = global[0]?.sessionTimeout || 0;

      const token = jwt.sign(
        { id: request?.user._id, ...request?.user?._doc },
        process.env.JWT_SECRET_KEY,
        { expiresIn: `${sessionTimeout}m` || process.env.JWT_EXPIRES }
      );

      const res = NextResponse.json({ status: true, message: "SuperAdmin logged in successfully", token, user: request?.user?._doc }, { status: 200 });

      res.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: sessionTimeout * 60 || 7 * 24 * 60 * 60 * 1000,
      });

      return res;
    } else {
      if (request?.user?.status === "pending") {
        return Response.json({ status: false, message: "Your account is under review" }, { status: 401 });
      } else {
        return Response.json({ status: true, message: "Authorized", user: request?.user }, { status: 200 });
      }
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return Response.json({ status: false, message: "Invalid token" }, { status: 401 });
  }
};