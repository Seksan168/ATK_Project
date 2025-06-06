'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // CAPTCHA states
  const [captcha, setCaptcha] = useState<string>('');  // Store generated CAPTCHA
  const [userCaptchaInput, setUserCaptchaInput] = useState<string>('');  // Store user input for captcha

  // Generate a random 4-digit number for CAPTCHA
  useEffect(() => {
    const generateCaptcha = () => {
      const captchaNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
      setCaptcha(captchaNumber.toString()); // Set the generated CAPTCHA
    };
    
    generateCaptcha();
  }, []);  // Run once when the component mounts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (userCaptchaInput !== captcha) {
      setError('Incorrect CAPTCHA. Please try again.');
      return;
    }

    // Clear any previous error message
    setError(null);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Registration successful!');
      router.push("/login");
      setError(null); // Clear any previous error
    } else {
      // If the response status is not OK, display the error message
      setMessage('');
      setError(data.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your Username"
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* CAPTCHA Section */}
          <div className="space-y-2">
            <label htmlFor="captcha" className="block text-sm font-medium text-gray-600">Enter the CAPTCHA</label>
            <div className="bg-gray-100 p-4 text-center text-lg font-semibold mb-4">{captcha}</div>
            <input
              type="text"
              id="captcha"
              name="captcha"
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter the CAPTCHA"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
