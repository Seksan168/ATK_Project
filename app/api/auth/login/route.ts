import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma'; // Import Prisma client
import { signToken } from '../../../../lib/auth'; // Import JWT utility functions

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { email, password } = await req.json();

    // Validate the input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, return a 400 error
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Compare the entered password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Generate a JWT token
    const token = signToken(user.id, user.email);


    // Respond with the JWT token
    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}