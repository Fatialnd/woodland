import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { Booking } from "../../services/apiBookings";

export function useBookings() {
  const { data, isLoading } = useQuery<Booking[]>(["bookings"], getBookings);
  return { bookings: data, isLoading };
}
