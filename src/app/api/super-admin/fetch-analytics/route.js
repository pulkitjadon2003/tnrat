import { verifyJwt } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Donate from "@/models/donate";
import Member from "@/models/member";

export async function GET(req) {
    try {
        await connectDB();

        const { valid, message } = await verifyJwt(req);

        if (!valid) {
            return Response.json({ status: false, message: message }, { status: 401 });
        }

        const totalMembers = await Member.countDocuments({});

        const pendingMembers = await Member.countDocuments({ status: 'pending' });

        const activeMembers = await Member.countDocuments({ status: 'active' });

        const donations = await Donate.find({ status: 'success' });

        const totalDonation = donations.reduce((sum, item) => {
            const amount = parseFloat(item.amount) || 0;
            return sum + amount;
        }, 0);

        const members = await Member.find({});

        let joiningFeeEarning = 0;
        let subscriptionEarning = 0;

        members.forEach(member => {
            member.transactions.forEach(tx => {
                const amount = parseFloat(tx.amount) || 0;

                if (tx.description === "Membership Joining Fee") {
                    joiningFeeEarning += amount;
                } else {
                    subscriptionEarning += amount;
                }
            });
        });


        return Response.json({
            status: true,
            message: "Analytics fetched successfully",
            totalMembers,
            activeMembers,
            pendingMembers,
            totalDonation,
            joiningFeeEarning,
            subscriptionEarning
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating SuperAdmin:", error);
        return Response.json({ status: false, message: "Sever Error" }, { status: 500 });
    }
};