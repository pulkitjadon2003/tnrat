import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LeaderShip from "@/models/leadership";
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
            return Response.json({ status: false, message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return Response.json(
                { status: false, message: "id is required" },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        const file = formData.get("profile");

        const existingLeadership = await LeaderShip.findById(id);

        if (!existingLeadership) {
            return Response.json(
                { status: false, message: "Leadership not found" },
                { status: 404 }
            );
        }

        // ✅ If new profile file uploaded
        if (file && typeof file === "object" && file.size > 0) {
            // Save new file
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const ext = path.extname(file.name);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            await fs.writeFile(filePath, buffer);

            const profileUrl = `${MEDIA_BASE_URL}/uploads/${fileName}`;

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

            const updatedLeadership = await LeaderShip.findByIdAndUpdate(
                id,
                {
                    ...data,
                    profile: profileUrl,
                },
                { new: true }
            );

            return Response.json(
                {
                    status: true,
                    message: "Leadership updated successfully",
                    leadership: updatedLeadership,
                },
                { status: 200 }
            );
        }

        // ✅ No new file → update only fields
        const updatedLeadership = await LeaderShip.findByIdAndUpdate(
            id,
            {
                ...data,
            },
            { new: true }
        );

        return Response.json(
            {
                status: true,
                message: "Leadership updated successfully",
                leadership: updatedLeadership,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating leadership:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
}
