'use client';
import { useState } from 'react';

const AtkUploadForm = () => {
  const [subject, setSubject] = useState('');
  const [detail, setDetail] = useState('');
  const [atkResult, setAtkResult] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Allowed file types and maximum size (2MB)
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/heic'];
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      
      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please upload a .jpg, .png, or .heic image.');
        setPhoto(null);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        setErrorMessage('File size exceeds 2MB. Please upload a smaller image.');
        setPhoto(null);
        return;
      }

      // If everything is fine, set the photo
      setPhoto(file);
      setErrorMessage(''); // Clear any error message
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !detail || !atkResult || !photo) {
      setErrorMessage('Please fill out all fields and upload a valid image.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('detail', detail);
    formData.append('atkResult', atkResult);
    formData.append('image', photo);
    formData.append('userId', '1'); // You should use the current user's ID here

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/atk-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post created:', data);
        alert('ATK result uploaded successfully');
      } else {
        setErrorMessage(data.error || 'Error submitting the post');
      }
    } catch (error) {
      setErrorMessage('Error submitting the post');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
          <label className="block text-gray-700">Upload Photo</label>
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

export default AtkUploadForm;
