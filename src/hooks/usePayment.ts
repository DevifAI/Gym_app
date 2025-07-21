import RazorpayCheckout from 'react-native-razorpay';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';

type User = {
  name: string;
  email: string;
  phone: string;
};

type RazorpaySuccessData = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayErrorData = {
  code: number;
  description: string;
  metadata?: any;
};

type RazorpayOptions = {
  description: string;
  image?: string;
  currency: 'INR'; // Razorpay only supports INR for UPI
  key: string;
  amount: number; // Amount in paise (e.g., ₹1 = 100)
  name: string;
  order_id?: string;

  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };

  theme?: {
    color?: string;
  };

  notes?: Record<string, string>;

  method?: {
    card?: boolean;
    netbanking?: boolean;
    upi?: boolean;
    wallet?: boolean;
    emi?: boolean;
  };

  retry?: {
    enabled: boolean;
    max_count: number;
  };

  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  timeout?: number; // in seconds
  redirect?: boolean;
};


type PayOptions = {
  amount: number; // in INR
  user: User;
  onSuccess?: (data: RazorpaySuccessData) => void;
  onFailure?: (error: RazorpayErrorData) => void;
};

export const usePayment = () => {

    const {userId } = useSelector((state: RootState) => state.auth);

  const pay = ({ amount, user, onSuccess, onFailure }: PayOptions) => {
    const options: RazorpayOptions = {
      description: 'Order Payment',
      image: 'https://your-logo-url.com/logo.png',
      currency: 'INR',
      key: 'rzp_test_JiizLK0HUaAt46',
      amount: amount * 100, // ✅ number in paise
      name: 'Performyx',
      prefill: {
        email: user.email,
        contact: user.phone, 
        name: user.name,
      },
      theme: { color: '#075E4D' },
      method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: false,
  },
   retry: {
    enabled: true,
    max_count: 3,
  },
  timeout: 300, // 5 minutes
    };

    RazorpayCheckout.open(options)
      .then((data: RazorpaySuccessData) => {
        onSuccess?.(data);
        console.log('Success', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error: RazorpayErrorData) => {
        onFailure?.(error);
         console.log('Payment Failed', `${error.code}: ${error.description}`);
      });
  };

  const getPaymentHistory = async() =>{
    const payload = {
      member_id : userId,
    }

  try {
    const response = await baseClient.post(APIEndpoints.paymentHistory, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    return {
      success: false,
      data: [],
      message: error?.message || 'Failed to fetch payment history',
    };
  }
  }
  return { pay , getPaymentHistory };
};
