"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const save = async () => {
    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("profiles").upsert({
      id: user?.id,
      name,
      batch,
      company,
      skills: skills.split(","),
      bio,
    });

    alert("Profile saved");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Profile</h1>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        placeholder="Batch"
        onChange={(e) => setBatch(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        placeholder="Company"
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        placeholder="Skills (comma separated)"
        onChange={(e) => setSkills(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <textarea
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        className="border p-2 mb-2 block"
      />

      <button onClick={save} className="bg-green-500 text-white px-4 py-2">
        Save Profile
      </button>
    </div>
  );
}
