"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const router = useRouter();

  // 🔐 Get user
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

  // 👥 Load users
  useEffect(() => {
    if (!user) return;

    const loadUsers = async () => {
      const { data } = await supabase.from("profiles").select("*");
      setUsers(data || []);
    };

    loadUsers();
  }, [user]);

  // 💬 Load chat
  const loadChat = async (receiverId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`,
      )
      .order("created_at", { ascending: true });

    setChat(data || []);
  };

  // ✉️ Send message
  const send = async () => {
    if (!message || !selectedUser) return;

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: message,
    });

    setMessage("");
    loadChat(selectedUser.id);
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/20 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full bottom-[-150px] right-[-150px]" />

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 max-w-xs border-r border-white/10 bg-white/5 backdrop-blur-xl p-4 z-10">
        <h2 className="text-lg font-semibold mb-4">Alumni</h2>

        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                loadChat(u.id);
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedUser?.id === u.id
                  ? "bg-purple-600/30"
                  : "hover:bg-white/10"
              }`}
            >
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-zinc-400">{u.company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col p-4 z-10">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="border-b border-white/10 pb-3 mb-3">
              <h2 className="text-lg font-semibold">
                Chat with {selectedUser.name}
              </h2>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 pr-2">
              {chat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                      msg.sender_id === user.id
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        : "bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500"
              />

              <Button
                onClick={send}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-[1.05] transition-all"
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
}
