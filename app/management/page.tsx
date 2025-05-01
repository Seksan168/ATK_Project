'use client';
import { useEffect, useState } from 'react';

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
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        setTotalSubmissions(data.totalSubmissions);
        setPositivePercentage(data.positivePercentage);
        setNegativePercentage(data.negativePercentage);
        setStudentsPositive(data.studentsPositive);
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
                  <tr key={student.email} className="border-t">
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
