import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, RefreshCw, Bot, User, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { careerService } from "../services/careerService";
import { toast } from "react-hot-toast";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: string;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am **CareerNavigator**, your personal AI Career Advisor. Ask me anything about career tracks, recommended certifications, tech skills, interview preparation, or portfolio project ideas!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How to prepare for Full Stack interviews?",
    "Suggest high-impact portfolio projects",
    "Give me a 3-month DSA study plan",
    "Compare React vs Next.js for modern jobs",
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await careerService.getChatHistory();
        if (history && history.length > 0) {
          const formatted = history.map((m: any) => ({
            sender: m.sender,
            text: m.text,
          }));
          setMessages(formatted);
        }
      } catch (err: any) {
        toast.error("Failed to load chat history");
      } finally {
        setIsInitializing(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");
    setLoading(true);

    const updatedMessages = [...messages, { sender: "user" as const, text: query }];
    setMessages(updatedMessages);

    try {
      const res = await careerService.counselorChat(query, updatedMessages);
      setMessages([...updatedMessages, { sender: "bot", text: res.answer || res.reply }]);
    } catch (err: any) {
      toast.error(err.message || "Failed to contact advisor");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Response copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let formatted = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      formatted = formatted.replace(boldRegex, "<strong class='text-white font-bold'>$1</strong>");

      if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = formatted.substring(2);
        return (
          <li
            key={i}
            className="ml-4 list-disc mb-1.5 text-slate-300 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h4
            key={i}
            className="text-xs font-extrabold mt-3 mb-1 text-indigo-300 uppercase tracking-wider"
            dangerouslySetInnerHTML={{ __html: formatted.substring(4) }}
          />
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3
            key={i}
            className="text-sm font-extrabold mt-4 mb-2 text-white tracking-tight"
            dangerouslySetInnerHTML={{ __html: formatted.substring(3) }}
          />
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2
            key={i}
            className="text-base font-extrabold mt-4 mb-2 text-white tracking-tight"
            dangerouslySetInnerHTML={{ __html: formatted.substring(2) }}
          />
        );
      }

      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      return (
        <p
          key={i}
          className="mb-2 text-slate-300 leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Autonomous Career Guidance Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Career Advisor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time conversational mentor powered by Gemini AI with custom profile context and market data.
          </p>
        </div>
      </div>

      <div className="flex flex-col bg-gradient-to-br from-[#0c102a]/90 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden h-[640px] relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#070a1e]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center border border-white/20 shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>CareerNavigator</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  AI MENTOR
                </span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 2.5 Flash Counselor Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black/20">
          {isInitializing ? (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-xs text-slate-400">Loading your conversation history...</p>
            </div>
          ) : (
            <>
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3.5 ${m.sender === "user" ? "justify-end" : "justify-start"} group`}>
                  {m.sender === "bot" && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-xl">
                    <div
                      className={`px-5 py-3.5 rounded-2xl text-xs shadow-xl transition-all relative ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs font-medium border border-indigo-400/30 shadow-indigo-600/15"
                          : "bg-[#0b0f26]/90 text-slate-200 border border-white/[0.08] rounded-tl-xs backdrop-blur-md"
                      }`}
                    >
                      {m.sender === "user" ? (
                        <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                      ) : (
                        <div className="space-y-1">{renderMarkdown(m.text)}</div>
                      )}
                    </div>

                    {/* Action buttons on bot messages */}
                    {m.sender === "bot" && (
                      <div className="flex items-center gap-2 mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(m.text, idx)}
                          className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {m.sender === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-white/[0.08] text-slate-300 flex items-center justify-center border border-white/10 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#0b0f26]/90 px-5 py-3.5 border border-white/[0.08] rounded-2xl rounded-tl-xs flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-400 font-medium ml-1.5">Generating advice...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Suggestion Prompt Pills */}
        <div className="px-4 py-2 bg-[#070a1e]/60 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 shrink-0 uppercase tracking-wider">Suggested:</span>
          {quickPrompts.map((qp, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSend(qp)}
              disabled={loading || isInitializing}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-medium border border-white/[0.06] whitespace-nowrap transition-all cursor-pointer hover:-translate-y-0.5"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input tray */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/[0.06] bg-[#070a1e]/90 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || isInitializing}
            placeholder="Ask anything (e.g., 'How to study for Full Stack?', 'Important React interview questions')..."
            className="flex-1 premium-input px-4 py-3 text-xs outline-none transition-all text-white placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || isInitializing}
            className="btn-glow-primary text-white px-5 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 font-bold text-xs gap-2 cursor-pointer shadow-md"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
