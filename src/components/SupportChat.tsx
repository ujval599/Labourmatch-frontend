import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function SupportChat({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) return null;

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setText("");
      }
    } catch {}
    finally { setSending(false); }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600">
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
            <p className="text-white font-bold">Support Chat</p>
            <button onClick={() => setOpen(false)} className="text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 p-4 space-y-2 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center pt-8">Koi bhi sawaal puchho!</p>
            )}
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[80%] ${msg.senderRole === "user" ? "bg-orange-500 text-white" : "bg-white border text-gray-700"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Message likho..."
              className="flex-1 text-sm outline-none px-2 py-1.5 border rounded-lg" />
            <button onClick={sendMessage} disabled={!text.trim() || sending}
              className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}