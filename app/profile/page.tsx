'use client'; // Ensure this file is treated as a client-side component

import { useEffect, useState } from 'react';


const UserProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    console.log('Token:', token); // Log the token for debugging

    if (!token) {
      setError('User is not logged in');
      // Redirect to login if token is not found
      return;
    }

    // Fetch user data from the server
    const fetchUserData = async () => {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in Authorization header
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);  // Store user data
      } else {
        setError(data.message || 'An unexpected error occurred');
      }
    };

    fetchUserData();
  } ); // Ensure this effect runs once on component mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {userData ? (
        <div>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Username:</strong> {userData.name}</p>
          <p><strong>Joined on:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
