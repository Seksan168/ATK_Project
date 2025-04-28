
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '../../../../lib/auth'; 

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the incoming POST request
    const { email, name, password } = await req.json();

    // Validate the input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: { email,name, password: hashedPassword },
    });

    // Generate a JWT token
    const token = signToken(newUser.id, newUser.email);

    // Respond with the newly created user and the token
    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}