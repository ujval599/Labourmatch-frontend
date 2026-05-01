import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle, CheckCheck, Clock, Headphones, ChevronDown } from "lucide-react";

const BASE_URL = "http://localhost:5000";

interface Message {
  id: string;
  text: string;
  senderRole: "user" | "admin";
  isRead: boolean;
  createdAt: string;
}

// ✅ defaultOpen prop add kiya — Contact page se open ho sake
interface SupportChatProps {
  defaultOpen?: boolean;
}

export function SupportChat({ defaultOpen = false }: SupportChatProps) {
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

  // ✅ defaultOpen change hone pe open karo
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
        setMessages(data.data);
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
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10 animate-bounce">
            {unreadCount}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-gray-700 scale-95" : "bg-primary hover:bg-primary/90 hover:scale-110"
          }`}
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
        </button>
      </div>

      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{ height: "480px" }}
      >
        {/* Header */}
        <div className="bg-primary rounded-t-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">LabourMatch Support</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-white/80 text-xs">Online • Usually replies in minutes</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !loading && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Headphones className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[80%]">
                <p className="text-gray-800 text-sm leading-relaxed">
                  👋 Namaste! LabourMatch Support mein aapka swagat hai.
                  <br /><br />
                  Koi bhi sawaal poochh sakte hain — hum 24 ghante mein jawab denge!
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Support Team</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.senderRole === "user";
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isUser ? "bg-primary text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    } ${msg.id.startsWith("temp-") ? "opacity-60" : ""}`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 ${isUser ? "flex-row-reverse" : ""}`}>
                      <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                      {isUser && (
                        msg.id.startsWith("temp-")
                          ? <Clock className="h-2.5 w-2.5 text-gray-300" />
                          : <CheckCheck className={`h-2.5 w-2.5 ${msg.isRead ? "text-primary" : "text-gray-300"}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100">
          {!token ? (
            <div className="text-center py-2">
              <p className="text-gray-500 text-xs">
                Chat ke liye{" "}
                <a href="/auth" className="text-primary font-medium hover:underline">login karo</a>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-primary transition-all">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Message likho..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  newMessage.trim() ? "bg-primary text-white hover:bg-primary/90 active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {sending
                  ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}