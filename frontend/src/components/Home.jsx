import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Promt from "./Promt";
import { Menu } from "lucide-react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promt, setPromt] = useState([]); // shared chat state

  const handleNewChat = () => {
    setPromt([]); // Clear current messages
  };

  const handleSelectChat = (messages) => {
    setPromt(messages); // Load selected history
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#232327] transition-transform z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex-shrink-0`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:ml-64">
        {/* Header for mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="text-xl font-bold">deepseek</div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col overflow-hidden px-2 sm:px-6">
          <Promt promt={promt} setPromt={setPromt} />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
