import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle, CheckCheck, Clock, Headphones, ChevronDown } from "lucide-react";

// ✅ FIX: BASE_URL from env, /api strip karo end se
const BASE_URL = (import.meta.env.VITE_API_URL || "https://labourmatch.onrender.com/api").replace(/\/api$/, "");

interface Message {
  id: string;
  text: string;
  senderRole: "user" | "admin";
  isRead: boolean;
  createdAt: string;
}

interface SupportChatProps {
  defaultOpen?: boolean;
  onClose?: () => void;
}

export function SupportChat({ defaultOpen = false, onClose }: SupportChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (defaultOpen) setIsOpen(true);
  }, [defaultOpen]);

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/support`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(Array.isArray(data.data) ? data.data : []);
        if (!isOpen) {
          const unread = data.data.filter(
            (m: Message) => m.senderRole === "admin" && !m.isRead
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !token) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage("");

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      text,
      senderRole: "user",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`${BASE_URL}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? data.data : m)));
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setNewMessage(text);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setNewMessage(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = today.getDate() - date.getDate();
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10 animate-bounce shadow-lg">
            {unreadCount}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-gray-600 scale-95"
              : "bg-gradient-to-br from-orange-500 to-amber-500 hover:scale-110"
          }`}
        >
          {isOpen
            ? <X className="h-6 w-6 text-white" />
            : <MessageCircle className="h-6 w-6 text-white" />
          }
        </button>
      </div>

      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{ width: "360px", height: "520px" }}
      >
        <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center">
                <Headphones className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm">LabourMatch Support</h3>
              <p className="text-white/80 text-xs">Online • Typically replies in minutes</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronDown className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-3">

            {/* Welcome message */}
            {!loading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Headphones className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-100 max-w-[82%]">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    👋 <strong>Namaste!</strong> LabourMatch Support mein aapka swagat hai.
                    <br /><br />
                    Koi bhi sawaal poochh sakte hain — hum jaldi se jawab denge! 😊
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5">Support Team • LabourMatch</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.senderRole === "user";
                const showDate = idx === 0 ||
                  formatDate(messages[idx - 1].createdAt) !== formatDate(msg.createdAt);

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-2 my-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-medium px-2 bg-gray-50">
                          {formatDate(msg.createdAt)}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}

                    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Headphones className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-sm"
                            : "bg-white text-gray-700 border border-gray-100 rounded-bl-sm"
                        } ${msg.id.startsWith("temp-") ? "opacity-60" : ""}`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                          {isUser && (
                            msg.id.startsWith("temp-")
                              ? <Clock className="h-2.5 w-2.5 text-gray-300" />
                              : <CheckCheck className={`h-2.5 w-2.5 ${msg.isRead ? "text-orange-400" : "text-gray-300"}`} />
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xs">
                          {(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).name?.charAt(0)?.toUpperCase() : "U") || "U"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-100 p-3 flex-shrink-0">
            {!token ? (
              <div className="text-center py-2 px-4">
                <p className="text-gray-500 text-xs mb-2">Chat ke liye login karna hoga</p>
                <a href="/auth"
                  className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                  Login Karo
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus-within:border-orange-400 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Message likho..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    newMessage.trim()
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 active:scale-95 shadow-sm"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {sending
                    ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Send className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
            )}
            <p className="text-[10px] text-gray-300 text-center mt-1.5">Powered by LabourMatch</p>
          </div>
        </div>
      </div>
    </>
  );
}