export interface Cabin {
  id: number;
  name: string;
}

export interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality?: string;
  countryFlag?: string;
}

export interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  created_at: string;
  totalPrice: number;
  extrasPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out" | "cancelled";
  cabins?: Cabin | null;
  guests?: Guest | null;
  numNights: number;
  numGuests: number;
}

export type UpdateBookingData = Partial<Omit<Booking, "id">>;
