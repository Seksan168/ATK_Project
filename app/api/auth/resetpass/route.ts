import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // For hashing the new password

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json(); // Get the token and new password from the request body

    // Check if the token and password are provided
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

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

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token and expiry using the user's unique id
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id, // Use unique id to update the user
      },
      data: {
        password: hashedPassword,
        resetToken: null, // Clear the reset token after successful password reset
        resetTokenExpiry: null, // Clear the expiry time as well
      },
    });

    // If the user update fails
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Return a success response
    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    // Log detailed error
    return NextResponse.json({ error: `Error resetting password: ${error.message}` }, { status: 500 });
  }
}
