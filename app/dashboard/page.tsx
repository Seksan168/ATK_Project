'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


const PostsPage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user?.id) {
        setErrorMessage('User is not logged in');
        return;
      }

      try {
        const response = await fetch('/api/atk', {
          method: 'GET',
          headers: {
            'userId': session.user.id.toString(),  // Pass user ID in the header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Error fetching posts');
        }
      } catch (error) {
        setErrorMessage('Error fetching posts');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [session]);

  const downloadCSV = async () => {
    if (!session?.user?.id) {
      setErrorMessage('User is not logged in');
      return;
    }

    try {
      const response = await fetch('/api/export-csv', {
        method: 'GET',
        headers: {
          'userId': session.user.id.toString(),  // Pass user ID in the header
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'posts.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error exporting posts to CSV');
      }
    } catch (error) {
      setErrorMessage('Error exporting posts to CSV');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My ATK Results</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Detail</th>
                <th className="border px-4 py-2">ATK Result</th>
                <th className="border px-4 py-2">Photo</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No posts available.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="border px-4 py-2">{post.subject}</td>
                    <td className="border px-4 py-2">{post.detail}</td>
                    <td className="border px-4 py-2">{post.atkResult}</td>
                    <td className="border px-4 py-2">
                      {post.photo ? (
                        <img src={post.photo} alt="ATK Result Photo" className="w-16 h-16 object-cover" />
                      ) : (
                        'No Photo'
                      )}
                    </td>
                    <td className="border px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={downloadCSV}
        className="mt-4 p-3 bg-green-600 text-white rounded-lg"
      >
        Download as CSV
      </button>
    </div>
  );
};

export default PostsPage;
