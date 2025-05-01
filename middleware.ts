import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("User Data", user);

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // If the user is authenticated, save the user data in a cookie
  if (user) {
    const response = NextResponse.next();
    response.cookies.set("user", JSON.stringify(user), {
      httpOnly: true,
      path: "/",
    });

    // Check if the user is trying to access the /management page and isn't an admin
    if (pathname.startsWith("/management") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return response;
  }

  // If no user is found and the user is trying to access /management, redirect to the login page
  if (pathname.startsWith("/management")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}