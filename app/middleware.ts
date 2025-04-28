import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Import your JWT verification utility

export function middleware(req: NextRequest) {
  
  const token = req.cookies.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));  // Redirect to login if no token
  }

  // Verify the JWT token
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));  // Redirect to login if token is invalid
  }

  // Attach the user data to the request object for use in API routes or pages
  req.user = user;

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/*', '/api/protected/*'],  // Apply middleware to these routes only
};