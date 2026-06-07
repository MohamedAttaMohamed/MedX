import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import aiLogo from "../../assets/ai-logo-whiteMode.png";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyC1X8_k-f4MACLi-mIJr2KpsoxbywDbt_0",
  });

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askAI = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage, timestamp: new Date() },
    ]);
    setLoading(true);
    setError("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
      });

      const aiText = response.text;
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: aiText,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `❌ Error: ${errorMessage}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
    inputRef.current?.focus();
  };

  const exampleQuestions = [
    {
      icon: "🩺",
      question: "What are the symptoms of diabetes?",
      category: "Symptoms",
    },
    {
      icon: "💊",
      question: "What medications help with high blood pressure?",
      category: "Medications",
    },
    {
      icon: "🏃",
      question: "What exercises are good for heart health?",
      category: "Health Tips",
    },
    {
      icon: "🧠",
      question: "How can I improve my mental health?",
      category: "Mental Health",
    },
    {
      icon: "🥗",
      question: "What is a healthy diet for weight loss?",
      category: "Nutrition",
    },
    {
      icon: "😴",
      question: "How can I improve my sleep quality?",
      category: "Wellness",
    },
  ];

  const formatText = (text) => {
    // Format bold text
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-[#19A7CE]">$1</strong>',
    );

    // Format lists
    text = text.replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>');

    // Format numbered lists
    text = text.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');

    return text;
  };

  return (
    <div className="ask-AI min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={aiLogo} alt="Logo" className="h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  MedX AI Assistant
                </h1>
                <p className="text-xs text-gray-500">Your Health Companion</p>
              </div>
            </Link>

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg">
                <i className="fa-solid fa-trash"></i>
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="text-center space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="inline-block p-6 bg-gradient-to-br from-[#19A7CE] to-[#148AA1] rounded-full shadow-2xl animate-bounce">
                  <img src={logo} alt="AI" className="w-20 h-20" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#19A7CE] to-[#148AA1] bg-clip-text text-transparent">
                  Welcome to MedX AI!
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Your intelligent health assistant powered by advanced AI. Ask
                  me anything about health, symptoms, treatments, or wellness
                  tips.
                </p>
              </div>

              {/* Example Questions Grid */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-6">
                  Try asking about:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exampleQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(item.question)}
                      className="group bg-white hover:bg-gradient-to-br hover:from-[#19A7CE]/10 hover:to-[#148AA1]/10 border-2 border-gray-200 hover:border-[#19A7CE] rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-xl transform hover:-translate-y-1 duration-300">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-[#19A7CE] uppercase tracking-wide">
                            {item.category}
                          </span>
                          <p className="text-gray-800 mt-1 font-medium group-hover:text-[#19A7CE] transition-colors">
                            {item.question}
                          </p>
                        </div>
                        <i className="fa-solid fa-arrow-right text-gray-400 group-hover:text-[#19A7CE] transition-all group-hover:translate-x-1"></i>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <i className="fa-solid fa-bolt text-green-600 text-xl"></i>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Fast Responses
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get instant answers to your health questions
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <i className="fa-solid fa-shield-halved text-blue-600 text-xl"></i>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Reliable Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    Powered by advanced AI technology
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <i className="fa-solid fa-clock text-purple-600 text-xl"></i>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    24/7 Available
                  </h4>
                  <p className="text-sm text-gray-600">
                    Always here to help you
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-4 animate-fadeIn ${
                    msg.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}>
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-[#19A7CE] to-[#148AA1] text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 shadow-md"
                    }`}>
                    {msg.type === "user" ? (
                      <i className="fa-solid fa-user"></i>
                    ) : (
                      <img src={logo} alt="AI" className="w-7 h-7" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex-1 max-w-[85%] md:max-w-[75%] ${
                      msg.type === "user" ? "text-right" : "text-left"
                    }`}>
                    <div
                      className={`inline-block p-4 rounded-2xl shadow-md ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-[#19A7CE] to-[#148AA1] text-white rounded-tr-none"
                          : msg.isError
                            ? "bg-red-50 border border-red-200 rounded-tl-none"
                            : "bg-white border border-gray-200 rounded-tl-none"
                      }`}>
                      <div
                        className={`whitespace-pre-wrap ${msg.type === "ai" && !msg.isError ? "text-gray-800" : ""}`}
                        dangerouslySetInnerHTML={{
                          __html: formatText(msg.text),
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 px-2">
                      {msg.timestamp?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading Animation */}
              {loading && (
                <div className="flex gap-4 animate-fadeIn">
                  <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-md">
                    <img src={logo} alt="AI" className="w-7 h-7" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#19A7CE] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#19A7CE] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}></div>
                      <div
                        className="w-2 h-2 bg-[#19A7CE] rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 md:px-8 py-4 max-w-5xl">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows="1"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={handleKeyDown}
                className="w-full resize-none bg-gray-100 border-2 border-gray-200 focus:border-[#19A7CE] rounded-2xl px-5 py-3 pr-12 outline-none text-gray-800 placeholder-gray-400 transition-all max-h-32 overflow-y-auto"
                placeholder="Type your health question here..."
                disabled={loading}
                style={{ minHeight: "48px" }}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>

            <button
              onClick={askAI}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-[#19A7CE] to-[#148AA1] hover:from-[#148AA1] hover:to-[#19A7CE] text-white px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2">
              <span className="hidden sm:inline">Send</span>
              <i
                className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <i className="fa-solid fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-3">
            AI can make mistakes. Please verify important health information
            with a healthcare professional.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #19a7ce;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #148aa1;
        }
      `}</style>
    </div>
  );
};

export default AskAI;
