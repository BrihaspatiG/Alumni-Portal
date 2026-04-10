"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Search() {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  // 🔐 Check user
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

  // 🔍 Search
  const search = async () => {
    if (!query) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .or(`company.ilike.%${query}%,name.ilike.%${query}%`);

    setResults(data || []);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* 🌌 Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      <div className="w-full max-w-4xl z-10 p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">Search Alumni</h1>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Search by name or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
          />

          <Button
            onClick={search}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-[1.03] transition-all"
          >
            Search
          </Button>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-4">
          {results.length > 0 ? (
            results.map((u) => (
              <Card
                key={u.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-[1.02] transition-all"
              >
                <CardContent className="p-4 flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-white">
                    {u.name || "No Name"}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    🏢 {u.company || "No Company"}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {u.skills?.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  {u.bio && (
                    <p className="text-xs text-zinc-500 mt-2">{u.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-zinc-500 col-span-full text-center">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
