import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const saveFileToServer = async (file) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(process.env.MEDIA_UPLOAD_PATH, fileName);

    await fs.writeFile(filePath, buffer);

    return `${process.env.MEDIA_BASE_URL}/uploads/${fileName}`;
};

export async function POST(req) {
    await connectDB();

    try {
        const formData = await req.formData();

        const photoFile = formData.get("photoFile");
        const documentFile = formData.get("documentFile");

        if (!photoFile || typeof photoFile.arrayBuffer !== 'function') {
            return NextResponse.json({ status: false, message: "Valid photo file is required" }, { status: 400 });
        }

        if (!documentFile || typeof documentFile.arrayBuffer !== 'function') {
            return NextResponse.json({ status: false, message: "Valid document file is required" }, { status: 400 });
        }

        const photoFileUrl = await saveFileToServer(photoFile);
        const documentFileUrl = await saveFileToServer(documentFile);

        const res = NextResponse.json({ status: true, message: "Member created successfully", photoFileUrl, documentFileUrl }, { status: 200 });

        return res;
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
    }
};