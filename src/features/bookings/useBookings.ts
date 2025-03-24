import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
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

  const pageCount = Math.ceil((data?.count ?? 0) / PAGE_SIZE);

  if (page > pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { bookings: data?.bookings ?? [], count: data?.count ?? 0, isLoading };
}
