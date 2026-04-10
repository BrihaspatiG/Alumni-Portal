"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      {/* Main Card */}
      <Card className="w-[440px] p-8 bg-zinc-900/70 backdrop-blur-2xl border border-zinc-700 shadow-2xl rounded-2xl z-10">
        <CardContent className="flex flex-col items-center gap-6">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Alumni Portal
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-sm text-center">
            Connect • Collaborate • Grow
          </p>

          {/* User Info */}
          {user && (
            <p className="text-xs text-zinc-500">Logged in as: {user.email}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full mt-2">
            {/* ✅ SHOW ONLY IF NOT LOGGED IN */}
            {!user && (
              <Link href="/login">
                <Button className="w-full bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-white/30 hover:scale-[1.02]">
                  Login / Signup
                </Button>
              </Link>
            )}

            {/* Secondary Buttons */}
            <Link href="/profile">
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 shadow-md hover:shadow-purple-500/20 hover:scale-[1.02]">
                Profile
              </Button>
            </Link>

            <Link href="/search">
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 shadow-md hover:shadow-purple-500/20 hover:scale-[1.02]">
                Search Alumni
              </Button>
            </Link>

            <Link href="/messages">
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 shadow-md hover:shadow-purple-500/20 hover:scale-[1.02]">
                Messages
              </Button>
            </Link>

            <Link href="/events">
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 shadow-md hover:shadow-purple-500/20 hover:scale-[1.02]">
                Events
              </Button>
            </Link>
          </div>

          {/* Logout */}
          {user && (
            <Button
              onClick={logout}
              className="w-full mt-3 bg-red-600 hover:bg-red-500 transition-all duration-300 shadow-md hover:shadow-red-500/30 hover:scale-[1.02]"
            >
              Logout
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-zinc-600">
        Built with Next.js + Supabase
      </p>
    </div>
  );
}
