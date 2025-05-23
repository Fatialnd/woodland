import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateBooking } from '../../services/apiBookings';

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: ({ bookingId }: { bookingId: number }) =>
      updateBooking(bookingId, {
        status: 'checked-out'
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries();
    },
    onError: () => toast.error('There was an error while checking out')
  });

  return { checkout, isCheckingOut };
}
