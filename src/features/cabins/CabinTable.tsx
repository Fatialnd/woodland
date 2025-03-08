import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

type SortField = keyof Cabin;

function CabinTable() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery<Cabin[]>({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins || !cabins.length) return <Empty resourceName="cabins" />;

  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins: Cabin[] | undefined;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);

  if (filterValue === "with-discount")
    filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);

  const sortBy = searchParams.get("sortBy") || "regularPrice-asc"; // Default to regularPrice if not available
  const [field, direction] = sortBy.split("-");

  if (!field || !direction) {
    return null;
  }

  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins
    ? filteredCabins.sort((a, b) => {
        const valueA = a[field as SortField];
        const valueB = b[field as SortField];
        return (Number(valueA) - Number(valueB)) * modifier;
      })
    : [];

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin: Cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
