// src/app/pages/MyBookings.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Users, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import bookingService, { Booking } from "../../services/review-booking.service";
import { useAuth } from "../../context/AuthContext";

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", desc: "Contractor ka jawab ka intezaar hai" },
  ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-800", desc: "Contractor ne accept kar liya!" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", desc: "Contractor ne reject kar diya" },
  COMPLETED: { label: "Completed", color: "bg-blue-100 text-blue-800", desc: "Kaam complete ho gaya" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800", desc: "Booking cancel ho gayi" },
};

export default function MyBookings() {
  const { isLoggedIn, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    bookingService.getMyBookings()
      .then(setBookings)
      .catch(() => setError("Bookings load nahi ho saki."))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">Login first to view bookings.</p>
            <Link to="/auth"><Button className="w-full">Log in</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
  const statusCounts = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
          <p className="opacity-90">How can I help you today, {user?.name}! Your booking requests are listed here.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: bookings.length, color: "bg-gray-100" },
            { label: "Pending", count: statusCounts["PENDING"] || 0, color: "bg-yellow-50" },
            { label: "Accepted", count: statusCounts["ACCEPTED"] || 0, color: "bg-green-50" },
            { label: "Completed", count: statusCounts["COMPLETED"] || 0, color: "bg-blue-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === s ? "bg-primary text-white" : "bg-white text-muted-foreground border hover:bg-gray-50"}`}>
              {s === "ALL" ? "Sab" : STATUS_CONFIG[s]?.label}
              {s !== "ALL" && statusCounts[s] ? ` (${statusCounts[s]})` : ""}
            </button>
          ))}
        </div>

        {error && <div className="text-center py-8 text-red-500"><p>{error}</p></div>}
        {loading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">Search for contractors and submit requests!</p>
            <Link to="/contractors"><Button>Search Contractors</Button></Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const status = STATUS_CONFIG[booking.status];
              return (
                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className={`h-1.5 w-full ${booking.status === "ACCEPTED" || booking.status === "COMPLETED" ? "bg-green-500" : booking.status === "PENDING" ? "bg-yellow-400" : booking.status === "REJECTED" ? "bg-red-500" : "bg-gray-300"}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{booking.contractor?.name || "Contractor"}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" /><span>{booking.contractor?.location || "Location"}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${status?.color}`}>{status?.label}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Workers</p>
                          <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /><span className="font-semibold">{booking.workersNeeded}</span></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                          <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">{new Date(booking.startDate).toLocaleDateString("en-IN")}</span></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Request Date</p>
                          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">{new Date(booking.createdAt).toLocaleDateString("en-IN")}</span></div>
                        </div>
                      </div>
                      {booking.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Message</p>
                          <p className="text-sm">{booking.message}</p>
                        </div>
                      )}
                      <div className={`text-sm px-3 py-2 rounded-lg ${booking.status === "PENDING" ? "bg-yellow-50 text-yellow-700" : booking.status === "ACCEPTED" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}`}>
                        {status?.desc}
                      </div>
                      {booking.status === "ACCEPTED" && booking.contractor?.phone && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Contractor: {booking.contractor.phone}</p>
                          <p className="text-xs text-green-600 mt-1">Call directly and confirm the work!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
