'use client';
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client'; // Prisma client

const prisma = new PrismaClient();

const Dashboard = () => {
  const [totalSubmissions, setTotalSubmissions] = useState({
    day: 0,
    month: 0,
    year: 0,
  });
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [studentsPositive, setStudentsPositive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total submissions for today, this month, and this year
        const totalToday = await prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
            },
          },
        });
        const totalThisMonth = await prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(1)), // Start of this month
            },
          },
        });
        const totalThisYear = await prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1), // Start of this year
            },
          },
        });

        setTotalSubmissions({
          day: totalToday,
          month: totalThisMonth,
          year: totalThisYear,
        });

        // Fetch the percentage of positive and negative results
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

        setPositivePercentage(positivePercentage);
        setNegativePercentage(negativePercentage);

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

        setStudentsPositive(positiveStudents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Dashboard</h1>

      {/* Total Submissions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Submissions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Today</h3>
            <p className="text-xl text-blue-600">{totalSubmissions.day}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">This Month</h3>
            <p className="text-xl text-blue-600">{totalSubmissions.month}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">This Year</h3>
            <p className="text-xl text-blue-600">{totalSubmissions.year}</p>
          </div>
        </div>
      </div>

      {/* Positive vs Negative Percentage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Positive vs Negative Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Positive Results</h3>
            <p className="text-xl text-green-600">{positivePercentage}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-800">Negative Results</h3>
            <p className="text-xl text-red-600">{negativePercentage}%</p>
          </div>
        </div>
      </div>

      {/* Students Who Reported Positive */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Students Who Reported as Positive</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {studentsPositive.length > 0 ? (
                studentsPositive.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center p-2">
                    No students reported as positive.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
