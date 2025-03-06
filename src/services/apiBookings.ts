import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings() {
  const { data, error } = await supabase.from("bookings").select("*");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be created");
  }
  return data;
}

// Interfaces
export interface Cabin {
  id: number;
  name: string;
  // Add other cabin fields as needed
}

export interface Guest {
  id: number;
  fullName: string;
  nationality?: string;
  countryFlag?: string;
  // Add other guest fields as needed
}

export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  created_at: string;
  totalPrice: number;
  extrasPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out" | "cancelled";
  cabins?: Cabin;
  guests?: Guest;
  // Add other booking fields as needed
}

export type UpdateBookingData = Partial<Omit<Booking, "id">>;

// Get a single booking by ID
export async function getBooking(id: number): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data as Booking;
}

// Get all bookings created after a specific date
export async function getBookingsAfterDate(
  date: string
): Promise<{ created_at: string; totalPrice: number; extrasPrice: number }[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error || !data) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Get all stays (bookings) that start after a specific date
export async function getStaysAfterDate(date: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error || !data) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data as Booking[];
}

// Get stays with check-in or check-out today
export async function getStaysTodayActivity(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  if (error || !data) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data as Booking[];
}

// Update a booking by ID
export async function updateBooking(
  id: number,
  obj: UpdateBookingData
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data as Booking;
}

// Delete a booking by ID
export async function deleteBooking(id: number): Promise<null> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return null;
}
