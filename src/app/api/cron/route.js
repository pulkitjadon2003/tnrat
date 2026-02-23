import Member from "@/models/member";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const now = new Date();

    const result = await Member.updateMany(
      { memberShipExpiry: { $lt: now } },  
      { $set: { status: "inactive" } }     
    );

    return NextResponse.json({
      status: true,
      message: "Membership expiry check completed",
      updatedCount: result?.modifiedCount,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { status: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
