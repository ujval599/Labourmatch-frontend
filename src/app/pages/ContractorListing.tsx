import { useState, useEffect, useCallback } from "react";
import { Search, Filter, MapPin, Loader2, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { ContractorCard } from "../components/ContractorCard";
import contractorService, {
  Contractor, ContractorFilters,
} from "../../services/contractor.service";

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

export default function ContractorListing() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  // ── Filters ──
  const [searchInput, setSearchInput] = useState(""); // live input
  const [filters, setFilters] = useState<ContractorFilters>({
    search: "",
    city: "",
    category: "",
    sortBy: "rating",
    page: 1,
    limit: 9,
  });

  // ── Fetch contractors ──
  const fetchContractors = useCallback(async (f: ContractorFilters) => {
    setLoading(true);
    setError("");
    try {
      const result = await contractorService.getAll(f);
      setContractors(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError("Could not load contractors. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch on filter change ──
  useEffect(() => {
    fetchContractors(filters);
  }, [filters, fetchContractors]);

  // ── Fetch cities ──
  useEffect(() => {
    contractorService.getCities().then(setCities).catch(() => {});
  }, []);

  // ── Debounce search input (500ms) ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput, page: 1 }));
    }, 500);
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
          <h1 className="text-3xl font-bold mb-2">Find Contractors</h1>
          <p className="opacity-90">Verified contractors in your area</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-11"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* City Filter */}
            <Select
              value={filters.city || "all"}
              onValueChange={(v) => updateFilter("city", v)}
            >
              <SelectTrigger className="h-11 w-full md:w-44">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category || "all"}
              onValueChange={(v) => updateFilter("category", v)}
            >
              <SelectTrigger className="h-11 w-full md:w-52">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="h-11 px-4 text-gray-500">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchInput && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  Search: "{searchInput}"
                  <button onClick={() => setSearchInput("")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {filters.city && (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  City: {filters.city}
                  <button onClick={() => updateFilter("city", "")}><X className="h-3 w-3" /></button>
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

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination.total} contractor{pagination.total !== 1 ? "s" : ""} found
            {searchInput ? ` for "${searchInput}"` : ""}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-2xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : contractors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-lg">No contractors found</p>
            <p className="text-gray-400 text-sm mt-1">Try different search terms or clear filters</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contractors.map((contractor) => (
                <ContractorCard
                  key={contractor.id}
                  contractor={{ ...contractor, reviews: contractor.reviews ?? 0 }}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(f => ({ ...f, page: f.page! - 1 }))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {filters.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={filters.page === pagination.totalPages}
                  onClick={() => setFilters(f => ({ ...f, page: f.page! + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}