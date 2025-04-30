'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const PostPage = () => {
  const { data: session } = useSession(); // Get session data
  const [subject, setSubject] = useState('');
  const [detail, setDetail] = useState('');
  const [atkResult, setAtkResult] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled and user is logged in
    // if (!subject || !detail || !atkResult || !session?.user?.id) {
    //   setErrorMessage('Please fill out all fields and make sure you are logged in');
    //   return;
    // }

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('detail', detail);
    formData.append('atkResult', atkResult);
    formData.append('userId', session.user.id.toString()); // Ensure this is a valid userId
    if (photo) {
      formData.append('image', photo); // Add the photo if it exists
    }

    setLoading(true);
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
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit ATK Result'}
        </button>
      </form>
    </div>
  );
};

export default PostPage;
