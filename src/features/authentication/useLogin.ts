import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation<
    { user: any },
    Error,
    LoginCredentials
  >(
    async (credentials: LoginCredentials) => {
      return await loginApi(credentials);
    },
    {
      onSuccess: (user) => {
        queryClient.setQueryData(['user'], user.user);
        navigate('/dashboard', { replace: true });
      },
      onError: (error: Error) => {
        console.error(error.message);
        toast.error('Provided email or password are incorrect');
      }
    }
  );

  return { login, isLoading };
}
