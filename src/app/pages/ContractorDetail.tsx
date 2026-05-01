import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Phone, MapPin, Briefcase, Users, Star,
  CheckCircle2, Shield, Award, ThumbsUp, Camera,
  Play, ZoomIn, ChevronLeft, ChevronRight, X,
  Mail, MessageCircle, Clock, Share2, Heart, Video,
  Upload, Trash2, Plus, Loader2, Send, Lock, AlertCircle,
  Trash, PenLine, CalendarCheck, FileText
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "https://labourmatch.onrender.com";

function getToken(): string | null { return localStorage.getItem("token"); }
function getCurrentUser(): { id: string; name: string; phone?: string } | null {
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
function isContractorRole(): boolean {
  return localStorage.getItem("selectedRole") === "contractor";
}

type ChatMessage = { id: string; text: string; senderRole: "user" | "contractor"; createdAt: string; isRead: boolean; };

function VideoThumbnail({ url, className }: { url: string; className?: string }) {
  return (
    <div className={`bg-gray-900 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Play className="h-6 w-6 text-white fill-white ml-1" />
        </div>
        <span className="text-white/60 text-xs">Video</span>
      </div>
    </div>
  );
}

function StarRating({ value, onChange, size = "md" }: { value: number; onChange?: (v: number) => void; size?: "sm" | "md" | "lg" }) {
  const [hovered, setHovered] = useState(0);
  const cls = size === "lg" ? "h-8 w-8" : size === "md" ? "h-6 w-6" : "h-3.5 w-3.5";
  const active = hovered || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHovered(s)} onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}>
          <Star className={`${cls} transition-colors ${s <= active ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
        </button>
      ))}
    </div>
  );
}

function BookNowModal({ contractor, onClose, onOpenChat }: {
  contractor: any; onClose: () => void; onOpenChat: () => void;
}) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const token = getToken();

  const [view, setView] = useState<"contact" | "form" | "success">("contact");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    workType: contractor.category || "",
    workersNeeded: "1",
    startDate: "",
    endDate: "",
    location: contractor.city || "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { navigate("/auth"); return; }
    if (!form.startDate) { setError("Please select a start date."); return; }

    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          contractorId: contractor.id,
          workersNeeded: parseInt(form.workersNeeded),
          startDate: form.startDate,
          endDate: form.endDate || undefined,
          message: form.message || undefined,
          workType: form.workType || undefined,
          location: form.location || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) setView("success");
      else setError(data.message || "Something went wrong.");
    } catch { setError("Connection failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/30 bg-white/20 flex-shrink-0">
              {contractor.imageUrl
                ? <img src={contractor.imageUrl} alt={contractor.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">{contractor.name?.charAt(0)?.toUpperCase()}</div>}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{contractor.name}</h3>
              <p className="text-white/70 text-xs">{contractor.category} • {contractor.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view === "form" && (
              <button onClick={() => setView("contact")} className="text-white/70 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/20 transition-colors">← Back</button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"><X className="h-4 w-4" /></button>
          </div>
        </div>

        {view === "contact" && (
          <div className="p-5 space-y-3 overflow-y-auto">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2"><CalendarCheck className="h-6 w-6 text-orange-500" /></div>
              <h4 className="font-bold text-gray-800">Contact & Book</h4>
              <p className="text-gray-400 text-xs mt-0.5">Choose how to reach {contractor.name}</p>
            </div>
            <button onClick={() => { if (!token) { onClose(); navigate("/auth"); return; } setView("form"); }}
              className="flex items-center gap-4 w-full bg-orange-50 border-2 border-orange-400 hover:bg-orange-100 text-orange-700 py-3.5 px-4 rounded-2xl font-semibold transition-all group">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"><FileText className="h-5 w-5 text-white" /></div>
              <div className="flex-1 text-left">
                <p className="text-xs text-orange-500 font-medium">Recommended</p>
                <p className="font-bold text-gray-800 text-sm">Send Booking Request</p>
                <p className="text-xs text-gray-400">Fill form — admin & contractor get notified</p>
              </div>
            </button>
            <button onClick={() => { onClose(); onOpenChat(); }}
              className="flex items-center gap-4 w-full bg-gray-50 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-100 py-3.5 px-4 rounded-2xl font-semibold transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"><MessageCircle className="h-5 w-5 text-white" /></div>
              <div className="flex-1 text-left"><p className="text-xs text-gray-400 font-medium">Chat</p><p className="font-bold text-gray-800 text-sm">Message Contractor</p></div>
              <span className="text-gray-400 text-xs">💬</span>
            </button>
            <button onClick={onClose} className="w-full text-gray-400 text-sm py-1.5 hover:text-gray-600">Close</button>
          </div>
        )}

        {view === "form" && (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-5 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                <p className="text-xs text-orange-700 font-medium">📋 Fill this form — Admin & {contractor.name} will be notified immediately</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Your Name <span className="text-red-500">*</span></label>
                <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Your Phone <span className="text-red-500">*</span></label>
                <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10 digit phone number" maxLength={10} className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Work Type</label>
                <input type="text" value={form.workType} onChange={e => setForm(f => ({ ...f, workType: e.target.value }))} placeholder="e.g. Construction, Shifting" className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Workers Needed <span className="text-red-500">*</span></label>
                  <input required type="number" min="1" max="500" value={form.workersNeeded} onChange={e => setForm(f => ({ ...f, workersNeeded: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Start Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.startDate} min={new Date().toISOString().split("T")[0]} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} min={form.startDate || new Date().toISOString().split("T")[0]} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Work location" className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Additional Requirements</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Any specific requirements..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              {error && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"><AlertCircle className="h-4 w-4 flex-shrink-0" />{error}</div>}
            </div>
            <div className="px-5 pb-5 flex-shrink-0">
              <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><CalendarCheck className="h-4 w-4" /> Send Booking Request</>}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">Admin & contractor will be notified via email</p>
            </div>
          </form>
        )}

        {view === "success" && (
          <div className="p-6 overflow-y-auto">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="h-8 w-8 text-green-500" /></div>
              <h3 className="text-xl font-bold text-gray-800">Booking Request Sent! 🎉</h3>
              <p className="text-gray-400 text-xs mt-1">Your request has been submitted successfully</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-orange-600 mb-3 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Contractor Contact Details</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-orange-200 flex-shrink-0">
                  {contractor.imageUrl ? <img src={contractor.imageUrl} alt={contractor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-lg">{contractor.name?.charAt(0)}</div>}
                </div>
                <div><p className="font-bold text-gray-800">{contractor.name}</p><p className="text-xs text-gray-500">{contractor.category} • {contractor.city}</p></div>
              </div>
              {contractor.phone && (
                <a href={`tel:${contractor.phone}`} className="flex items-center gap-3 bg-white border border-green-200 hover:border-green-400 rounded-xl px-4 py-3 mb-2 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0"><Phone className="h-4 w-4 text-white" /></div>
                  <div className="flex-1"><p className="text-xs text-green-600 font-medium">Mobile Number</p><p className="font-bold text-gray-800">{contractor.phone}</p></div>
                  <span className="text-green-500 text-xs font-medium">📞 Call</span>
                </a>
              )}
              {contractor.email && (
                <a href={`mailto:${contractor.email}`} className="flex items-center gap-3 bg-white border border-blue-200 hover:border-blue-400 rounded-xl px-4 py-3 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0"><Mail className="h-4 w-4 text-white" /></div>
                  <div className="flex-1"><p className="text-xs text-blue-600 font-medium">Email</p><p className="font-bold text-gray-800 text-sm truncate">{contractor.email}</p></div>
                </a>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Admin notified via email</div>
              <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Contractor notified via email</div>
              <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Booking saved in dashboard</div>
            </div>
            <button onClick={onClose} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewModal({ contractorId, contractorName, onClose, onSuccess }: {
  contractorId: string; contractorName: string; onClose: () => void; onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notLoggedIn] = useState(!getToken());
  const navigate = useNavigate();
  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${contractorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) { onSuccess(); onClose(); }
      else setError(data.message || "Failed to submit review.");
    } catch { setError("Connection failed."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 flex items-center justify-between">
          <div><h3 className="text-white font-bold text-base">Rate & Review</h3><p className="text-white/70 text-xs">{contractorName}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">
          {notLoggedIn ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3"><Lock className="h-7 w-7 text-orange-500" /></div>
              <h4 className="font-bold text-gray-800 mb-2">Login Required</h4>
              <p className="text-gray-500 text-sm mb-4">Login to submit a review.</p>
              <button onClick={() => { onClose(); navigate("/auth"); }} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-sm">Login to Continue</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">How would you rate this contractor?</p>
                <div className="flex justify-center mb-2"><StarRating value={rating} onChange={setRating} size="lg" /></div>
                {rating > 0 && <span className={`text-sm font-semibold px-3 py-1 rounded-full ${rating >= 4 ? "bg-green-100 text-green-600" : rating === 3 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>{ratingLabels[rating]}</span>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Your Review <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              {error && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"><AlertCircle className="h-4 w-4 flex-shrink-0" />{error}</div>}
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting || rating === 0} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4 fill-white" />} Submit Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat Board — FIXED ───────────────────────────────────────────
function ChatBoard({ contractor, onClose }: { contractor: any; onClose: () => void }) {
  // ✅ FIX: Always initialize as empty array
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const token = getToken();
  const currentUser = getCurrentUser();

  const fetchMessages = useCallback(async (silent = false) => {
    if (!token) { setNotLoggedIn(true); setLoading(false); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/chat/${contractor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) { setNotLoggedIn(true); setLoading(false); return; }
      const data = await res.json();
      if (data.success) {
        // ✅ FIX: Array check — null/undefined se crash nahi hoga
        setMessages(Array.isArray(data.data) ? data.data : []);
        setError("");
      }
    } catch { if (!silent) setError("Could not connect to server."); }
    finally { if (!silent) setLoading(false); }
  }, [contractor.id, token]);

  useEffect(() => {
    fetchMessages();
    pollingRef.current = setInterval(() => fetchMessages(true), 4000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchMessages]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (!notLoggedIn && !loading) inputRef.current?.focus(); }, [notLoggedIn, loading]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setSending(true); setInputText("");
    try {
      const res = await fetch(`${BASE_URL}/api/chat/${contractor.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        // ✅ FIX: Safe spread
        setMessages(prev => [...(Array.isArray(prev) ? prev : []), data.data]);
        await fetchMessages(true);
      } else { setError(data.message || "Failed to send."); setInputText(text); }
    } catch { setError("Connection failed."); setInputText(text); }
    finally { setSending(false); }
  };

  const clearChat = async () => {
    if (!confirm("Clear entire chat history?")) return;
    try {
      await fetch(`${BASE_URL}/api/chat/${contractor.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setMessages([]);
    } catch { setError("Could not clear chat."); }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  // ✅ FIX: Safe reduce — array check pehle
  const safeMessages = Array.isArray(messages) ? messages : [];
  const groupedMessages = safeMessages.reduce<{ date: string; msgs: ChatMessage[] }[]>((acc, msg) => {
    const date = formatDate(msg.createdAt);
    const last = acc[acc.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else acc.push({ date, msgs: [msg] });
    return acc;
  }, []);

  if (notLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:px-4" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between">
            <p className="text-white font-bold text-sm">Message {contractor.name}</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="h-8 w-8 text-orange-500" /></div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6">Login to message contractors.</p>
            <button onClick={() => { onClose(); navigate("/auth"); }} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90">Login to Continue</button>
            <button onClick={onClose} className="w-full mt-2 text-gray-400 text-sm py-2 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:px-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl" style={{ height: "min(620px, 92vh)" }}>
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 flex-shrink-0">
            {contractor?.imageUrl ? <img src={contractor.imageUrl} alt={contractor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">{contractor?.name?.charAt(0)?.toUpperCase()}</div>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{contractor?.name}</p>
            <p className="text-white/70 text-xs">{contractor?.category} • {contractor?.city}</p>
          </div>
          <div className="flex items-center gap-1">
            {safeMessages.length > 0 && <button onClick={clearChat} className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center text-white transition-colors"><Trash className="h-3.5 w-3.5" /></button>}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"><X className="h-4 w-4" /></button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-xs flex-1">{error}</p>
            <button onClick={() => setError("")}><X className="h-3.5 w-3.5 text-red-400" /></button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 rounded-full border-orange-200 border-t-orange-500 animate-spin" style={{ borderWidth: 3, borderStyle: "solid" }} />
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          ) : safeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center"><MessageCircle className="h-7 w-7 text-orange-400" /></div>
              <div><p className="font-semibold text-gray-700 text-sm">Start a conversation</p><p className="text-gray-400 text-xs mt-1">Send a message to {contractor.name}</p></div>
            </div>
          ) : (
            <div className="space-y-1">
              {groupedMessages.map(group => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-medium px-2">{group.date}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {group.msgs.map(msg => {
                    const isMe = msg.senderRole === "user";
                    return (
                      <div key={msg.id} className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
                        {!isMe && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs mr-2 flex-shrink-0 mt-auto mb-4">{contractor?.name?.charAt(0)?.toUpperCase()}</div>}
                        <div className={`max-w-[72%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isMe ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-sm" : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-sm"}`}>{msg.text}</div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                            {formatTime(msg.createdAt)}
                            {isMe && <span className={msg.isRead ? "text-blue-400" : "text-gray-300"}>{msg.isRead ? "✓✓" : "✓"}</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {sending && (
            <div className="flex justify-end mt-2">
              <div className="bg-orange-100 rounded-2xl rounded-br-sm px-3.5 py-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {currentUser && <div className="px-4 py-1.5 bg-white border-t border-gray-100 flex-shrink-0"><p className="text-[10px] text-gray-400 text-center">Messaging as <span className="font-semibold text-gray-500">{currentUser.name}</span></p></div>}

        <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5">
            <input ref={inputRef} type="text" value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={`Message ${contractor?.name?.split(" ")[0]}...`}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" disabled={sending} />
          </div>
          <button onClick={sendMessage} disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white hover:opacity-90 disabled:opacity-40 flex-shrink-0 shadow-md">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ media, startIndex, onClose }: { media: any[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const cur = media[idx];
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx(i => Math.min(media.length - 1, i + 1));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <div><p className="text-white font-semibold text-sm">{cur?.projectName || cur?.caption || "Work Media"}</p><p className="text-white/50 text-xs mt-0.5">{idx + 1} / {media.length}</p></div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 relative flex items-center justify-center px-16 min-h-0">
        {cur?.type === "video" ? <video key={cur.url} src={cur.url} controls autoPlay className="max-h-[68vh] max-w-full rounded-xl" /> : <img key={cur?.url} src={cur?.url} alt="" className="max-h-[68vh] max-w-full object-contain rounded-xl" />}
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20"><ChevronLeft className="h-6 w-6" /></button>
        <button onClick={() => setIdx(i => Math.min(media.length - 1, i + 1))} disabled={idx === media.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20"><ChevronRight className="h-6 w-6" /></button>
      </div>
      <div className="flex gap-2 px-4 py-4 overflow-x-auto justify-center flex-shrink-0">
        {media.map((m, i) => (
          <button key={m.id || i} onClick={() => setIdx(i)} className={`relative flex-shrink-0 w-14 h-11 rounded-lg overflow-hidden transition-all ${i === idx ? "ring-2 ring-orange-500 opacity-100" : "opacity-40 hover:opacity-70"}`}>
            {m.type === "video" ? <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Play className="h-3 w-3 text-white fill-white" /></div> : <img src={m.thumbnail || m.url} alt="" className="w-full h-full object-cover" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const name = review.user?.name || review.clientName || "Anonymous";
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-white font-bold text-sm">{name?.charAt(0)?.toUpperCase()}</div>
          <div><p className="font-semibold text-gray-800 text-sm">{name}</p><p className="text-xs text-gray-400">{date}</p></div>
        </div>
        <StarRating value={review.rating || 0} size="sm" />
      </div>
      {review.comment && <p className="text-sm text-gray-600 leading-relaxed mt-2">{review.comment}</p>}
    </div>
  );
}

function UploadModal({ contractorId, onClose, onSuccess }: { contractorId: string; onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [projectName, setProjectName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File is larger than 20MB"); return; }
    setFile(f); setError(""); setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a file first"); return; }
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file, file.name.replace(/\s+/g, "-"));
      fd.append("caption", caption); fd.append("projectName", projectName);
      fd.append("type", file.type.startsWith("video") ? "video" : "image");
      const res = await fetch(`${BASE_URL}/api/work-media/${contractorId}`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { onSuccess(); onClose(); }
      else setError(data.message || "Upload failed");
    } catch { setError("Could not connect to server"); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Upload Work Photos/Videos</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all mb-4">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Upload className="h-7 w-7 text-orange-500" /></div>
            <p className="font-semibold text-gray-700 mb-1">Select a photo or video</p>
            <p className="text-xs text-gray-400">JPG, PNG, MP4 • Max 20MB</p>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
          </div>
        ) : (
          <div className="relative mb-4 rounded-2xl overflow-hidden bg-black">
            {file?.type.startsWith("video") ? <video src={preview} className="w-full h-48 object-contain" controls /> : <img src={preview} alt="" className="w-full h-48 object-contain" />}
            <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"><X className="h-4 w-4" /></button>
          </div>
        )}
        <div className="space-y-3 mb-5">
          <input type="text" placeholder="Project name (optional)" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          <input type="text" placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <button onClick={handleUpload} disabled={uploading || !file} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload</>}
        </button>
      </div>
    </div>
  );
}

export default function ContractorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [workMedia, setWorkMedia] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "work" | "reviews">("overview");
  const [mediaFilter, setMediaFilter] = useState<"all" | "image" | "video">("all");
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const [liked, setLiked] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showBookNow, setShowBookNow] = useState(false);
  const isContractor = isContractorRole();

  const fetchContractor = () => {
    fetch(`${BASE_URL}/api/contractors/${id}`)
      .then(r => r.json()).then(d => { setContractor(d.data); setLoading(false); }).catch(() => setLoading(false));
  };
  const fetchWorkMedia = () => {
    fetch(`${BASE_URL}/api/work-media/${id}`)
      .then(r => r.json()).then(d => { if (d.success) setWorkMedia(Array.isArray(d.data) ? d.data : []); }).catch(() => {});
  };
  const fetchReviews = () => {
    fetch(`${BASE_URL}/api/reviews/${id}`)
      .then(r => r.json()).then(d => { if (d.success) setReviews(Array.isArray(d.data) ? d.data : []); }).catch(() => {});
  };
  const deleteMedia = async (mediaId: string) => {
    if (!confirm("Delete this media?")) return;
    try { await fetch(`${BASE_URL}/api/work-media/${mediaId}`, { method: "DELETE" }); fetchWorkMedia(); } catch {}
  };

  useEffect(() => { fetchContractor(); fetchWorkMedia(); fetchReviews(); }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-orange-50">
      <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading contractor details...</p>
    </div>
  );

  if (!contractor) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-orange-50">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center"><Briefcase className="h-8 w-8 text-orange-300" /></div>
      <p className="text-gray-500 font-medium">Contractor not found</p>
      <button onClick={() => navigate("/contractors")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-200 text-orange-600 font-semibold text-sm hover:bg-orange-50">
        <ArrowLeft className="h-4 w-4" /> Go Back
      </button>
    </div>
  );

  const filteredMedia = mediaFilter === "all" ? workMedia : workMedia.filter(m => m.type === mediaFilter);
  const imgCount = workMedia.filter(m => m.type === "image").length;
  const vidCount = workMedia.filter(m => m.type === "video").length;
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : contractor.rating;

  return (
    <>
      {lightbox.open && filteredMedia.length > 0 && <Lightbox media={filteredMedia} startIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />}
      {showUpload && isContractor && <UploadModal contractorId={id!} onClose={() => setShowUpload(false)} onSuccess={fetchWorkMedia} />}
      {showChat && <ChatBoard contractor={contractor} onClose={() => setShowChat(false)} />}
      {showReview && <ReviewModal contractorId={id!} contractorName={contractor.name} onClose={() => setShowReview(false)} onSuccess={() => { fetchReviews(); fetchContractor(); }} />}
      {showBookNow && <BookNowModal contractor={contractor} onClose={() => setShowBookNow(false)} onOpenChat={() => setShowChat(true)} />}

      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 overflow-hidden">
          <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/[0.08] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-400/15 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 pt-4 flex items-center justify-between">
            <button onClick={() => navigate("/contractors")} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
            <div className="flex gap-2">
              <button onClick={() => setLiked(l => !l)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${liked ? "bg-red-500" : "bg-white/20 hover:bg-white/30"}`}>
                <Heart className={`h-4 w-4 text-white ${liked ? "fill-white" : ""}`} />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"><Share2 className="h-4 w-4 text-white" /></button>
            </div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 pt-6 pb-24">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/35 shadow-xl bg-white/20">
                  {contractor.imageUrl ? <img src={contractor.imageUrl} alt={contractor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl">{contractor.name?.charAt(0)?.toUpperCase()}</div>}
                </div>
                {contractor.verified && <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 shadow"><CheckCircle2 className="h-4 w-4 text-white" /></div>}
              </div>
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold tracking-tight">{contractor.name}</h1>
                  {contractor.verified && <span className="bg-green-500/20 border border-green-400/30 text-green-200 text-xs px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-white/75 text-sm mb-3">
                  {contractor.city && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{contractor.city}</span>}
                  {contractor.category && <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{contractor.category}</span>}
                  {contractor.workers && <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{contractor.workers} Workers</span>}
                  {contractor.experienceYrs && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{contractor.experienceYrs} years exp</span>}
                </div>
                {avgRating > 0 && (
                  <div className="flex items-center gap-3">
                    <StarRating value={Math.round(avgRating)} size="lg" />
                    <span className="text-white font-bold text-lg">{Number(avgRating).toFixed(1)}</span>
                    <span className="text-white/60 text-sm">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <button onClick={() => setShowBookNow(true)} className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-3.5 rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <CalendarCheck className="h-5 w-5" /> Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: <Star className="h-4 w-4 text-amber-500 fill-amber-500" />, val: avgRating > 0 ? Number(avgRating).toFixed(1) : "N/A", lbl: "Rating" },
              { icon: <MessageCircle className="h-4 w-4 text-blue-500" />, val: reviews.length, lbl: "Reviews" },
              { icon: <Briefcase className="h-4 w-4 text-green-500" />, val: contractor.completedJobs || 0, lbl: "Jobs Done" },
              { icon: <Camera className="h-4 w-4 text-orange-500" />, val: workMedia.length, lbl: "Work Media" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-4 px-2 gap-1">
                <div className="flex items-center gap-1.5">{s.icon}<span className="text-xl font-extrabold text-gray-800">{s.val}</span></div>
                <span className="text-xs text-gray-400 font-medium">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-5">
                {([
                  { key: "overview", label: "Overview" },
                  { key: "work", label: `Work (${workMedia.length})` },
                  { key: "reviews", label: `Reviews (${reviews.length})` },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="space-y-4">
                  {(contractor.priceMin || contractor.priceMax) && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><span className="text-orange-500 text-base">₹</span> Price Range</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-orange-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Minimum</p><p className="text-2xl font-extrabold text-orange-600">₹{contractor.priceMin?.toLocaleString()}</p></div>
                        <span className="text-gray-300 font-bold text-xl">—</span>
                        <div className="flex-1 bg-amber-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Maximum</p><p className="text-2xl font-extrabold text-amber-600">₹{contractor.priceMax?.toLocaleString()}</p></div>
                      </div>
                    </div>
                  )}
                  {contractor.description && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-orange-500" /> About</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{contractor.description}</p>
                    </div>
                  )}
                  {workMedia.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm"><Camera className="h-4 w-4 text-orange-500" /> Work Highlights</h3>
                        <button onClick={() => setTab("work")} className="text-xs text-orange-500 font-semibold hover:underline">View All →</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {workMedia.slice(0, 6).map((m, i) => (
                          <button key={m.id || i} onClick={() => { setMediaFilter("all"); setLightbox({ open: true, index: i }); }} className="relative aspect-square rounded-xl overflow-hidden group">
                            {m.type === "video" ? <VideoThumbnail url={m.url} className="w-full h-full" /> : <img src={m.thumbnail || m.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />}
                            {m.type === "video" && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Play className="h-6 w-6 text-white fill-white" /></div>}
                            {i === 5 && workMedia.length > 6 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white font-bold text-lg">+{workMedia.length - 6}</span></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {reviews.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-amber-500" /> Latest Review</h3>
                        <button onClick={() => setTab("reviews")} className="text-xs text-orange-500 font-semibold hover:underline">View All →</button>
                      </div>
                      <ReviewCard review={reviews[0]} />
                    </div>
                  )}
                </div>
              )}

              {tab === "work" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: "all", label: `All (${workMedia.length})` },
                        { key: "image", label: `Photos (${imgCount})`, icon: <Camera className="h-3 w-3" /> },
                        { key: "video", label: `Videos (${vidCount})`, icon: <Video className="h-3 w-3" /> },
                      ].map(f => (
                        <button key={f.key} onClick={() => setMediaFilter(f.key as any)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mediaFilter === f.key ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                          {f.icon} {f.label}
                        </button>
                      ))}
                    </div>
                    {isContractor && (
                      <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm">
                        <Plus className="h-4 w-4" /> Add Photo/Video
                      </button>
                    )}
                  </div>
                  {filteredMedia.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                      <Camera className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm mb-4">No media available</p>
                      {isContractor && <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 mx-auto"><Plus className="h-4 w-4" /> Add First Photo/Video</button>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredMedia.map((m, i) => (
                        <div key={m.id || i} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all">
                          <button onClick={() => setLightbox({ open: true, index: i })} className="w-full text-left">
                            <div className="aspect-square relative overflow-hidden">
                              {m.type === "video" ? <VideoThumbnail url={m.url} className="w-full h-full" /> : <img src={m.thumbnail || m.url} alt={m.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                              {m.type === "video" && <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Play className="h-5 w-5 text-orange-500 fill-orange-500 ml-0.5" /></div></div>}
                              {m.type === "image" && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="h-7 w-7 text-white drop-shadow-lg" /></div>}
                              <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${m.type === "video" ? "bg-red-500" : "bg-black/50"}`}>{m.type === "video" ? "VIDEO" : "IMG"}</span>
                            </div>
                          </button>
                          {isContractor && <button onClick={() => deleteMedia(m.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 className="h-3.5 w-3.5" /></button>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-5xl font-black text-gray-800">{Number(avgRating).toFixed(1)}</p>
                          <StarRating value={Math.round(avgRating)} size="sm" />
                          <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map(star => {
                            const cnt = reviews.filter(r => Math.round(r.rating) === star).length;
                            const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-4 text-right">{star}</span>
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                                <span className="text-xs text-gray-400 w-5">{cnt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setShowReview(true)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-2xl font-semibold text-sm hover:opacity-90 shadow-sm">
                    <PenLine className="h-4 w-4" /> Write a Review
                  </button>
                  {reviews.length === 0 ? (
                    <div className="text-center py-14 bg-white rounded-2xl border border-gray-100">
                      <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm mb-3">No reviews yet. Be the first!</p>
                      <button onClick={() => setShowReview(true)} className="text-orange-500 font-semibold text-sm hover:underline">Write a Review →</button>
                    </div>
                  ) : (
                    <div className="space-y-3">{reviews.map((r, i) => <ReviewCard key={r.id || i} review={r} />)}</div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:w-64 flex-shrink-0 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:sticky lg:top-4">
                <button onClick={() => setShowBookNow(true)} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 px-4 rounded-xl font-bold text-base hover:opacity-90 mb-3 shadow-md">
                  <CalendarCheck className="h-5 w-5" /> Book Now
                </button>
                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2.5">
                  {(contractor.priceMin || contractor.priceMax) && <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="font-semibold text-gray-800">₹{contractor.priceMin}–₹{contractor.priceMax}/day</span></div>}
                  {contractor.workers && <div className="flex justify-between text-sm"><span className="text-gray-500">Workers</span><span className="font-semibold text-gray-800">{contractor.workers}</span></div>}
                  {contractor.city && <div className="flex justify-between text-sm"><span className="text-gray-500">City</span><span className="font-semibold text-gray-800">{contractor.city}</span></div>}
                  {contractor.category && <div className="flex justify-between text-sm"><span className="text-gray-500">Category</span><span className="font-semibold text-gray-800">{contractor.category}</span></div>}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Why Trust Us?</h3>
                {[
                  { icon: <Shield className="h-4 w-4 text-green-500" />, text: "Identity Verified" },
                  { icon: <Award className="h-4 w-4 text-amber-500" />, text: "Top Rated Contractor" },
                  { icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />, text: "Background Check Done" },
                  { icon: <ThumbsUp className="h-4 w-4 text-orange-500" />, text: "95% Client Satisfaction" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5 mb-2.5 last:mb-0">{b.icon}<span className="text-xs text-gray-600 font-medium">{b.text}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}