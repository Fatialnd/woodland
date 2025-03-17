import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import type { Booking } from "../../features/bookings/types";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  const { data, isLoading } = useQuery<Booking[]>(["bookings", filter], () =>
    getBookings({ filter, SortBy: null })
  );
  return { bookings: data, isLoading };
}
