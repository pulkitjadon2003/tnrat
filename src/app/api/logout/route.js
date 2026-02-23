import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = NextResponse.json(
      { status: true, message: "Logged out successfully" },
      { status: 200 }
    );

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Logout failed", error: error.message },
      { status: 500 }
    );
  }
}
