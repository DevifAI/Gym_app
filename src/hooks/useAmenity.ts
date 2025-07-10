import { useEffect, useState } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import { useSelector } from 'react-redux';

export interface Amenity {
  sub_category_id: string;
  category_id: string;
  sub_category_name: string;
  sub_category_description: string;
  updated_at: string;
  status: string;
  is_guest_aminity: string;
  is_aminity: string;
  category_name: string;
}
type AmenityBookingPayload = {
  sub_category_id: string | number;
  booking_date: string;
  booking_time: string;
};

type BookingDetails = {
  booking_id: string;
  start_time: string;
  end_time: string;
  // Add more fields as needed
};

type AmenityBookingResponse = {
  success: boolean;
  message?: string;
  data?: {
    is_available: boolean;
    is_free?: boolean;
    is_paid?: boolean;
    booking_details?: BookingDetails;
  };
};



export const useAmenity = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenityMessage, setAmenityMessage] = useState<string | null>(null);
  const userId = useSelector((state: any) => state.auth.userId);

  // ✅ Fetch all amenities
  const getActiveAmenity = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseClient.get(APIEndpoints.getAmenity);

      if (response.data?.status === true) {
        setAmenities(response.data.data || []);
        setAmenityMessage(response.data.message || null);
      } else {
        setError(response.data?.message || 'Failed to fetch amenities');
        setAmenityMessage(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
      setAmenityMessage(null);
    } finally {
      setLoading(false);
    }
  };

const bookAmenityById = async ({
  payload,
}: {
  payload: AmenityBookingPayload;
}): Promise<AmenityBookingResponse> => {
  setLoading(true);
  setError(null);

  try {
    const response = await baseClient.post(APIEndpoints.bookAmenity, {
      ...payload,
      member_id: userId, // ✅ use top-level value
    });

    if (response.data?.status === true) {
      setAmenities(response.data.data || []);
      setAmenityMessage(response.data.message || null);

      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } else {
      setError(response.data?.message || 'Failed to fetch amenities');
      setAmenityMessage(null);

      return {
        success: false,
        message: response.data.message || 'Failed to fetch amenities',
      };
    }
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 'Something went wrong';
    setError(errorMessage);
    setAmenityMessage(null);

    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setLoading(false);
  }
};



  // ✅ Fetch packages by sub_category_id
  const getPackages = async (sub_category_id: string) => {
    try {
      const response = await baseClient.get(APIEndpoints.getPackages, {
        params: { sub_category_id },
      });

      if (response.data?.status === true) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          data: [],
          message: response.data.message || 'Failed to fetch packages',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || 'Something went wrong',
      };
    }
  };

  // fetch amenities on mount
  useEffect(() => {
    getActiveAmenity();
  }, []);

  return {
    amenities,
    loading,
    error,
    amenityMessage,
    bookAmenityById,
    refetch: getActiveAmenity,
    getPackages, // <-- exposed from within the hook
  };
};
