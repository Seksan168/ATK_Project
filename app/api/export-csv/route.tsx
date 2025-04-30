import { PrismaClient } from '@prisma/client';
import { parse } from 'json2csv';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('userId');  // Assuming the userId is passed in the headers

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Fetch posts from the database for the logged-in user
    const posts = await prisma.post.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    // Convert posts to CSV format
    const csv = parse(posts, {
      fields: ['subject', 'detail', 'atkResult', 'photo', 'createdAt'],
    });

    // Set headers for the response to download the CSV file
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=posts.csv',
      },
    });
  } catch (error) {
    console.error('Error exporting posts to CSV:', error);
    return new Response(JSON.stringify({ error: 'Error exporting posts to CSV' }), { status: 500 });
  }
}
