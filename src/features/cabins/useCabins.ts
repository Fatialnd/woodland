import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../../services/apiCabins';

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error
  } = useQuery<Cabin[]>({
    queryKey: ['cabins'],
    queryFn: getCabins
  });

  return { isLoading, error, cabins };
}
