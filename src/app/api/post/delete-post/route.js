import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import path from 'path';
import fs from 'fs/promises';

const getFileNameFromUrl = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        return path.basename(u.pathname);
    } catch (err) {
        return null;
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

export async function DELETE(req) {
    await connectDB();

    try {
        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id") || 1;

        const post = await Post.findById(id);

        if (!post) {
            return Response.json(
                { status: false, message: "Post not found" },
                { status: 404 }
            );
        }

        if (post?.video) {
            const videoName = getFileNameFromUrl(post.video);
            if (videoName) {
                const videoPath = path.join("/var/www/tnrat-media/images", videoName);
                await safeDeleteFile(videoPath);
            }
        }

        if (post?.images?.length > 0) {
            for (const imgUrl of post.images) {
                if (!imgUrl) continue;

                const imgName = getFileNameFromUrl(imgUrl);
                if (imgName) {
                    const imgPath = path.join("/var/www/tnrat-media/images", imgName);
                    await safeDeleteFile(imgPath);
                }
            }
        }

        const deletedPost = await Post.findByIdAndDelete(id);

        return Response.json({ status: true, message: "Post deleted successfully", post: deletedPost }, { status: 201 });
    } catch (error) {
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};
