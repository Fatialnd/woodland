import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import type { Booking } from "../../features/bookings/types";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? undefined
      : { field: "status", value: filterValue };

  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, directionRaw] = sortByRaw.split("-");
  const direction = directionRaw === "asc" ? "asc" : "desc";

  const sortBy = { field, direction } as const;

  const { data, isLoading } = useQuery<Booking[]>(
    ["bookings", filter ?? "no-filter", sortBy],
    () => getBookings({ filter, sortBy }),
    { keepPreviousData: true }
  );

  return { bookings: data ?? [], isLoading };
}
