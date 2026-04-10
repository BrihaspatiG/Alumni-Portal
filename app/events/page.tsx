"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Events() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [events, setEvents] = useState<any[]>([]);

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

  // 📥 Load events
  const load = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_time", { ascending: true });

    setEvents(data || []);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  // ➕ Add event
  const add = async () => {
    if (!user) return;

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

    setTitle("");
    setDescription("");
    setTime("");

    load();
  };

  // 🗑️ Delete event
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    load();
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex justify-center">
      {/* 🌌 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      <div className="w-full max-w-4xl p-6 z-10">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          📅 Events Board
        </h1>

        {/* ➕ Add Event */}
        <Card className="mb-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 shadow-xl">
          <CardContent className="p-5 flex flex-col gap-4">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
            />

            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
            />

            <Input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-white"
            />

            <Button
              onClick={add}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-[1.03] transition-all duration-300 shadow-lg"
            >
              Add Event
            </Button>
          </CardContent>
        </Card>

        {/* 📋 Events List */}
        <div className="grid gap-4">
          {events.length > 0 ? (
            events.map((e) => (
              <Card
                key={e.id}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01] transition-all duration-300"
              >
                <CardContent className="p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    {/* FIXED TITLE COLOR */}
                    <h2 className="text-xl font-semibold text-white">
                      {e.title}
                    </h2>

                    <Button
                      onClick={() => deleteEvent(e.id)}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 transition-all duration-300"
                    >
                      Delete
                    </Button>
                  </div>

                  <p className="text-zinc-300">{e.description}</p>

                  <p className="text-sm text-zinc-400">
                    ⏱{" "}
                    {e.event_time
                      ? new Date(e.event_time).toLocaleString()
                      : "No time"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-zinc-500 text-center">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
