import { connectDB } from "@/lib/mongodb";
import IP from "@/models/ips";

export async function GET(req) {
    await connectDB();
    try {
        const pageNumber = req.nextUrl.searchParams.get("pageNumber") || 1;

        const totalIPs = await IP.countDocuments();

        const ips = await IP.find()
            .skip((pageNumber - 1) * 5)
            .limit(5)
            .sort({ createdAt: -1 });

        return Response.json({ status: true, ips, totalIPs }, { status: 200 });
    } catch (error) {
        console.error("Error creating IP:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
}