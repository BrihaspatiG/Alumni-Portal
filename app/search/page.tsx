"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Search() {
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  // Check user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Search function
  const search = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("company", `%${query}%`);

    setResults(data || []);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Search Alumni</h1>

      <input
        placeholder="Search by company"
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mb-2"
      />

      <button
        onClick={search}
        className="bg-purple-500 text-white px-4 py-2 ml-2"
      >
        Search
      </button>

      <div className="mt-4">
        {user ? (
          results.map((u) => (
            <div key={u.id} className="border p-2 mb-2">
              <p>{u.name}</p>
              <p>{u.company}</p>
              <p>{u.skills?.join(", ")}</p>
            </div>
          ))
        ) : (
          <p className="text-red-500">Please login to search alumni</p>
        )}
      </div>
    </div>
  );
}
