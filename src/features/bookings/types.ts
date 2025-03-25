export interface Cabin {
  id: number;
  name: string;
}

export interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality?: string;
  country?: string;
  countryFlag?: string;
  nationalID?: string;
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
  cabinPrice?: number;
  hasBreakfast?: boolean;
  isPaid?: boolean;
}

export interface PerBooking {
  id?: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice?: number;
  extrasPrice: number;
  totalPrice: number;
  hasBreakfast: boolean;
  observations?: string;
  isPaid: boolean;
  guests: {
    fullName: string;
    email: string;
    country: string;
    countryFlag?: string;
    nationalID: string;
  };
  cabins: {
    name: string;
  };
}

export type UpdateBookingData = Partial<Omit<Booking, "id">>;
