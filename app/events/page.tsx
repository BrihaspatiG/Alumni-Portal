"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Events() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  // Check user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Load events
  const load = async () => {
    if (!user) return;

    const { data } = await supabase.from("events").select("*");
    setEvents(data || []);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  // Add event (FIXED)
  const add = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const formattedTime = time ? new Date(time).toISOString() : null;

    const { error } = await supabase.from("events").insert({
      title,
      description,
      event_time: formattedTime,
      created_by: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Event added successfully");

    // Clear inputs
    setTitle("");
    setDescription("");
    setTime("");

    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Events</h1>

      {/* Add Event */}
      <input
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 block"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 block"
      />

      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 mb-2 block"
      />

      <button onClick={add} className="bg-red-500 text-white px-4 py-2">
        Add Event
      </button>

      {/* Show Events */}
      <div className="mt-4">
        {user ? (
          events.map((e) => (
            <div key={e.id} className="border p-2 mb-2">
              <p className="font-bold">{e.title}</p>
              <p>{e.description}</p>
              <p>{e.event_time && new Date(e.event_time).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-red-500">Please login to view events</p>
        )}
      </div>
    </div>
  );
}
