import { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapPin, X, Map, List } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ContractorCard } from "../components/ContractorCard";
import contractorService, { Contractor, ContractorFilters } from "../../services/contractor.service";
import { useNavigate } from "react-router";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "SHIFTING", label: "Shifting & Moving" },
  { value: "LOADING_UNLOADING", label: "Loading/Unloading" },
  { value: "HELPERS", label: "Daily Helpers" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "PAINTING", label: "Painting" },
  { value: "CARPENTRY", label: "Carpentry" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "MULTIPLE", label: "Multiple Services" },
];

// ── City Coordinates (Gujarat) ────────────────────────────────────
const CITY_COORDS: Record<string, [number, number]> = {
  "Ahmedabad": [23.0225, 72.5714],
  "Surat": [21.1702, 72.8311],
  "Vadodara": [22.3072, 73.1812],
  "Rajkot": [22.3039, 70.8022],
  "Bhavnagar": [21.7645, 72.1519],
  "Jamnagar": [22.4707, 70.0577],
  "Junagadh": [21.5222, 70.4579],
  "Gandhinagar": [23.2156, 72.6369],
  "Anand": [22.5645, 72.9289],
  "Nadiad": [22.6916, 72.8634],
  "Mehsana": [23.5880, 72.3693],
  "Morbi": [22.8173, 70.8370],
  "Bharuch": [21.7051, 72.9959],
  "Navsari": [20.9467, 72.9520],
  "Valsad": [20.5992, 72.9342],
  "Surendranagar": [22.7274, 71.6481],
  "Porbandar": [21.6425, 69.6093],
  "Bhuj": [23.2420, 69.6669],
  "Gandhidham": [23.0753, 70.1337],
  "Amreli": [21.6027, 71.2214],
  "Mumbai": [19.0760, 72.8777],
  "Delhi": [28.6139, 77.2090],
  "Bangalore": [12.9716, 77.5946],
  "Pune": [18.5204, 73.8567],
};

// ── Get coordinates for city ──────────────────────────────────────
function getCityCoords(city: string): [number, number] | null {
  if (!city) return null;
  const key = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === city.toLowerCase());
  return key ? CITY_COORDS[key] : null;
}

// ── Map Component ─────────────────────────────────────────────────
function ContractorMap({ contractors }: { contractors: Contractor[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet
    import("leaflet").then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map centered on Gujarat
      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: true });
      mapInstanceRef.current = map;

      // OpenStreetMap tiles - FREE
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Custom green marker
      const greenIcon = L.divIcon({
        html: `<div style="
          background: linear-gradient(135deg, #16a34a, #0d9488);
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Add markers for each contractor
      const bounds: [number, number][] = [];
      contractors.forEach((c: any) => {
        const coords = getCityCoords(c.city);
        if (!coords) return;

        // Slightly offset same-city contractors
        const jitter = () => (Math.random() - 0.5) * 0.02;
        const lat = coords[0] + jitter();
        const lng = coords[1] + jitter();

        bounds.push([lat, lng]);

        const marker = L.marker([lat, lng], { icon: greenIcon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 180px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 14px; color: #1f2937; margin-bottom: 4px;">${c.name}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">📍 ${c.city}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">🔧 ${c.category}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">👥 ${c.workers} Workers</div>
            <a href="/contractor/${c.id}" style="
              display: block; text-align: center;
              background: linear-gradient(135deg, #16a34a, #0d9488);
              color: white; padding: 6px 12px;
              border-radius: 8px; font-size: 12px;
              font-weight: 600; text-decoration: none;
            ">View Profile →</a>
          </div>
        `, { maxWidth: 220 });
      });

      // Fit map to show all markers
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40] });
      } else {
        // Default Gujarat view
        map.setView([22.2587, 71.1924], 7);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when contractors change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Re-render handled by key prop on parent
  }, [contractors]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: "480px" }}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs text-gray-600 shadow">
        📍 {contractors.filter(c => getCityCoords(c.city)).length} contractors on map
      </div>
    </div>
  );
}

export default function ContractorListing() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ContractorFilters>({
    search: "", city: "", category: "", sortBy: "rating", page: 1, limit: 9,
  });

  const fetchContractors = useCallback(async (f: ContractorFilters) => {
    setLoading(true); setError("");
    try {
      const result = await contractorService.getAll(f);
      setContractors(result.data);
      setPagination(result.pagination);
    } catch {
      setError("Could not load services. Please check your connection.");
    } finally { setLoading(false); }
  }, []);

  // Fetch all contractors for map (no pagination)
  const fetchAllForMap = useCallback(async () => {
    try {
      const result = await contractorService.getAll({ ...filters, page: 1, limit: 100 });
      setAllContractors(result.data);
    } catch {}
  }, [filters]);

  useEffect(() => { fetchContractors(filters); }, [filters, fetchContractors]);
  useEffect(() => { if (viewMode === "map") fetchAllForMap(); }, [viewMode, fetchAllForMap]);
  useEffect(() => { contractorService.getCities().then(setCities).catch(() => {}); }, []);
  useEffect(() => {
    const timer = setTimeout(() => { setFilters(f => ({ ...f, search: searchInput, page: 1 })); }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateFilter = (key: keyof ContractorFilters, value: any) => {
    setFilters(f => ({ ...f, [key]: value === "all" ? "" : value, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", city: "", category: "", sortBy: "rating", page: 1, limit: 9 });
  };

  const hasActiveFilters = searchInput || filters.city || filters.category;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Services</h1>
          <p className="opacity-90">All Services — One Platform</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or location..." value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} className="pl-9 h-11" />
              {searchInput && (
                <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={filters.city || "all"} onValueChange={(v) => updateFilter("city", v)}>
              <SelectTrigger className="h-11 w-full md:w-44">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.category || "all"} onValueChange={(v) => updateFilter("category", v)}>
              <SelectTrigger className="h-11 w-full md:w-52">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="h-11 px-4 text-gray-500">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchInput && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  Search: "{searchInput}" <button onClick={() => setSearchInput("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.city && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  City: {filters.city} <button onClick={() => updateFilter("city", "")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.category && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {CATEGORIES.find(c => c.value === filters.category)?.label}
                  <button onClick={() => updateFilter("category", "")}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ✅ View Toggle + Results Count */}
        <div className="flex items-center justify-between mb-5">
          {!loading && (
            <p className="text-sm text-gray-500">
              {pagination.total} service{pagination.total !== 1 ? "s" : ""} found
              {searchInput ? ` for "${searchInput}"` : ""}
            </p>
          )}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">
            <button onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"}`}>
              <List className="h-4 w-4" /> List
            </button>
            <button onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "map" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"}`}>
              <Map className="h-4 w-4" /> Map
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-2xl border border-red-100 mb-6">{error}</div>
        )}

        {/* ✅ Map View */}
        {viewMode === "map" && (
          <div className="mb-6">
            <ContractorMap key={JSON.stringify(filters)} contractors={allContractors.length > 0 ? allContractors : contractors} />
            <p className="text-xs text-gray-400 text-center mt-2">Pin pe click karo → contractor details dekhne ke liye</p>
          </div>
        )}

        {/* ✅ List View */}
        {viewMode === "list" && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-lg">No services found</p>
                <p className="text-gray-400 text-sm mt-1">Try different search terms or clear filters</p>
                {hasActiveFilters && <Button variant="outline" onClick={clearFilters} className="mt-4">Clear Filters</Button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contractors.map((contractor) => (
                    <ContractorCard key={contractor.id} contractor={{ ...contractor, reviews: contractor.reviews ?? 0 }} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <Button variant="outline" disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page! - 1 }))}>Previous</Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">Page {filters.page} of {pagination.totalPages}</span>
                    <Button variant="outline" disabled={filters.page === pagination.totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page! + 1 }))}>Next</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}