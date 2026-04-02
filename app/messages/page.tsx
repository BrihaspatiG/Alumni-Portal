"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  // Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Load users ONLY if logged in
  useEffect(() => {
    if (!user) return;

    const loadUsers = async () => {
      const { data } = await supabase.from("profiles").select("*");
      setUsers(data || []);
    };

    loadUsers();
  }, [user]);

  // Load chat
  const loadChat = async (receiverId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`,
      )
      .order("created_at", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setChat(data || []);
  };

  // Send message (FIXED)
  const send = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!message || !selectedUser) {
      alert("Select user and type message");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: message,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("");
    loadChat(selectedUser.id);
  };

  // ❌ BLOCK UI if not logged in
  if (!user) {
    return (
      <div className="p-10">
        <h1 className="text-2xl text-red-500">
          Please login to access messaging
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 flex gap-6">
      {/* LEFT SIDE - USERS */}
      <div className="w-1/3 border p-4">
        <h2 className="font-bold mb-2">Users</h2>

        {users.map((u) => (
          <div
            key={u.id}
            className="p-2 border mb-2 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSelectedUser(u);
              loadChat(u.id);
            }}
          >
            {u.name} ({u.company})
          </div>
        ))}
      </div>

      {/* RIGHT SIDE - CHAT */}
      <div className="w-2/3 border p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="font-bold mb-2">Chat with {selectedUser.name}</h2>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto mb-4">
              {chat.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${
                    msg.sender_id === user.id ? "text-right" : "text-left"
                  }`}
                >
                  <span className="inline-block bg-gray-300 px-3 py-1 rounded">
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 flex-1"
                placeholder="Type message..."
              />
              <button onClick={send} className="bg-blue-500 text-white px-4">
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chat</p>
        )}
      </div>
    </div>
  );
}
