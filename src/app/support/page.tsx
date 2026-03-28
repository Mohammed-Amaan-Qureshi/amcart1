"use client";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IUser } from "../model/user.model";
import { ClipLoader, SyncLoader } from "react-spinners";
import axios from "axios";
import Image from "next/image";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

interface Message {
  sender: string;
  text: string;
  createdAt: string;
}

function SupportChat() {
  const { userData } = useSelector((state: RootState) => state.user);

  const myId = String(userData?._id);

  const [users, setUsers] = useState<IUser[]>();
  const [activeUser, setActiveUser] = useState<IUser>();
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await axios.get("/api/support/active-users");
        // console.log(res.data);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChatUsers();
  }, []);

  if (!myId) {
    return (
      <div className=" min-h-screen flex items-center bg-black justify-center">
        <SyncLoader color="white" speedMultiplier={0.7} />
      </div>
    );
  }

  const sendMessage = async () => {
    if (!text.trim() || !activeUser) return;
    try {
      const res = await axios.post("/api/support/send", {
        receiverId: activeUser._id,
        text,
      });

      setMessages((prev) => [
        ...prev,
        { sender: myId, text, createdAt: new Date().toISOString() },
      ]);

      setText("");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const res = await axios.post("/api/support/get", {
          withUserId: activeUser?._id,
        });
        console.log(res.data);
        setMessages(res.data);
      } catch (error) {
        console.log("Failed to get messages", error);
      }
    };

    fetchChatMessages();
  }, [activeUser]);

  const getSuggestions = async () => {
    if (!messages.length || !activeUser || !userData?.role) return;

    const lastMessage = messages[messages.length - 1].text;

    setLoadingSuggestions(true);

    try {
      const res = await axios.post("/api/support/ai-suggestions", {
        role: userData.role,
        message: lastMessage,
        targetRole: activeUser.role,
      });

      console.log(res.data.suggestions);
      setSuggestions(res.data.suggestions);
      setLoadingSuggestions(false)
    } catch (error) {
      console.log(error);
      setLoadingSuggestions(false)
    }
  };

  return (
    <div className="min-h-screen w-screen p-6 bg-linear-to-br from-gray-700 via-black to-gray-900 text-white">
      <div className=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 h-[90vh]">
        {/* left div */}
        <div className=" bg-black/50 border border-white/10 rounded-2xl p-4 overflow-y-auto">
          <h2 className=" font-semibold mb-4 text-lg">Support Chats</h2>

          {userData?.role !== "admin" && (
            <p className=" text-xs bg-yellow-800 text-yellow-50 rounded my-1 p-2 leading-relaxed mb-2">
              {userData?.role === "user" && (
                <>
                  <b>Note: </b>The vendor's response may take 1-2 hours. In some
                  cases, you may receive a reply sooner.
                </>
              )}
              {userData?.role === "vendor" && (
                <>
                  <b>Note: </b>The admin's response may take 1-2 hours. In some
                  cases, you may receive a reply sooner.
                </>
              )}
            </p>
          )}

          {users?.length === 0 ? (
            <p className=" text-gray-400 text-sm text-center">
              No Active Users Found
            </p>
          ) : (
            <div className=" space-y-3 mt-3 overflow-y-auto">
              {users?.map((u, i) => (
                <div
                  key={i}
                  onClick={() => setActiveUser(u)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    activeUser?._id === u._id
                      ? "bg-blue-600/20 border border-blue-500/40 shadow-lg"
                      : "hover:bg-white/5 border border-gray-500"
                  }`}
                >
                  <div className=" w-12 h-12 rounded-full overflow-hidden border border-white/20 flex items-center justify-center ">
                    {u.image ? (
                      <Image
                        src={u.image}
                        alt={u.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <FaUserCircle className=" text-gray-400 w-12 h-12" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className=" text-sm font-medium text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-gray-400 truncate text-xs">
                      {u.role === "admin"
                        ? "Admin Support"
                        : u.shopName || u.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right div */}
        <div className=" md:col-span-2 bg-black/50 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {!activeUser ? (
            <div className=" flex-1 flex items-center justify-center text-gray-400">
              Select a chat to start conversation
            </div>
          ) : (
            <>
              {/* message div */}
              <div className=" flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, i) => {
                  const isMe = msg.sender === myId;
                  const avatarUser = isMe ? userData : activeUser;
                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-3 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                          {avatarUser?.image ? (
                            <Image
                              src={avatarUser.image}
                              alt="user"
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          ) : (
                            <FaUserCircle className=" text-gray-400 w-9 h-9" />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white/10 text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {isMe && (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                          {avatarUser?.image ? (
                            <Image
                              src={avatarUser.image}
                              alt="user"
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          ) : (
                            <FaUserCircle className=" text-gray-400 w-9 h-9" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ai suggestions */}
              <div className="px-4 pb-2">
                <button
                  onClick={()=>getSuggestions()}
                  disabled={loadingSuggestions}
                  className=" text-xs px-4 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 disabled:opacity-50 transition z-50 cursor-pointer"
                >
                  {loadingSuggestions ? (
                    <ClipLoader color="white" speedMultiplier={0.6} size={20} />
                  ) : (
                    "Get AI Suggestions"
                  )}
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className=" px-4 pb-2 flex gap-2 flex-wrap">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={()=> setText(s)}
                      className=" text-xs px-3 py-1 rounded-full bg-blue-500/10 text-violet-300 border border-blue-500/30 hover:bg-blue-500/20 transition"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* input & button */}
              <div className=" p-3 border border-white/10 bg-black/60 flex gap-2 ">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/80 text-white border border-white/20 rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={sendMessage}
                  className=" bg-blue-600 hover:bg-blue-700 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <FaPaperPlane className=" text-white text-sm" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportChat;
