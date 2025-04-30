"use client";

import { signOut } from "next-auth/react";

export default function Head() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
    localStorage.removeItem("isLoggedIn");
  };

  return (
   <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">My App</h1>
      <nav className="flex space-x-4">
        <a href="/" className="hover:text-gray-400">Home</a>
        <a href="/about" className="hover:text-gray-400">About</a>
        <a href="/contact" className="hover:text-gray-400">Contact</a>
      </nav>
    </header>
  );
}