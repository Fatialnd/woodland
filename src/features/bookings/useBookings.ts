import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import type { Booking } from "../../features/bookings/types"; // ✅ Correct import

export function useBookings() {
  const { data, isLoading } = useQuery<Booking[]>(["bookings"], () =>
    getBookings()
  );
  return { bookings: data, isLoading };
}
