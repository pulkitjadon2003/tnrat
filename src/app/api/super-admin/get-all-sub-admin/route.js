import { connectDB } from "@/lib/mongodb";
import SuperAdmin from "@/models/super-admin";

export async function GET(req) {
    await connectDB();
    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const query = {
            role: "subAdmin",
            isSubAdmin: true
        };

        const totalSubAdmin = await SuperAdmin.countDocuments(query);

        const subAdmin = await SuperAdmin.find(query)
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .sort({ createdAt: -1 });

        return Response.json({ status: true, subAdmin, totalSubAdmin }, { status: 200 });
    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
}