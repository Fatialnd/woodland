import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
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

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data, isLoading } = useQuery(
    ["bookings", filter ?? "no-filter", sortBy, page],
    () => getBookings({ filter, sortBy, page }),
    { keepPreviousData: true }
  );

  return { bookings: data?.bookings ?? [], count: data?.count ?? 0, isLoading };
}
