import React, { useEffect, useState } from "react";
import { LogOut, X, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar({ onClose, onSelectChat, onNewChat }) {
  const [chatList, setChatList] = useState([]);
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Load user's chat history
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chatList")) || [];
    const userChats = stored.filter((chat) => chat.userId === user?._id);
    setChatList(userChats);
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4002/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("chatList");

      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout Failed");
    }
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat(); // clear chat in parent
  };

  const handleClearHistory = () => {
    const allChats = JSON.parse(localStorage.getItem("chatList")) || [];
    const filtered = allChats.filter((chat) => chat.userId !== user?._id);

    localStorage.setItem("chatList", JSON.stringify(filtered));
    setChatList([]);
  };

  const handleChatClick = (chat) => {
    if (onSelectChat) onSelectChat(chat.messages);
  };

  return (
    <div className="h-full flex flex-col justify-between p-4">
      {/* Header */}
      <div>
        <div className="flex border-b border-gray-600 p-2 justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-200">deepseek</div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 md:hidden" />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2 px-4">
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl"
            onClick={handleNewChat}
          >
            + New Chat
          </button>

          <button
            className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2"
            onClick={handleClearHistory}
          >
            <Trash2 size={16} />
            Clear History
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {chatList.length === 0 ? (
            <div className="text-gray-500 text-sm mt-20 text-center">
              No chat history yet
            </div>
          ) : (
            chatList.map((chat, index) => (
              <div
                key={index}
                onClick={() => handleChatClick(chat)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm truncate cursor-pointer hover:bg-gray-700 transition"
                title={chat.title}
              >
                {chat.title.length > 35
                  ? chat.title.slice(0, 35) + "..."
                  : chat.title}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-1 border-t border-gray-600">
        <div className="flex items-center gap-2 cursor-pointer my-3">
          <img
            src="https://i.pravatar.cc/32"
            alt="profile"
            className="rounded-full w-8 h-8"
          />
          <span className="text-gray-300 font-bold">
            {user ? user?.firstName : "My Profile"}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
