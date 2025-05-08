'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Download, Activity } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Dashboard metrics
  const [yearlyStats, setYearlyStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [lastPositive, setLastPositive] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = session?.user?.id || '1';
        console.log('Fetching posts for userId:', userId);
        
        const response = await fetch('/api/atk', {
          method: 'GET',
          headers: {
            'userId': userId.toString(),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        console.log('Retrieved posts:', data.length);
        setPosts(data);
        
        // Process data for dashboard
        processDataForDashboard(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [session]);

  const processDataForDashboard = (data) => {
    // Sort posts by date (newest first)
    const sortedPosts = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Find last positive result
    const lastPositiveResult = sortedPosts.find(post => 
      post.atkResult?.toLowerCase() === 'positive'
    );
    setLastPositive(lastPositiveResult);
    
    // Calculate yearly statistics (positive per year)
    const yearlyPositives = {};
    sortedPosts.forEach(post => {
      const year = new Date(post.createdAt).getFullYear();
      if (!yearlyPositives[year]) yearlyPositives[year] = { positive: 0, negative: 0, total: 0 };
      
      if (post.atkResult?.toLowerCase() === 'positive') {
        yearlyPositives[year].positive += 1;
      } else if (post.atkResult?.toLowerCase() === 'negative') {
        yearlyPositives[year].negative += 1;
      }
      yearlyPositives[year].total += 1;
    });
    
    const yearlyData = Object.keys(yearlyPositives).map(year => ({
      year,
      positive: yearlyPositives[year].positive,
      negative: yearlyPositives[year].negative,
      total: yearlyPositives[year].total
    }));
    
    setYearlyStats(yearlyData);
    
    // Calculate weekly statistics for the current year
    const currentYear = new Date().getFullYear();
    const weeklyNegatives = {};
    
    sortedPosts.forEach(post => {
      const date = new Date(post.createdAt);
      if (date.getFullYear() === currentYear && post.atkResult?.toLowerCase() === 'negative') {
        // Get week number
        const weekNumber = getWeekNumber(date);
        if (!weeklyNegatives[weekNumber]) weeklyNegatives[weekNumber] = 0;
        weeklyNegatives[weekNumber] += 1;
      }
    });
    
    const weeklyData = Object.keys(weeklyNegatives).map(week => ({
      week: `Week ${week}`,
      negative: weeklyNegatives[week]
    }));
    
    setWeeklyStats(weeklyData);
  };
  
  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  // Helper function to get ATK result style
  const getAtkResultStyle = (result) => {
    if (result?.toLowerCase() === 'positive') {
      return 'bg-red-600 text-white font-medium px-3 py-1 rounded';
    } else if (result?.toLowerCase() === 'negative') {
      return 'bg-green-600 text-white font-medium px-3 py-1 rounded';
    } else {
      return 'bg-gray-200 text-gray-800 px-3 py-1 rounded';
    }
  };

  const downloadCSV = async () => {
    try {
      const userId = session?.user?.id || '1';
      
      console.log('Downloading CSV for userId:', userId);
      setErrorMessage('');
      
      const response = await fetch('/api/export-csv', {
        method: 'GET',
        headers: {
          'userId': userId.toString(),
        },
      });

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || `Error: ${response.status}`;
        } catch (e) {
          errorText = `HTTP Error: ${response.status}`;
        }
        
        setErrorMessage(errorText);
        console.error('CSV download failed:', errorText);
        return;
      }
      
      const blob = await response.blob();
      console.log('Received blob:', blob.type, blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'atk-results.csv');
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download initiated');
      }, 100);
      
    } catch (error) {
      console.error('CSV download exception:', error);
      setErrorMessage(`Error downloading CSV: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My ATK Results Dashboard</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tests Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Tests</h2>
              <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
            </div>
          </div>
        </div>
        
        {/* Last Positive Case */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Last Positive Case</h2>
              {lastPositive ? (
                <p className="text-lg font-bold text-gray-800">
                  {new Date(lastPositive.createdAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-lg font-bold text-gray-500">No positive cases</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Download CSV */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Download className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Export Data</h2>
              <button
                onClick={downloadCSV}
                className="mt-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Download as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Yearly Stats Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Positive Cases Per Year</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" fill="#EF4444" name="Positive" />
                <Bar dataKey="negative" fill="#10B981" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Weekly Stats Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Negative Cases Per Week (Current Year)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="negative" fill="#10B981" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">ATK Results History</h2>
        
        {posts.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No ATK results found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(post.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{post.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{post.detail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={getAtkResultStyle(post.atkResult)}>
                        {post.atkResult}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {post.photo ? (
                        <img 
                          src={post.photo} 
                          alt="ATK Result Photo" 
                          className="w-16 h-16 object-cover cursor-pointer hover:opacity-80"
                          onClick={() => window.open(post.photo, '_blank')} 
                        />
                      ) : (
                        <span className="text-gray-400">No Photo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}