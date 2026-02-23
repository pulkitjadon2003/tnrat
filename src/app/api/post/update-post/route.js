import { NextResponse } from "next/server";
import Post from "@/models/post";
import { connectDB } from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

const IMAGE_DIR = "/var/www/tnrat-media/images";
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL;

// ✅ Extract file name from url
const getFileNameFromUrl = (url) => {
  if (!url) return null;

  try {
    const u = new URL(url);
    return path.basename(u.pathname); // abc.jpg / abc.mp4
  } catch (err) {
    return url.split("/").pop();
  }
};

// ✅ Safe delete file
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

// ✅ Save file in server and return URL
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
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const formData = await request.formData();

    // Extract form fields
    const team = formData.get("team");
    const title = formData.get("title");
    const description = formData.get("description");
    const caseDate = formData.get("caseDate");
    const state = formData.get("state");
    const city = formData.get("city");

    const videoFile = formData.get("video"); // new video file if uploaded
    const imageFiles = formData.getAll("images"); // new images if uploaded

    const existingImages = JSON.parse(formData.get("existingImages") || "[]");
    const existingVideo = formData.get("existingVideo"); // can be 'null' or url

    // ✅ Validate at least one image exists
    if (existingImages.length === 0 && imageFiles.filter((f) => f.size > 0).length === 0) {
      return NextResponse.json(
        { status: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json(
        { status: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const updateData = {
      team,
      title,
      description,
      caseDate: caseDate ? new Date(caseDate) : existingPost.caseDate,
      state,
      city,
    };

    // ✅ VIDEO UPDATE LOGIC
    if (videoFile && typeof videoFile === "object" && videoFile.size > 0) {
      // user uploaded new video => delete old and upload new
      if (existingPost?.video) {
        const oldVideoName = getFileNameFromUrl(existingPost.video);
        if (oldVideoName) {
          await safeDeleteFile(path.join(IMAGE_DIR, oldVideoName));
        }
      }

      const newVideoUrl = await saveFileToServer(videoFile, IMAGE_DIR);
      console.log("New video URL:", newVideoUrl);
      updateData.video = newVideoUrl;
    } else if (existingVideo && existingVideo !== "null") {
      // keep old video as it is
      updateData.video = existingPost.video;
    } else {
      // remove video
      if (existingPost?.video) {
        const oldVideoName = getFileNameFromUrl(existingPost.video);
        if (oldVideoName) {
          await safeDeleteFile(path.join(IMAGE_DIR, oldVideoName));
        }
      }
      updateData.video = null;
    }

    // ✅ IMAGES UPDATE LOGIC
    const newUploadedImages = [];

    // Upload new images if provided
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await saveFileToServer(imageFile, IMAGE_DIR);
        if (uploadedUrl) newUploadedImages.push(uploadedUrl);
      }
    }

    // final images = kept existing + new uploaded
    const finalImages = [...existingImages, ...newUploadedImages];

    // ✅ Delete removed images from server
    const removedImages = (existingPost.images || []).filter(
      (oldImage) => !existingImages.includes(oldImage)
    );

    for (const removedImage of removedImages) {
      const oldName = getFileNameFromUrl(removedImage);
      if (oldName) {
        await safeDeleteFile(path.join(IMAGE_DIR, oldName));
      }
    }

    updateData.images = finalImages;

    // ✅ Update post in database
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        status: true,
        message: "Post updated successfully",
        post: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json(
      { status: false, message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
