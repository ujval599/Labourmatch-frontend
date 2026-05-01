// src/app/pages/AdminDashboard.tsx
import { useState, useEffect, useRef } from "react";
import {
  Crown, CheckCircle, XCircle, Loader2,
  Users, MapPin, Phone, Briefcase, RefreshCw,
  CalendarCheck, Clock, CheckCircle2, XOctagon,
  IndianRupee, MessageSquare, Send, Headphones, Bell
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";

interface PremiumRequest {
  id: string; plan: string; duration: string; amount: number;
  status: string; createdAt: string;
  contractor: { id: string; name: string; phone: string; location: string; city: string };
}

interface Contractor {
  id: string; name: string; phone: string; email?: string;
  city: string; category: string; workers: number;
  priceMin: number; priceMax: number; verified: boolean;
  imageUrl?: string; createdAt: string;
}

interface Booking {
  id: string; workersNeeded: number; startDate: string; endDate?: string;
  status: string; workType?: string; location?: string; message?: string; createdAt: string;
  contractor: { id: string; name: string; phone: string; city: string; category: string };
  user: { id: string; name: string; phone: string; email?: string };
}

interface SupportUser {
  id: string; name: string; phone: string; email?: string;
  supportMessages: { text: string; createdAt: string; senderRole: string }[];
  _count: { supportMessages: number };
}

interface SupportMessage {
  id: string; text: string; senderRole: string; isRead: boolean; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"bookings" | "contractors" | "premium" | "support">("bookings");

  // Contractors
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [contractorFilter, setContractorFilter] = useState<"pending" | "verified">("pending");
  const [contractorLoading, setContractorLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Premium
  const [requests, setRequests] = useState<PremiumRequest[]>([]);
  const [premiumFilter, setPremiumFilter] = useState("PENDING");
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [pendingPremiumCount, setPendingPremiumCount] = useState(0);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [pendingBookingCount, setPendingBookingCount] = useState(0);

  // Support
  const [supportUsers, setSupportUsers] = useState<SupportUser[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [selectedSupportUser, setSelectedSupportUser] = useState<SupportUser | null>(null);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch badge counts on load ──
  useEffect(() => {
    if (!isLoggedIn || user?.role !== "ADMIN") return;
    // Pending contractors
    api.get("/contractors/admin/all?verified=false").then(({ data }) => {
      setPendingCount(data.data?.length || 0);
    }).catch(() => {});
    // Pending premium
    api.get("/premium/requests?status=PENDING").then(({ data }) => {
      setPendingPremiumCount(data.data?.length || 0);
    }).catch(() => {});
    // Pending bookings
    api.get("/bookings?status=PENDING").then(({ data }) => {
      setPendingBookingCount(data.data?.length || 0);
    }).catch(() => {});
    // Unread support
    api.get("/support/admin/all").then(({ data }) => {
      const total = (data.data || []).reduce((sum: number, u: SupportUser) => sum + (u._count?.supportMessages || 0), 0);
      setUnreadSupportCount(total);
    }).catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "ADMIN") return;
    if (activeTab === "contractors") fetchContractors();
    if (activeTab === "premium") fetchPremiumRequests();
    if (activeTab === "bookings") fetchBookings();
    if (activeTab === "support") fetchSupportUsers();
  }, [isLoggedIn, activeTab, contractorFilter, premiumFilter, bookingFilter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportMessages]);

  const fetchContractors = async () => {
    setContractorLoading(true);
    try {
      const verified = contractorFilter === "verified" ? "true" : "false";
      const { data } = await api.get(`/contractors/admin/all?verified=${verified}`);
      setContractors(data.data || []);
      if (contractorFilter === "pending") setPendingCount(data.data?.length || 0);
    } catch (err) { console.error(err); }
    finally { setContractorLoading(false); }
  };

  const fetchPremiumRequests = async () => {
    setPremiumLoading(true);
    try {
      const { data } = await api.get(`/premium/requests?status=${premiumFilter}`);
      setRequests(data.data || []);
      if (premiumFilter === "PENDING") setPendingPremiumCount(data.data?.length || 0);
    } catch (err) { console.error(err); }
    finally { setPremiumLoading(false); }
  };

  const fetchBookings = async () => {
    setBookingLoading(true);
    try {
      const url = bookingFilter === "all" ? "/bookings" : `/bookings?status=${bookingFilter}`;
      const { data } = await api.get(url);
      setBookings(data.data || []);
      if (bookingFilter === "PENDING") setPendingBookingCount(data.data?.length || 0);
    } catch (err) { console.error(err); }
    finally { setBookingLoading(false); }
  };

  const fetchSupportUsers = async () => {
    setSupportLoading(true);
    try {
      const { data } = await api.get("/support/admin/all");
      setSupportUsers(data.data || []);
      const total = (data.data || []).reduce((sum: number, u: SupportUser) => sum + (u._count?.supportMessages || 0), 0);
      setUnreadSupportCount(total);
    } catch (err) { console.error(err); }
    finally { setSupportLoading(false); }
  };

  const openSupportChat = async (supportUser: SupportUser) => {
    setSelectedSupportUser(supportUser);
    try {
      const { data } = await api.get(`/support/admin/${supportUser.id}`);
      setSupportMessages(data.data || []);
    } catch (err) { console.error(err); }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedSupportUser || replying) return;
    setReplying(true);
    try {
      const { data } = await api.post(`/support/admin/${selectedSupportUser.id}`, { text: replyText.trim() });
      if (data.success) {
        setSupportMessages(prev => [...prev, data.data]);
        setReplyText("");
        fetchSupportUsers();
      }
    } catch (err) { console.error(err); }
    finally { setReplying(false); }
  };

  const handleVerify = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/contractors/${id}/verify`);
      fetchContractors();
      setPendingCount(c => Math.max(0, c - 1));
    }
    catch (err: any) { alert(err?.response?.data?.message || "Error"); }
    finally { setActionLoading(null); }
  };

  const handleRejectContractor = async (id: string) => {
    if (!confirm("Reject this contractor?")) return;
    setActionLoading(id);
    try {
      await api.delete(`/contractors/${id}`);
      fetchContractors();
      setPendingCount(c => Math.max(0, c - 1));
    }
    catch (err: any) { alert(err?.response?.data?.message || "Error"); }
    finally { setActionLoading(null); }
  };

  const handlePremiumApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/premium/approve/${id}`, { adminNote: "Payment verified, approved!" });
      fetchPremiumRequests();
      setPendingPremiumCount(c => Math.max(0, c - 1));
    }
    catch (err: any) { alert(err?.response?.data?.message || "Error"); }
    finally { setActionLoading(null); }
  };

  const handlePremiumReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/premium/reject/${id}`, { adminNote: "Payment not received" });
      fetchPremiumRequests();
      setPendingPremiumCount(c => Math.max(0, c - 1));
    }
    catch (err: any) { alert(err?.response?.data?.message || "Error"); }
    finally { setActionLoading(null); }
  };

  const handleBookingStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
      if (status !== "PENDING") setPendingBookingCount(c => Math.max(0, c - 1));
    }
    catch (err: any) { alert(err?.response?.data?.message || "Error"); }
    finally { setActionLoading(null); }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (!isLoggedIn || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Admin Only</h2>
            <p className="text-muted-foreground mb-4">This page is only for admins.</p>
            <Link to="/auth"><Button>Login</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="opacity-80 text-sm mt-1">Manage bookings, contractors, premium and support</p>
          </div>
          {/* Notification summary */}
          <div className="flex items-center gap-3">
            {(pendingBookingCount + pendingCount + pendingPremiumCount + unreadSupportCount) > 0 && (
              <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2">
                <Bell className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-bold">
                  {pendingBookingCount + pendingCount + pendingPremiumCount + unreadSupportCount} pending
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Main Tabs with badges */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "bookings", icon: <CalendarCheck className="h-4 w-4" />, label: "Bookings", badge: pendingBookingCount },
            { key: "contractors", icon: <Users className="h-4 w-4" />, label: "Contractors", badge: pendingCount },
            { key: "premium", icon: <Crown className="h-4 w-4" />, label: "Premium", badge: pendingPremiumCount },
            { key: "support", icon: <Headphones className="h-4 w-4" />, label: "Support Chat", badge: unreadSupportCount },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key as any); setSelectedSupportUser(null); }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}>
              {tab.icon} {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { key: "all", label: "All Bookings" },
                { key: "PENDING", label: "⏳ Pending" },
                { key: "ACCEPTED", label: "✅ Accepted" },
                { key: "COMPLETED", label: "🏁 Completed" },
                { key: "REJECTED", label: "❌ Rejected" },
              ].map(f => (
                <button key={f.key} onClick={() => setBookingFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    bookingFilter === f.key ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
                  }`}>
                  {f.label}
                </button>
              ))}
              <button onClick={fetchBookings} className="ml-auto px-3 py-2 rounded-full text-sm bg-white border text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            {bookingLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border">
                <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-30 text-gray-400" />
                <p className="text-gray-500">No bookings found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>
                              {booking.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-3">
                              <p className="text-xs text-blue-500 font-medium mb-1">👤 User (Client)</p>
                              <p className="font-bold text-gray-800">{booking.user.name}</p>
                              <a href={`tel:${booking.user.phone}`} className="text-sm text-blue-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline">
                                <Phone className="h-3 w-3" /> {booking.user.phone}
                              </a>
                              {booking.user.email && <p className="text-xs text-gray-400 mt-0.5">{booking.user.email}</p>}
                            </div>
                            <div className="bg-green-50 rounded-xl p-3">
                              <p className="text-xs text-green-600 font-medium mb-1">🔧 Contractor</p>
                              <p className="font-bold text-gray-800">{booking.contractor.name}</p>
                              <a href={`tel:${booking.contractor.phone}`} className="text-sm text-green-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline">
                                <Phone className="h-3 w-3" /> {booking.contractor.phone}
                              </a>
                              <p className="text-xs text-gray-400">{booking.contractor.city} • {booking.contractor.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {booking.workType && <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"><Briefcase className="h-3 w-3" /> {booking.workType}</span>}
                            <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"><Users className="h-3 w-3" /> {booking.workersNeeded} Workers</span>
                            <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"><Clock className="h-3 w-3" /> {new Date(booking.startDate).toLocaleDateString("en-IN")}</span>
                            {booking.location && <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"><MapPin className="h-3 w-3" /> {booking.location}</span>}
                          </div>
                          {booking.message && (
                            <div className="mt-3 flex items-start gap-2 bg-yellow-50 rounded-xl p-3">
                              <MessageSquare className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                            </div>
                          )}
                          <div className="mt-3 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
                            <IndianRupee className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            <p className="text-xs text-orange-600 font-medium">
                              Commission opportunity — Call contractor:
                              <a href={`tel:${booking.contractor.phone}`} className="ml-1 font-bold underline">{booking.contractor.phone}</a>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {booking.status === "PENDING" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={actionLoading === booking.id}
                                onClick={() => handleBookingStatus(booking.id, "ACCEPTED")}>
                                {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1" /> Accept</>}
                              </Button>
                              <Button size="sm" variant="destructive" disabled={actionLoading === booking.id} onClick={() => handleBookingStatus(booking.id, "REJECTED")}>
                                <XOctagon className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                          {booking.status === "ACCEPTED" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={actionLoading === booking.id}
                              onClick={() => handleBookingStatus(booking.id, "COMPLETED")}>
                              {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" /> Mark Done</>}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONTRACTORS TAB ── */}
        {activeTab === "contractors" && (
          <div>
            <div className="flex gap-2 mb-5">
              <button onClick={() => setContractorFilter("pending")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${contractorFilter === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
                ⏳ Pending Approval {pendingCount > 0 && `(${pendingCount})`}
              </button>
              <button onClick={() => setContractorFilter("verified")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${contractorFilter === "verified" ? "bg-green-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>
                ✅ Verified
              </button>
              <button onClick={fetchContractors} className="ml-auto px-3 py-2 rounded-full text-sm bg-white border text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            {contractorLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-white rounded-2xl border">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No {contractorFilter === "pending" ? "pending" : "verified"} contractors.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractors.map(c => (
                  <Card key={c.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {c.imageUrl
                              ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">{c.name?.charAt(0)?.toUpperCase()}</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">{c.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {c.verified ? "✅ Verified" : "⏳ Pending"}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                              <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                                <Phone className="h-3.5 w-3.5" />{c.phone}
                              </a>
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city}</span>
                              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{c.category}</span>
                            </div>
                            {c.email && <p className="text-xs text-gray-400 mt-1">{c.email}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {!c.verified && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={actionLoading === c.id} onClick={() => handleVerify(c.id)}>
                              {actionLoading === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" /> Approve</>}
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" disabled={actionLoading === c.id} onClick={() => handleRejectContractor(c.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> {c.verified ? "Remove" : "Reject"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PREMIUM TAB ── */}
        {activeTab === "premium" && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {["PENDING", "APPROVED", "REJECTED"].map(s => (
                <button key={s} onClick={() => setPremiumFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${premiumFilter === s ? "bg-primary text-white" : "bg-white text-muted-foreground border hover:bg-gray-50"}`}>
                  {s} {s === "PENDING" && pendingPremiumCount > 0 && `(${pendingPremiumCount})`}
                </button>
              ))}
            </div>
            {premiumLoading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {!premiumLoading && requests.length === 0 && (
              <div className="text-center py-16 text-muted-foreground bg-white rounded-2xl border">
                <Crown className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No {premiumFilter.toLowerCase()} requests.</p>
              </div>
            )}
            <div className="space-y-4">
              {requests.map(req => (
                <Card key={req.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{req.contractor.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : req.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {req.status}
                          </span>
                        </div>
                        <a href={`tel:${req.contractor.phone}`} className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline mb-1">
                          <Phone className="h-3.5 w-3.5" /> {req.contractor.phone}
                        </a>
                        <p className="text-sm text-muted-foreground">{req.contractor.city}</p>
                        <div className="flex gap-4 mt-3">
                          <div className="bg-yellow-50 rounded-lg px-3 py-2"><p className="text-xs text-muted-foreground">Plan</p><p className="font-bold text-yellow-700">{req.plan}</p></div>
                          <div className="bg-green-50 rounded-lg px-3 py-2"><p className="text-xs text-muted-foreground">Amount</p><p className="font-bold text-green-700">₹{req.amount}</p></div>
                          <div className="bg-gray-50 rounded-lg px-3 py-2"><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold text-sm">{new Date(req.createdAt).toLocaleDateString("en-IN")}</p></div>
                        </div>
                      </div>
                      {req.status === "PENDING" && (
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={actionLoading === req.id} onClick={() => handlePremiumApprove(req.id)}>
                            {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" /> Approve</>}
                          </Button>
                          <Button size="sm" variant="destructive" disabled={actionLoading === req.id} onClick={() => handlePremiumReject(req.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── SUPPORT CHAT TAB ── */}
        {activeTab === "support" && (
          <div className="flex gap-5 h-[600px]">
            {/* Users List */}
            <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Support Chats</h3>
                <button onClick={fetchSupportUsers} className="text-gray-400 hover:text-gray-600">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              {supportLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : supportUsers.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Headphones className="h-10 w-10 text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm">No support messages yet</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {supportUsers.map(u => (
                    <button key={u.id} onClick={() => openSupportChat(u)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedSupportUser?.id === u.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">{u.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-800 text-sm truncate">{u.name}</p>
                            {u._count?.supportMessages > 0 && (
                              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
                                {u._count.supportMessages}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{u.phone}</p>
                          {u.supportMessages?.[0] && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{u.supportMessages[0].text}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {!selectedSupportUser ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Headphones className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">Select a conversation</h3>
                  <p className="text-gray-400 text-sm">Click on a user from the left to view their messages</p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{selectedSupportUser.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{selectedSupportUser.name}</p>
                      <p className="text-xs text-gray-400">{selectedSupportUser.phone} {selectedSupportUser.email && `• ${selectedSupportUser.email}`}</p>
                    </div>
                    <a href={`tel:${selectedSupportUser.phone}`} className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100">
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
                    {supportMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No messages yet</div>
                    ) : (
                      supportMessages.map(msg => {
                        const isAdmin = msg.senderRole === "admin";
                        return (
                          <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                            {!isAdmin && (
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 mt-auto mb-4">
                                <span className="text-xs font-bold text-gray-600">{selectedSupportUser.name?.charAt(0)?.toUpperCase()}</span>
                              </div>
                            )}
                            <div className={`max-w-[70%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                              <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${isAdmin ? "bg-primary text-white rounded-br-sm" : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-sm"}`}>
                                {msg.text}
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {formatDate(msg.createdAt)} {formatTime(msg.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-primary transition-all">
                      <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendReply()}
                        placeholder={`Reply to ${selectedSupportUser.name}...`}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                      />
                      <button onClick={sendReply} disabled={!replyText.trim() || replying}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${replyText.trim() ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}