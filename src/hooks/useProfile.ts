import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import { updateAddress } from '../redux/slices/authSlice';


type AddressPayload = {
  member_id: number | string;
  address: string;
  location: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
};

export const useProfile = () => {
  const dispatch = useDispatch();

  const updateUserAddress = useCallback(
    async (payload: AddressPayload): Promise<{ success: boolean; message?: string }> => {
      try {
        const response : any = await baseClient.post(APIEndpoints.address, payload);

        if (response?.data?.status === true) {
          const updatedAddress = {
            address: payload.address,
            location: payload.location,
            country: payload.country,
            state: payload.state,
            city: payload.city,
            pin: payload.pincode,
          };

          dispatch(updateAddress(updatedAddress));
          return { success: true };
        } else {
          return { success: false, message: response?.msg || 'Failed to update address' };
        }
      } catch (error) {
        return { success: false, message: 'Something went wrong' };
      }
    },
    [dispatch]
  );

  return {
    updateUserAddress,
  };
};
