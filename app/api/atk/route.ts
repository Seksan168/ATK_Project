import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Use formData() instead of json() because we're dealing with a multipart request (for files)
    const formData = await request.formData();

    // Extract fields from the form data
    const subject = formData.get('subject') as string;
    const detail = formData.get('detail') as string;
    const atkResult = formData.get('atkResult') as string;
    const userId = formData.get('userId') as string;
    const photo = formData.get('image') as File | null;  // Get the uploaded file

    // Ensure userId is an integer
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return new Response(JSON.stringify({ error: 'Invalid userId' }), { status: 400 });
    }

    // Handle photo URL if there is an image
    let photoUrl = '';
    if (photo) {
      // Simulate saving the file and returning its path
      photoUrl = `/uploads/${photo.name}`;
    }

    // Create the post in the database
    const newPost = await prisma.post.create({
      data: {
        subject,
        detail,
        atkResult,
        photo: photoUrl,
        userId: parsedUserId,
      },
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error); // Log the error for debugging
    return new Response(JSON.stringify({ error: 'Error saving the post', details: error.message }), { status: 500 });
  }
}
