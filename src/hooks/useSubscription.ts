import { useState, useCallback } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

type Subscription = {
  sub_category_id: string;
  category_id: string;
  sub_category_name: string;
  sub_category_description: string;
  updated_at: string;
  status: string;
  is_guest_aminity: string;
  is_aminity: string;
  is_product: string;
  category_name: string;
};

type Package = {
  package_id: number;
  branch: number;
  package_name: string;
  price: number;
  sub_category_id: number;
  valid_for: number;
  allow_ext: number;
  description: string | null;
  image: string | null;
  popup: number;
  created_at: string;
  status: number;
  message?: string;
};

export const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {userId } = useSelector((state: RootState) => state.auth);

  const getActiveSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseClient.get(APIEndpoints.getSubscription);
      console.log('[getActiveSubscription] Response:', response.data);

      if (response.data?.status && Array.isArray(response.data.data)) {
        setSubscriptions(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Unexpected response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscriptions');
      console.error('[getActiveSubscription] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPackages = useCallback(async (sub_category_id: string) => {
    try {
      console.log('[getPackages] Fetching for sub_category_id:', sub_category_id);
      const response = await baseClient.get(APIEndpoints.getPackages, {
        params: { sub_category_id },
      });

      console.log('[getPackages] Response:', response?.data.message);
      setMessage(response.data.message);

      if (response.data?.status === true && Array.isArray(response.data.data)) {
        setPackages(response.data.data);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        setPackages([]);
        return {
          success: false,
          data: [],
          message: response.data.message || 'Failed to fetch packages',
        };
      }
    } catch (error: any) {
      console.error('[getPackages] Error:', error);
      setMessage('Something went wrong.');
      setPackages([]);
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || 'Something went wrong',
      };
    }
  }, []);

const buySubscriptionByMemberId = useCallback(
  async (package_id: string, price: string) => {
    try {
      const payload = {
        member_id: userId,  // still using userId from outer scope
        package_id,
        price,
      };

      console.log('[buySubscriptionByMemberId] Payload:', payload);

      const response = await baseClient.post(APIEndpoints.buySubscription, payload);
      console.log('[buySubscriptionByMemberId] Response:', response.data);

      const { status, message, cart_id } = response.data;

      if (status === true) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Subscription Placed! Cart ID: ${cart_id}`,
          position: 'top',
        });

        return { success: true, message, cart_id };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: message,
          position: 'top',
        });

        return { success: false, message };
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to buy subscription';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
      });

      return { success: false, message: errorMessage };
    }
  },
  [userId]
);

const subscriptionPaymentByMemberId = useCallback(
  async ({
    cart_id,
    transaction_id,
    payment_status, // <-- take from props
  }: {
    cart_id: number;
    transaction_id: string;
    payment_status: 'Paid' | 'Failed' | string; // make flexible
  }) => {
    try {
      const payload = {
        member_id: userId,
        cart_id,
        payment_status,
        transaction_id,
      };

      console.log('[subscriptionPaymentByMemberId] Payload:', payload);

      const response = await baseClient.post(APIEndpoints.subscriptionPayment, payload);

      console.log('[subscriptionPaymentByMemberId] Response:', response.data);

      const { status, message, order_id } = response.data;

      // if (status === true) {
      //   Toast.show({
      //     type: 'success',
      //     text1: 'Payment Success',
      //     text2: message,
      //     position: 'top',
      //   });

      //   return { success: true, message, order_id };
      // } else {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Payment Failed',
      //     text2: message,
      //     position: 'top',
      //   });

        return { status , message };
      
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Payment recording failed';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
      });

      return { success: false, message: errorMessage };
    }
  },
  [userId]
);



  return {
    subscriptions,
    packages,
    loading,
    error,
    message,
    getActiveSubscription,
    getPackages,
    buySubscriptionByMemberId, // ✅ exposed new function
    subscriptionPaymentByMemberId
  };
};
