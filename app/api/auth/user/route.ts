import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  // Get the token from the query string
  const { token } = req.nextUrl.searchParams;  // Retrieve token from query params

  if (!token) {
    return new NextResponse('Unauthorized: Token is missing', { status: 401 });
  }

  // Verify the JWT token
  const user = verifyToken(token);

  // If the token is invalid or expired, return Unauthorized response
  if (!user) {
    return new NextResponse('Unauthorized: Invalid or expired token', { status: 401 });
  }

  // Fetch user data from the database using Prisma
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,  // Use the userId from the decoded token
    },
    select: {
      id: true,
      email: true,
      name: true,  // Assuming the 'name' is the username
    },
  });

  // If user is not found in the database, return not found response
  if (!userData) {
    return new NextResponse('User not found', { status: 404 });
  }

  // Respond with the user data
  return NextResponse.json(userData);
}
