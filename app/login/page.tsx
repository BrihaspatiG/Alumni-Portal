"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Logged in");
  };

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Signup successful");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Login / Signup</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 block"
      />

      <button onClick={login} className="bg-blue-500 text-white px-4 py-2 mr-2">
        Login
      </button>
      <button onClick={signup} className="bg-green-500 text-white px-4 py-2">
        Signup
      </button>
    </div>
  );
}
