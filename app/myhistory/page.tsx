"use client";
import { useEffect, useState } from "react";  

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace 'userId' with the actual userId or pass it dynamically
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/atk', {
          method: 'GET',
          headers: {
            'userId': '1', // Example userId
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Created At</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Detail</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Result</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Photo</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t border-gray-200">
              <td className="px-6 py-4 text-sm text-gray-700">{new Date(post.createdAt).toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{post.subject}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{post.detail}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{post.atkResult}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{post.photo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
