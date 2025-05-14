import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateCurrentUser } from '../../services/apiAuth';

interface UpdateUserParams {
  fullName?: string;
  avatar?: File | null;
  password?: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation<
    { user: any },
    Error,
    UpdateUserParams
  >(
    async ({ fullName, avatar, password }) => {
      return await updateCurrentUser({
        fullName,
        avatar: avatar ?? undefined,
        password
      });
    },
    {
      onSuccess: ({ user }) => {
        toast.success('User successfully updated');
        // queryClient.setQueryData(["user"], user);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (err: Error) => toast.error(err.message)
    }
  );

  return { updateUser, isUpdating };
}
