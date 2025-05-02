import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json(); // Get the token from the request body

    // Check if the token exists and is valid
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    // If no user is found or the token is expired
    if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Return a success response if the token is valid
    return NextResponse.json({ message: 'Token is valid' }, { status: 200 });
  } catch (error) {
    console.error('Error validating reset token:', error);
    return NextResponse.json(
      { error: 'Error verifying reset token' },
      { status: 500 }
    );
  }
}
