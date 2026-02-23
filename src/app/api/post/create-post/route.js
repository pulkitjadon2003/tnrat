import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// export async function POST(req) {
//     await connectDB();

//     try {
//         const body = await req.json();

//         const post = await Post.create({
//             ...body,
//             images: body.images,
//             video: body.video
//         });

//         return NextResponse.json({
//             status: true,
//             message: "Post created successfully",
//             post
//         });
//     } catch (error) {
//         console.error("Error creating post:", error);
//         return NextResponse.json(
//             { status: false, message: "Server Error" },
//             { status: 500 }
//         );
//     }
// }


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
        const data = Object.fromEntries(formData.entries());

        const imageFiles = formData.getAll("images");
        const video = formData.get("video");

        const imageUrls = [];
        for (const img of imageFiles) {
            const url = await saveFileToServer(img);
            imageUrls.push(url);
        }

        let updatedVideo = null;
        if (video && typeof video === "object" && video.size > 0) {
            updatedVideo = await saveFileToServer(video);
        }

        const post = await Post.create({
            ...data,
            images: imageUrls,
            video: updatedVideo,
        });

        return NextResponse.json(
            { status: true, message: "Post created successfully", post },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { status: false, message: "Server Error", details: error.message },
            { status: 500 }
        );
    }
}