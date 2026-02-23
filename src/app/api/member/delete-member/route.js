import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/member";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicIdFromUrl = (url) => {
    if (!url) return null;

    try {
        // Cloudinary URL pattern: https://res.cloudinary.com/cloudname/image/upload/v1234567/public_id.jpg
        const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
        return matches ? matches[1] : null;
    } catch (error) {
        console.error('Error extracting public_id from URL:', error);
        return null;
    }
};

const detectResourceTypeFromUrl = (url) => {
    if (!url) return 'image';

    if (url.includes('/video/upload/')) return 'video';
    if (url.includes('/raw/upload/')) return 'raw';

    return 'image'; // default
};

const deleteFromCloudinaryByUrl = async (url) => {
    try {
        const publicId = extractPublicIdFromUrl(url);
        if (!publicId) {
            console.warn('Could not extract public_id from URL:', url);
            return;
        }

        const resourceType = detectResourceTypeFromUrl(url);

        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        console.log(`Successfully deleted ${resourceType} with public_id: ${publicId}`);
    } catch (error) {
        console.error(`Cloudinary delete error for URL ${url}:`, error);
        // Don't throw error for delete failures to avoid blocking the update
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

        const member = await Member.findByIdAndDelete(id);

        if (member?.document) {
            await deleteFromCloudinaryByUrl(member?.document);
        }

        if (member?.document) {
            await deleteFromCloudinaryByUrl(member?.facePicture);
        }

        if (member?.document) {
            await deleteFromCloudinaryByUrl(member?.faceVideo);
        }

        if (member?.document) {
            await deleteFromCloudinaryByUrl(member?.memberDocument);
        }

        if (!member) {
            return Response.json({ status: false, message: "member not found" }, { status: 404 });
        }

        return Response.json({ status: true, message: "Member deleted successfully", member }, { status: 201 });
    } catch (error) {
        return Response.json({ status: false, message: "Server Error", details: error.message }, { status: 500 });
    }
};
