import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Team from "@/models/team";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
    try {
        await connectDB();

        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        const { name, members } = data;

        data.members = JSON.parse(members);

        const teamNameExist = await Team.findOne({ name });

        if (teamNameExist) {
            return Response.json({ status: false, message: "Team name already exist" }, { status: 400 });
        }

        const file = formData.get('logo');
        let logo = "";

        if (file && typeof file.arrayBuffer === 'function') {
            const uploadDir = process.env.MEDIA_UPLOAD_PATH;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const ext = path.extname(file.name);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            await fs.writeFile(filePath, buffer);

            console.log("FILE SAVED:", filePath);
            logo = `${process.env.MEDIA_BASE_URL}/uploads/${fileName}`;
        }

        const team = await Team.create({ ...data, logo });

        return Response.json({ status: true, message: "Team created successfully", team }, { status: 201 });
    } catch (error) {
        console.log('Error creating team:', error.message);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};