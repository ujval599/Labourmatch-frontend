// src/app/pages/ContractorProfile.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Camera, Upload, Star, MapPin, Phone, Mail, Briefcase,
  Users, Eye, CheckCircle, Plus, Trash2, Video, X, Edit2, Save,
  Award, Clock, MessageCircle, Heart, Loader2, Send,
  CalendarCheck, TrendingUp, Crown, AlertCircle, Play, ZoomIn,
  ChevronLeft, ChevronRight, Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const BASE_URL = "http://localhost:5000";

function getToken() { return localStorage.getItem("token"); }

// ── Star Rating ───────────────────────────────────────────────────
function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(value) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

// ── Upload Modal ──────────────────────────────────────────────────
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
    if (f.size > 20 * 1024 * 1024) { setError("File 20MB se bada hai"); return; }
    setFile(f); setError(""); setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) { setError("Pehle file select karo"); return; }
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file, file.name.replace(/\s+/g, "-"));
      fd.append("caption", caption);
      fd.append("projectName", projectName);
      fd.append("type", file.type.startsWith("video") ? "video" : "image");
      const res = await fetch(`${BASE_URL}/api/work-media/${contractorId}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) { onSuccess(); onClose(); }
      else setError(data.message || "Upload failed");
    } catch { setError("Connection failed"); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Work Photo/Video Upload</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all mb-4">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Upload className="h-7 w-7 text-orange-500" /></div>
            <p className="font-semibold text-gray-700 mb-1">Select a photo or video.</p>
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

// ── Chat Section ──────────────────────────────────────────────────
function ChatSection({ contractorId, chatUsers }: { contractorId: string; chatUsers: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ FIX 1: Contractor wali route use karo — /api/chat/contractor/:userId
  const fetchChat = useCallback(async (userId: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/chat/contractor/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, [contractorId]);

  useEffect(() => {
    if (selectedUser) {
      fetchChat(selectedUser.user.id);
      pollingRef.current = setInterval(() => fetchChat(selectedUser.user.id, true), 4000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [selectedUser, fetchChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ✅ FIX 2: Reply ka sahi URL — /api/chat/contractor/:userId/reply
  const sendReply = async () => {
    if (!replyText.trim() || !selectedUser || sending) return;
    setSending(true);
    const text = replyText.trim();
    setReplyText("");
    try {
      const res = await fetch(`${BASE_URL}/api/chat/contractor/${selectedUser.user.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ text }), // ✅ sirf text — userId URL mein hai
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        fetchChat(selectedUser.user.id, true);
      }
    } catch {}
    finally { setSending(false); }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex gap-4 h-[560px]">
      {/* Users List */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">Messages</h3>
          <p className="text-xs text-gray-400 mt-0.5">{chatUsers.length} conversations</p>
        </div>
        {chatUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <MessageCircle className="h-10 w-10 text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">No messages yet.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {chatUsers.map((cu: any) => (
              <button key={cu.user.id} onClick={() => setSelectedUser(cu)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedUser?.user.id === cu.user.id ? "bg-orange-50 border-l-2 border-orange-500" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">{cu.user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800 text-sm truncate">{cu.user.name}</p>
                      {cu.unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1">{cu.unreadCount}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{cu.user.phone}</p>
                    {cu.lastMessage && <p className="text-xs text-gray-400 truncate mt-0.5">{cu.lastMessage.text}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">Select a conversation.</h3>
            <p className="text-gray-400 text-sm">Click on a user on the left to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold">{selectedUser.user.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{selectedUser.user.name}</p>
                <p className="text-xs text-gray-400">{selectedUser.user.phone}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-orange-400" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No messages yet.</div>
              ) : (
                messages.map(msg => {
                  const isContractor = msg.senderRole === "contractor";
                  return (
                    <div key={msg.id} className={`flex ${isContractor ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[72%] flex flex-col ${isContractor ? "items-end" : "items-start"}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${isContractor ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-sm" : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-sm"}`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-orange-400 transition-all">
                <input type="text" value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendReply()}
                  placeholder={`Reply to ${selectedUser.user.name}...`}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                <button onClick={sendReply} disabled={!replyText.trim() || sending}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${replyText.trim() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function ContractorProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isContractorVerified, setIsContractorVerified] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "media" | "chats" | "bookings" | "reviews">("overview");
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ description: "", available: true });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const showToast = (msg: string, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/contractors/my-profile");
      if (data.success) {
        setProfile(data.data);
        setEditData({ description: data.data.description || "", available: data.data.available });
        setIsContractorVerified(true);
      } else {
        setIsContractorVerified(false);
        setError(data.message);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsContractorVerified(false);
      } else {
        setError(err?.response?.data?.message || "Profile load nahi hua");
        setIsContractorVerified(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user]);

  const handleProfilePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`${BASE_URL}/api/contractors/${profile.id}/photo`, {
        method: "PUT", headers: { Authorization: `Bearer ${getToken()}` }, body: fd,
      });
      const data = await res.json();
      if (data.success) { setProfile((p: any) => ({ ...p, imageUrl: data.data.imageUrl })); showToast("Photo updated!"); }
      else showToast(data.message || "Upload failed", true);
    } catch { showToast("Upload failed", true); }
    finally { setUploading(false); }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      const { data } = await api.put(`/contractors/${profile.id}/update`, editData);
      if (data.success) { setProfile((p: any) => ({ ...p, ...editData })); setEditMode(false); showToast("Profile updated!"); }
      else showToast(data.message || "Update failed", true);
    } catch { showToast("Update failed", true); }
  };

  const deleteMedia = async (mediaId: string) => {
    if (!confirm("Delete this?")) return;
    try {
      await fetch(`${BASE_URL}/api/work-media/${mediaId}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      fetchProfile();
      showToast("Deleted!");
    } catch { showToast("Delete failed", true); }
  };

  // ── Loading state ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
    </div>
  );

  if (isContractorVerified === false) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white rounded-2xl p-8 shadow-sm max-w-sm mx-4">
        <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Contractor profile not found.</h2>
        <p className="text-gray-500 mb-2 text-sm">
          Your phone number. <span className="font-semibold text-gray-700">({user?.phone})</span> No contractor is registered with your phone number.    </p>
        <p className="text-gray-400 text-xs mb-5">
         Register to become a contractor. Use the same phone number that you used to log in.
        </p>
        <button
          onClick={() => navigate("/register-contractor")}
          className="w-full px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:opacity-90"
        >
          Register as Contractor
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
    </div>
  );

  const workMedia = profile.workMedia || [];
  const avgRating = profile.reviews?.length ? profile.reviews.reduce((s: number, r: any) => s + r.rating, 0) / profile.reviews.length : profile.rating || 0;
  const completedBookings = profile.bookings?.filter((b: any) => b.status === "COMPLETED").length || 0;
  const chatUsers = profile.chatUsers || [];
  const unreadChats = chatUsers.reduce((s: number, cu: any) => s + cu.unreadCount, 0);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toasts */}
      {success && <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" />{success}</div>}
      {error && <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}<button onClick={() => setError("")} className="ml-2">✕</button></div>}

      {/* Upload Modal */}
      {showUpload && profile && <UploadModal contractorId={profile.id} onClose={() => setShowUpload(false)} onSuccess={fetchProfile} />}

      {/* Lightbox */}
      {lightboxIdx !== null && workMedia.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={() => setLightboxIdx(null)}>
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <p className="text-white text-sm">{lightboxIdx + 1} / {workMedia.length}</p>
            <button onClick={() => setLightboxIdx(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 flex items-center justify-center px-16 min-h-0" onClick={e => e.stopPropagation()}>
            {workMedia[lightboxIdx]?.type === "video"
              ? <video src={workMedia[lightboxIdx].url} controls autoPlay className="max-h-[70vh] max-w-full rounded-xl" />
              : <img src={workMedia[lightboxIdx]?.url} alt="" className="max-h-[70vh] max-w-full object-contain rounded-xl" />}
            <button onClick={() => setLightboxIdx(i => Math.max(0, (i || 0) - 1))} disabled={lightboxIdx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={() => setLightboxIdx(i => Math.min(workMedia.length - 1, (i || 0) + 1))} disabled={lightboxIdx === workMedia.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20"><ChevronRight className="h-6 w-6" /></button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.07]" />
        <div className="relative max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-white/20">
                {profile.imageUrl ? <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">{profile.name?.charAt(0)?.toUpperCase()}</div>}
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : <Camera className="h-4 w-4 text-orange-500" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
              {profile.isPremium && <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow"><Crown className="h-3.5 w-3.5 text-white" /></div>}
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold">{profile.name}</h1>
                {profile.verified ? <span className="bg-green-500/20 border border-green-400/30 text-green-200 text-xs px-2 py-0.5 rounded-full font-semibold">✓ Verified</span> : <span className="bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 text-xs px-2 py-0.5 rounded-full font-semibold">⏳ Pending</span>}
                {profile.isPremium && <span className="bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 text-xs px-2 py-0.5 rounded-full font-semibold">⭐ Premium</span>}
              </div>
              <div className="flex flex-wrap gap-3 text-white/75 text-sm mb-2">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profile.category}</span>
              </div>
              {avgRating > 0 && <div className="flex items-center gap-2"><StarRow value={avgRating} /><span className="text-white font-bold">{Number(avgRating).toFixed(1)}</span><span className="text-white/60 text-sm">({profile.reviews?.length} reviews)</span></div>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => navigate(`/contractor/${profile.id}`)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/30">
                <Eye className="h-4 w-4" /> Public View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-5 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <CalendarCheck className="h-5 w-5 text-orange-500" />, val: profile.bookings?.length || 0, label: "Total Bookings", bg: "bg-orange-50" },
            { icon: <TrendingUp className="h-5 w-5 text-green-500" />, val: completedBookings, label: "Completed Jobs", bg: "bg-green-50" },
            { icon: <Star className="h-5 w-5 text-amber-500" />, val: avgRating > 0 ? Number(avgRating).toFixed(1) : "N/A", label: "Avg Rating", bg: "bg-amber-50" },
            { icon: <ImageIcon className="h-5 w-5 text-blue-500" />, val: workMedia.length, label: "Work Media", bg: "bg-blue-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
              <div><p className="text-xl font-black text-gray-800">{s.val}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 mt-6 pb-16">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
          {([
            { key: "overview", label: "Overview" },
            { key: "media", label: `Media (${workMedia.length})` },
            { key: "chats", label: `Messages ${unreadChats > 0 ? `(${unreadChats})` : `(${chatUsers.length})`}` },
            { key: "bookings", label: `Bookings (${profile.bookings?.length || 0})` },
            { key: "reviews", label: `Reviews (${profile.reviews?.length || 0})` },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Edit2 className="h-4 w-4 text-orange-500" /> About</h3>
                {!editMode
                  ? <button onClick={() => setEditMode(true)} className="text-xs text-orange-500 hover:underline font-medium">Edit</button>
                  : <div className="flex gap-2"><button onClick={handleSaveProfile} className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg font-medium">Save</button><button onClick={() => setEditMode(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button></div>}
              </div>
              {editMode ? (
                <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Apne team aur services ke baare mein batao..." rows={4}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">{profile.description || "Koi description nahi. Edit karo."}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Contact Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-orange-400" /><span className="text-gray-700">{profile.phone}</span></div>
                {profile.email && <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-orange-400" /><span className="text-gray-700">{profile.email}</span></div>}
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-orange-400" /><span className="text-gray-700">{profile.location}, {profile.city}</span></div>
                <div className="flex items-center gap-3"><Users className="h-4 w-4 text-orange-400" /><span className="text-gray-700">{profile.workers} Workers</span></div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-orange-400" /><span className="text-gray-700">{profile.experienceYrs} years experience</span></div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Availability</h3>
              {editMode ? (
                <div className="flex gap-3">
                  <button onClick={() => setEditData({ ...editData, available: true })}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${editData.available ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>✓ Available</button>
                  <button onClick={() => setEditData({ ...editData, available: false })}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${!editData.available ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>✕ Unavailable</button>
                </div>
              ) : (
                <div className={`flex items-center gap-3 p-4 rounded-xl ${profile.available ? "bg-green-50" : "bg-red-50"}`}>
                  <div className={`w-3 h-3 rounded-full ${profile.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className={`font-semibold text-sm ${profile.available ? "text-green-700" : "text-red-700"}`}>
                    {profile.available ? "Currently Available" : "Not Available Right Now"}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-orange-400" /> Price Range</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-orange-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Minimum</p><p className="text-2xl font-extrabold text-orange-600">₹{profile.priceMin}</p></div>
                <span className="text-gray-300 font-bold text-xl">—</span>
                <div className="flex-1 bg-amber-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Maximum</p><p className="text-2xl font-extrabold text-amber-600">₹{profile.priceMax}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Media ── */}
        {activeTab === "media" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Work Gallery</h3>
              <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm">
                <Plus className="h-4 w-4" /> Add Media
              </button>
            </div>
            {workMedia.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Camera className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">Koi media nahi abhi</p>
                <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 mx-auto">
                  <Plus className="h-4 w-4" /> Pehla Media Add Karo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {workMedia.map((m: any, i: number) => (
                  <div key={m.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all">
                    <button onClick={() => setLightboxIdx(i)} className="w-full">
                      <div className="aspect-square relative overflow-hidden bg-gray-900">
                        {m.type === "video" ? <div className="w-full h-full flex items-center justify-center"><Play className="h-8 w-8 text-white fill-white" /></div> : <img src={m.thumbnail || m.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${m.type === "video" ? "bg-red-500" : "bg-black/50"}`}>{m.type === "video" ? "VIDEO" : "IMG"}</span>
                      </div>
                    </button>
                    {m.caption && <p className="text-xs text-gray-500 px-2 py-1 truncate">{m.caption}</p>}
                    <button onClick={() => deleteMedia(m.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Chats ── */}
        {activeTab === "chats" && profile && (
          <ChatSection contractorId={profile.id} chatUsers={chatUsers} />
        )}

        {/* ── Bookings ── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {!profile.bookings?.length ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CalendarCheck className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Abhi tak koi booking nahi</p>
              </div>
            ) : profile.bookings.map((b: any) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                  <span className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-blue-500 font-medium mb-1">👤 Client</p>
                  <p className="font-bold text-gray-800">{b.user?.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {b.user?.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {b.workType && <span className="bg-gray-100 px-2.5 py-1 rounded-full">{b.workType}</span>}
                  <span className="bg-gray-100 px-2.5 py-1 rounded-full">{b.workersNeeded} Workers</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-full">{new Date(b.startDate).toLocaleDateString("en-IN")}</span>
                  {b.location && <span className="bg-gray-100 px-2.5 py-1 rounded-full">{b.location}</span>}
                </div>
                {b.message && <p className="text-sm text-gray-500 italic mt-2 bg-yellow-50 rounded-lg px-3 py-2">"{b.message}"</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── Reviews ── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {!profile.reviews?.length ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Star className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Abhi tak koi review nahi</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-800">{Number(avgRating).toFixed(1)}</p>
                    <StarRow value={avgRating} />
                    <p className="text-xs text-gray-400 mt-1">{profile.reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(star => {
                      const cnt = profile.reviews.filter((r: any) => Math.round(r.rating) === star).length;
                      const pct = profile.reviews.length ? (cnt / profile.reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-4">{star}</span>
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                          <span className="text-xs text-gray-400 w-4">{cnt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {profile.reviews.map((r: any) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">{r.user?.name?.charAt(0)?.toUpperCase()}</div>
                        <div><p className="font-semibold text-gray-800 text-sm">{r.user?.name}</p><p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                      </div>
                      <StarRow value={r.rating} />
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}