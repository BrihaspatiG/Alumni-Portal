"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push("/");
    };
    checkUser();
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else {
      router.push("/");
    }
  };

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Check your email to verify your account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      {/* 🧊 Glass Card */}
      <Card className="w-[400px] p-8 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl z-10">
        <CardContent className="flex flex-col gap-6">
          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">
              Login & Sign Up
            </h1>
            <p className="text-zinc-400 text-sm">
              Login or create your account
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />

            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* 🔥 Primary Button */}
            <Button
              onClick={login}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
            >
              Login
            </Button>

            {/* Secondary */}
            <Button
              onClick={signup}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-300 hover:scale-[1.02]"
            >
              Create Account
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-zinc-500">
            Secure authentication powered by Supabase
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
