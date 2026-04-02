"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    alert("Logged out successfully");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-100">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-10">🎓 Alumni Networking Portal</h1>

      {/* Navigation */}
      <div className="flex flex-col gap-4 w-64">
        <Link href="/login">
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Login / Signup
          </button>
        </Link>

        <Link href="/profile">
          <button className="w-full bg-green-500 text-white py-2 rounded">
            Profile
          </button>
        </Link>

        <Link href="/search">
          <button className="w-full bg-purple-500 text-white py-2 rounded">
            Search Alumni
          </button>
        </Link>

        <Link href="/messages">
          <button className="w-full bg-yellow-500 text-white py-2 rounded">
            Messaging
          </button>
        </Link>

        <Link href="/events">
          <button className="w-full bg-red-500 text-white py-2 rounded">
            Events
          </button>
        </Link>
      </div>

      {/* Logout Button (only if logged in) */}
      {user && (
        <button
          onClick={logout}
          className="bg-red text-white px-4 py-2 mb-6 rounded"
        >
          Logout
        </button>
      )}

      {/* Footer */}
      <p className="mt-10 text-sm text-gray-500">
        Built using Next.js + Supabase
      </p>
    </div>
  );
}
