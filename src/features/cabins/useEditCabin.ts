import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import { toast } from 'react-hot-toast';

interface Cabin {
  id?: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
}

interface EditCabinParams {
  newCabinData: Cabin;
  id: number;
}

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation<
    void,
    Error,
    EditCabinParams
  >(
    async ({ newCabinData, id }) => {
      await createEditCabin(newCabinData, id);
    },
    {
      onSuccess: () => {
        toast.success('Cabin successfully edited');
        queryClient.invalidateQueries({ queryKey: ['cabins'] });
      },
      onError: (err: Error) => toast.error(err.message)
    }
  );

  return { isEditing, editCabin };
}
