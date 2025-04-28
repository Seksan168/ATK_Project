import { NextRequest, NextResponse } from 'next/server';

// This route will be protected by the middleware
export async function GET(req: NextRequest) {
  // The user info is available because we added it in the middleware
  const user = req.user;

  // If the user is not authenticated, return a 401 response
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Handle the request for an authenticated user
  return new NextResponse(JSON.stringify({ message: 'Protected data', user }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
