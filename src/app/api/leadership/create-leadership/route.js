import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LeaderShip from "@/models/leadership";
import path from "path";
import fs from "fs/promises";


export async function POST(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        const file = formData.get("profile");
        if (!file) {
            return Response.json(
                { status: false, message: "Profile image is required" },
                { status: 400 }
            );
        }

        const uploadDir = process.env.MEDIA_UPLOAD_PATH;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(file.name);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        console.log("FILE SAVED:", filePath);

        const profile = `${process.env.MEDIA_BASE_URL}/uploads/${fileName}`;

        // const uploadToCloudinary = async (file, folder) => {
        //     if (!file) return null;

        //     const arrayBuffer = await file.arrayBuffer();
        //     const buffer = Buffer.from(arrayBuffer);
        //     const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        //     const uploadRes = await cloudinary.uploader.upload(base64, {
        //         folder,
        //         resource_type: "auto",
        //     });

        //     return uploadRes.secure_url;
        // };

        // Upload files if present
        // const profile = await uploadToCloudinary(formData.get("profile"), "leadership");

        const leaderShip = await LeaderShip.create({
            ...data,
            profile
        });

        return Response.json({ status: true, message: "LeaderShip created successfully", leaderShip }, { status: 201 });
    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};