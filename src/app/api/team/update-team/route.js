import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = process.env.MEDIA_UPLOAD_PATH;
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL;

const getFileNameFromUrl = (url) => {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        return path.basename(parsed.pathname);
    } catch (err) {
        return null;
    }
};

export async function POST(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");

        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        let file = formData.get("logo");

        const existingTeam = await Team.findById(id);

        if (!existingTeam) {
            return Response.json({ status: false, message: "Team not found" }, { status: 404 });
        }

        if (file && typeof file === "object" && file.size > 0) {
            // const logoUrl = await uploadToCloudinary(formData.get("logo"), "team");

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const ext = path.extname(file.name);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            await fs.writeFile(filePath, buffer);

            const logoUrl = `${MEDIA_BASE_URL}/uploads/${fileName}`;

            const oldFileName = getFileNameFromUrl(existingLeadership.profile);

            if (oldFileName) {
                const oldFilePath = path.join(UPLOAD_DIR, oldFileName);

                try {
                    await fs.unlink(oldFilePath);
                    console.log("Old file deleted:", oldFilePath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error("Error deleting old file:", err);
                    }
                }
            }
            existingTeam.logo = logoUrl;
        }

        existingTeam.name = data?.name;
        existingTeam.leader = data?.leader;
        existingTeam.members = JSON.parse(data?.members) || [];

        const team = await existingTeam.save();
        return Response.json({ status: true, message: "Team updated successfully", team }, { status: 201 });

    } catch (error) {
        console.error("Error updating team:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};