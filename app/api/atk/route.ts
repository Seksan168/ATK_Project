import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs/promises';


const prisma = new PrismaClient();


export async function GET(req) {
  try {
    // Retrieve the userId from the request headers
    const userId = req.headers.get('userId');
    
    // Check if userId is provided, return an error if not
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required in headers' }), {
        status: 400,
      });
    }

    // Retrieve all posts from the database
    const posts = await prisma.post.findMany({
      where: {
        userId: parseInt(userId),  // Optionally filter posts by the provided userId
      },
      include: {
        user: true, // Include the associated user data
      },
    });

    // Return posts as a JSON response
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching posts' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData();  // Get the form data

    // Extract fields from the form data
    const subject = formData.get('subject') as string;
    const detail = formData.get('detail') as string;
    const atkResult = formData.get('atkResult') as string;
    const userId = formData.get('userId') as string;
    const photo = formData.get('image') as File | null;  // Get the uploaded file

    // Ensure userId is an integer
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    // Handle photo URL if there is an image
    let photoUrl = '';
    if (photo) {
      // Convert the photo to a buffer and save it
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Save the photo file to the server in the uploads folder
      await fs.writeFile(`./public/uploads/${photo.name}`, buffer);

      // Set the file URL to be stored in the database
      photoUrl = `/uploads/${photo.name}`;
    }

    // Create a new ATK post in the database
    const newPost = await prisma.post.create({
      data: {
        subject,
        detail,
        atkResult,
        photo: photoUrl, // Save the photo URL
        userId: parsedUserId, // Store the userId
      },
    });

    // Revalidate the homepage or any path you want to trigger revalidation on
    revalidatePath('/');

    // Return the created post response
    return NextResponse.json({ status: 'success', post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ status: 'fail', error: (error as any).message }, { status: 500 });
  }
}