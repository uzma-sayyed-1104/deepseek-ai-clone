import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bot, Globe, ArrowUp, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import logo from "../../public/logo.png";

function Promt({ promt, setPromt }) {
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const promtEndRef = useRef();

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    setTypeMessage(trimmed);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const { data } = await axios.post(
        "http://localhost:4002/api/v1/deepseekai/promt",
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Update prompt history
      const updatedPromt = [
        ...promt,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ];
      setPromt(updatedPromt);

      // Save to chatList for sidebar
      const chatHistory = JSON.parse(localStorage.getItem("chatList")) || [];
      const newChat = {
        id: Date.now(),
        userId: user?._id,
        title: trimmed.slice(0, 30),
        messages: [
          { role: "user", content: trimmed },
          { role: "assistant", content: data.reply },
        ],
      };

      const updatedHistory = [newChat, ...chatHistory];
      localStorage.setItem("chatList", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("API Error:", error);
      setPromt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content: "❌ Something went wrong with the AI response.",
        },
      ]);
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col h-full px-4 md:px-0 py-8">
        {/* Header */}
        <div className="text-center mb-8 mt-6 md:mt-12">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="DeepSeek Logo" className="h-8" />
            <h1 className="text-3xl font-semibold text-white">Hi, I'm DeepSeek.</h1>
          </div>
          <p className="text-gray-400 mt-2 text-base md:text-sm">
            💬 How can I help you today?
          </p>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
          {promt.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 text-sm whitespace-pre-wrap rounded-xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white max-w-[70%]"
                    : "bg-[#232323] text-white max-w-[90%]"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && typeMessage && (
            <div className="text-white bg-blue-600 px-4 py-3 rounded-2xl text-sm max-w-[70%] self-end ml-auto whitespace-pre-wrap">
              {typeMessage}
            </div>
          )}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
                🤖Loading...
              </div>
            </div>
          )}

          <div ref={promtEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-[#2f2f2f] rounded-[2rem] px-4 py-6 shadow-md w-full">
          <input
            type="text"
            placeholder="💬 Message DeepSeek"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-white placeholder-gray-400 text-base outline-none"
          />

          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-500 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition text-sm">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition text-sm">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promt;
