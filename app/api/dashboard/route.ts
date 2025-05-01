import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get the current date and time
    const now = new Date();

    // Calculate start of today (midnight)
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    // Calculate start of this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate start of this year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Fetch total submissions for today, this month, and this year
    const totalToday = await prisma.post.count({
      where: {
        createdAt: {
          gte: startOfToday, // Start of today
        },
      },
    });

    const totalThisMonth = await prisma.post.count({
      where: {
        createdAt: {
          gte: startOfMonth, // Start of this month
        },
      },
    });

    const totalThisYear = await prisma.post.count({
      where: {
        createdAt: {
          gte: startOfYear, // Start of this year
        },
      },
    });

    // Fetch positive and negative result counts
    const totalPosts = await prisma.post.count();
    const positiveResults = await prisma.post.count({
      where: {
        atkResult: 'positive',
      },
    });
    const negativeResults = await prisma.post.count({
      where: {
        atkResult: 'negative',
      },
    });

    const positivePercentage = ((positiveResults / totalPosts) * 100).toFixed(2);
    const negativePercentage = ((negativeResults / totalPosts) * 100).toFixed(2);

    // Fetch students who reported as positive and their email
    const positiveStudents = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            atkResult: 'positive',
          },
        },
      },
      include: {
        posts: true, // Include the posts so we can check the results
      },
    });

    // Return the response with the calculated data
    return new Response(
      JSON.stringify({
        totalSubmissions: {
          day: totalToday,
          month: totalThisMonth,
          year: totalThisYear,
        },
        positivePercentage,
        negativePercentage,
        studentsPositive: positiveStudents.map((student) => ({
          name: student.name,
          email: student.email,
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching dashboard data' }),
      { status: 500 }
    );
  }
}
