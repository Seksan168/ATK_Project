'use client';

import Link from 'next/link';

const Header = () => {


  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo or Title */}
        <div className="text-2xl font-bold">
          <Link href="/" className="text-white">
            ATK Result System
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/atk" className="text-white hover:text-gray-200">
                Upload ATK
              </Link>
            </li>
            <li>
              <Link href="/myhistory" className="text-white hover:text-gray-200">
                History
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-white hover:text-gray-200">
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Session and Logout (if logged in) */}
        <div>
        <div>
              <Link href="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
