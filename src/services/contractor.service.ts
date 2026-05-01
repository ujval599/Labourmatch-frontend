// src/services/contractor.service.ts
// ContractorListing.tsx aur ContractorDetail.tsx ke liye

import api from "./api";

export interface Contractor {
  id: string;
  name: string;
  phone: string;
  location: string;
  city: string;
  category: string;
  workers: number;
  priceMin: number;
  priceMax: number;
  priceRange: string; // backend se formatted aata hai
  verified: boolean;
  imageUrl: string;
  image?: string; // alias for imageUrl (backward compat)
  rating: number;
  reviewCount: number;
  reviews?: number; // alias
  available: boolean;
  experienceYrs: number;
  description?: string;
}

export interface ContractorFilters {
  city?: string;
  category?: string;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "reviews" | "price_low" | "price_high" | "newest";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Contractor data ko frontend ke format mein convert karo
function normalizeContractor(c: any): Contractor {
  return {
    ...c,
    image: c.imageUrl || c.image,
    priceRange: c.priceRange || `₹${c.priceMin}-${c.priceMax}/day`,
    reviews: c.reviewCount || c.reviews || 0,
  };
}

const contractorService = {
  // ContractorListing.tsx mein use karo
  getAll: async (filters: ContractorFilters = {}): Promise<PaginatedResponse<Contractor>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") params.append(key, String(val));
    });
    const { data } = await api.get(`/contractors?${params}`);
    return {
      ...data,
      data: data.data.map(normalizeContractor),
    };
  },

  // ContractorDetail.tsx mein use karo
  getById: async (id: string): Promise<Contractor> => {
    const { data } = await api.get(`/contractors/${id}`);
    return normalizeContractor(data.data);
  },

  // RegisterContractor.tsx mein use karo
  register: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post("/contractors/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // Filter dropdown ke liye
  getCities: async (): Promise<string[]> => {
    const { data } = await api.get("/contractors/cities");
    return data.data;
  },
};

export default contractorService;
