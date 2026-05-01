import api from "./api";

export interface Review {
  id: string;
  contractorId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface BookingRequest {
  contractorId: string;
  workersNeeded: number;
  startDate: string;
  endDate?: string;
  message?: string;
  workType?: string;
  location?: string;
}

export interface Booking {
  id: string;
  contractorId: string;
  userId: string;
  workersNeeded: number;
  startDate: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  message?: string;
  contractor?: { id: string; name: string; phone: string; imageUrl: string; location: string };
  createdAt: string;
}

const reviewService = {
  getByContractor: async (contractorId: string, page = 1) => {
    const { data } = await api.get(`/reviews/${contractorId}?page=${page}`);
    return data;
  },
  add: async (contractorId: string, rating: number, comment: string) => {
    const { data } = await api.post(`/reviews/${contractorId}`, { rating, comment });
    return data.data;
  },
};

const bookingService = {
  create: async (booking: BookingRequest) => {
    const { data } = await api.post("/bookings", booking);
    return data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get("/bookings/my");
    return data.data;
  },
};

export { reviewService };
export default bookingService;