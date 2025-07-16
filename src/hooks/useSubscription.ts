import { useState, useCallback } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';

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
  price: number; // assuming you’ll parse price to number from string
  sub_category_id: number;
  valid_for: number; // converted from string to number
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
        setPackages(response.data.data); // ✅ Store in state
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        setPackages([]); // Clear on failure
        return {
          success: false,
          data: [],
          message: response.data.message || 'Failed to fetch packages',
        };
      }
    } catch (error: any) {
      console.error('[getPackages] Error:', error);
      setMessage('Something went wrong.');
      setPackages([]); // Clear on error
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || 'Something went wrong',
      };
    }
  }, []);

  return {
    subscriptions,
    packages,          // ✅ exposed state
    loading,
    error,
    message,
    getActiveSubscription,
    getPackages,
  };
};
