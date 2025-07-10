import { useState } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

interface LoginPayload {
  phone: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (credentials: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseClient.post(APIEndpoints.logIn, credentials);

      if (response.data?.status === true) {
        const { token, member } = response.data;

        dispatch(
          login({
            token,
            member,
          })
        );
        return { success: true };
      } else {
        setError(response.data?.message || 'Login failed');
        return { success: false };
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
    error,
  };
};
