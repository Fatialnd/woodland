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

export type Booking = {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out" | "cancelled";
  guests?: {
    fullName?: string;
    email?: string;
  };
  cabins?: {
    name?: string;
  };
};
