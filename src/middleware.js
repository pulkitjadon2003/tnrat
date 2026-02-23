// src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const routePermissions = {
  "/admin/dashboard/member": "Member Management",
  "/admin/dashboard/role-management": "Role Management",
  "/admin/dashboard/create-post": "Create Post",
  "/admin/dashboard/post-management": "Post Management",
  "/admin/dashboard/donation-management": "Donation Management",
  "/admin/dashboard/team-management": "Team Management",
  "/admin/dashboard/leadership-team-management": "Leadership Team Management",
};

export async function middleware(request) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const path = request.nextUrl.pathname;

  console.log('path', path);

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    const requiredPermission = routePermissions[path];

    if (payload.isSubAdmin && requiredPermission && !payload.permission.includes(requiredPermission)) {
      return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
    }

    if (payload.isSubAdmin && path === "/admin/dashboard/settings") {
      return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
    }

    if (payload.isSuperAdmin && path.startsWith("/admin/dashboard")) {
      return NextResponse.next();
    }

    if (payload.isMember && path.startsWith("/member/dashboard")) {
      return NextResponse.next();
    }

    let redirectURI = path === "/member/dashboard" ? "/member/login" : "/member/login";
    const response = NextResponse.redirect(new URL(redirectURI, request.url));
    response.cookies.delete("token");
    return response; 

  } catch (err) {
    let redirectURI = path === "/member/dashboard" ? "/member/login" : "/admin/login";
    const response = NextResponse.redirect(new URL(redirectURI, request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/member/dashboard/:path*"],
};