"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const router = useRouter();

  // 🔐 Protect route
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  // 💾 Save profile + redirect
  const save = async () => {
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      batch,
      company,
      skills: skills.split(","),
      bio,
    });

    alert("Profile saved successfully 🎉");

    router.push("/"); // ✅ REDIRECT TO HOME
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      {/* 🧊 Card */}
      <Card className="w-[450px] p-8 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl z-10">
        <CardContent className="flex flex-col gap-6">
          {/* ✅ FIXED TITLE */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-zinc-400 text-sm">Update your alumni details</p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
            />

            <Input
              placeholder="Batch (e.g. 2022)"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
            />

            <Input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
            />

            <Input
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
            />

            <Textarea
              placeholder="Short Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-zinc-900/70 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={save}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
