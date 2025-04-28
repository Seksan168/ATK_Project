import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

 



export async function POST(request: Request) {
  try {
    const { subject, detail, atkResult, userId, photo } = await request.json();

    // Check if the user with the given userId exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return new Response('User not found', { status: 404 });
    }

    // Create the new post
    const newPost = await prisma.post.create({
      data: {
        subject,
        detail,
        atkResult,
        userId, // Foreign key to the user
        photo,
      },
    });

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
