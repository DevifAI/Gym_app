import { useState } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

interface LoginPayload {
  phone: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  dob: string;
}

export const useAuth = () => {
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

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });

        return { success: true };
      } else {
        const errMsg = response.data?.message || 'Login failed';
        setError(errMsg);

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errMsg,
        });

        return { success: false };
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Something went wrong';
      setError(errMsg);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data: RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseClient.post(APIEndpoints.register, data);

      if (response.data?.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: response.data?.message || 'Welcome aboard!',
        });

        return { success: true };
      } else {
        const errMsg = response.data?.message || 'Registration failed';
        setError(errMsg);

        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: errMsg,
        });

        return { success: false };
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Something went wrong';
      setError(errMsg);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    registerUser,
    loading,
    error,
  };
};
