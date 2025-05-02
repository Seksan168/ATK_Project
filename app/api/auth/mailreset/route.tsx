import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer'; // To send emails
import crypto from 'crypto'; // For generating a token
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use TLS, not full SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  

export async function POST(request: Request) {
  try {
    
    const { email } = await request.json(); // Parse the incoming JSON body for the email

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No user found with this email' }),
        { status: 400 }
      );
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token expiration time (1 hour from now)
    const expireTime = new Date(Date.now() + 3600000); // 1 hour

    // Save the token and expiration time to the database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expireTime,
      },
    });

    // Create the password reset URL
    const resetUrl = `${process.env.CLIENT_URL}/resetpass?token=${token}`;

    // Send password reset email with the reset link
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER, // Sender email from environment variable
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    });

    // Return a successful response
    return new Response(
      JSON.stringify({ message: 'Password reset link sent to your email' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending reset email:', error);
    return new Response(
      JSON.stringify({ error: 'Error processing password reset' }),
      { status: 500 }
    );
  }
}


