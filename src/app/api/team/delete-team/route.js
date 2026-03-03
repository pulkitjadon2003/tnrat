import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";
import path from "path";
import fs from "fs/promises";

const getFileNameFromUrl = (url) => {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        return path.basename(parsed.pathname);
    } catch (err) {
        return null;
    }
};

export async function DELETE(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id") || 1;

        const team = await Team.findById(id);

        if (!team) {
            return Response.json({ status: false, message: "Team not found" }, { status: 404 });
        }

        const fileName = getFileNameFromUrl(team.logo);

        if (fileName) {
            const filePath = path.join(process.env.MEDIA_UPLOAD_PATH, fileName);

            try {
                await fs.unlink(filePath);
                console.log("Deleted file from server:", filePath);
            } catch (fileErr) {
                // if file not found - ignore
                if (fileErr.code !== "ENOENT") {
                    console.error("Error deleting file from server:", fileErr);
                }
            }
        }

        const deletetdTeam = await Team.findByIdAndDelete(id);

        return Response.json({ status: true, message: "Team delete successfully", deletetdTeam }, { status: 201 });

    } catch (error) {
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};
