'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // Import useRouter
import Router from 'next/router';

const PostPage = () => {
  const { data: session } = useSession(); // Get session data
  const [subject, setSubject] = useState('');
  const [detail, setDetail] = useState('');
  const [atkResult, setAtkResult] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  

  // Handle the file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('detail', detail);
    formData.append('atkResult', atkResult);
    formData.append('userId', session?.user?.id.toString() || ''); // Ensure this is a valid userId
    if (photo) {
      formData.append('image', photo); // Add the photo if it exists
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/atk', {
        method: 'POST',
        body: formData, // Sending the FormData to the API
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log('Post created:', newPost);
        setLoading(false);
        alert('ATK result posted successfully');
      } else {
        const errorData = await response.json();
        setLoading(false);
        setErrorMessage(errorData.error || 'Error submitting the post');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('Error submitting the post');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Upload ATK Result</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter the subject of the ATK result"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Detail</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter details about the ATK test"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">ATK Result</label>
          <input
            type="text"
            value={atkResult}
            onChange={(e) => setAtkResult(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter the result (e.g., positive, negative)"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Upload Photo (Optional)</label>
          
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit ATK Result'}
        </button>
      </form>

      {/* Button to navigate back to the dashboard */}
      <a
        
        href="/dashboard"
        className="w-full p-3 bg-gray-600 text-white rounded-lg mt-4"
      >
        Back to Dashboard
      </a>
    </div>
  );
};

export default PostPage;
