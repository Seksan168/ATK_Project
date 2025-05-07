"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; // Get token from search params

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Validate token using useEffect
  useEffect(() => {
    if (!token) {
      setError("Invalid or expired token");
      setIsTokenValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch("/api/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setError(data.error || "Invalid or expired token");
        }
      } catch (err) {
        setError("Error verifying token");
      }
    };

    validateToken();
  }, [token]); // Depend on token to re-run when it changes

  // Handle password reset form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Success message
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Error resetting password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Reset Password</h1>

      {message && <div className="text-green-500 mb-4">{message}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isTokenValid ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <div>Invalid or expired token</div>
      )}
    </div>
  );
};

// Wrap the ResetPassword component inside Suspense for handling async data
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
