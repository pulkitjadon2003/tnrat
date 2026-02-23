// app/api/member/update-member/route.js
import { NextResponse } from 'next/server';
import Member from '@/models/member';
import { connectDB } from '@/lib/mongodb';
import { verifyJwt } from '@/lib/auth';
import path from "path";
import fs from "fs/promises";

const IMAGE_DIR = "/var/www/tnrat-media/images";
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL;

const getFileNameFromUrl = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        return path.basename(u.pathname);
    } catch (err) {
        return url.split("/").pop();
    }
};

const safeDeleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log("Deleted file:", filePath);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("File delete error:", err);
        }
    }
};

const saveFileToServer = async (file, folderPath) => {
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, buffer);

    return `${MEDIA_BASE_URL}/uploads/${fileName}`;
};

export async function PUT(request) {
    await connectDB();

    const { valid, message } = await verifyJwt(request);

    if (!valid) {
        return NextResponse.json({ status: false, message: message }, { status: 401 });
    }

    try {

        const formData = await request.formData();

        const documentType = formData.get('documentType');

        const file = formData.get('file');

        const existingMember = await Member.findById(request?.user?._id);

        if (!existingMember) {
            return NextResponse.json(
                { status: false, message: 'Member not found' },
                { status: 404 }
            );
        }

        let updateData = {};

        if (documentType && file.size > 0) {
            try {
                if (existingMember[documentType]) {
                    const oldDocumentName = getFileNameFromUrl(existingMember[documentType]);
                    if (oldDocumentName) {
                        await safeDeleteFile(path.join(IMAGE_DIR, oldDocumentName));
                    }
                    // await deleteFromCloudinaryByUrl(existingMember[documentType]);
                }

                const documentUpload = await saveFileToServer(file, IMAGE_DIR);

                updateData[documentType] = documentUpload;
                updateData.documentVerified = false;
            } catch (documentError) {
                console.error('Document upload failed:', documentError);
                return NextResponse.json(
                    { status: false, message: 'Document upload failed: ' + documentError.message },
                    { status: 400 }
                );
            }
        }

        const updatedMember = await Member.findByIdAndUpdate(
            request?.user?._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        return NextResponse.json(
            {
                status: true,
                message: 'Member updated successfully',
                member: updatedMember
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update member error:', error);
        return NextResponse.json(
            { status: false, message: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
};