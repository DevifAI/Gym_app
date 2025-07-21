import { useEffect, useState } from 'react';
import { baseClient } from '../services/api.clients';
import { APIEndpoints } from '../services/api.endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Product {
  package_id: string;
  branch: string;
  package_name: string;
  price: string;
  sub_category_id: string;
  valid_for: string;
  allow_ext: string;
  description: string | null;
  image: string | null;
  popup: string;
  created_at: string;
  status: string;
  sub_category_name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  subCategoryId: string;
  subCategoryName: string;
}

interface BuyProductPayload {
  date: string;
  totalPrice: number;
  items: CartItem[];
}

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {userId } = useSelector((state: RootState) => state.auth);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await baseClient.post(APIEndpoints.getAllProduct);

      if (response.data.status) {
        setProducts(response.data.data);
        setMessage(response.data.message);
        setError(null);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Something went wrong while fetching products');
    } finally {
      setLoading(false);
    }
  };

 const buyProductByMemberId = async (payload: BuyProductPayload) => {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is missing',
      cart_id: [],
    };
  }

  const finalPayload = {
    ...payload,
    memberId: userId,
  };

  try {
    const response = await baseClient.post(APIEndpoints.buyProduct, finalPayload);
    console.log('[buyProductByMemberId] Response:', response.data);

    if (response.data?.status === true) {
      return {
        success: true,
        message: response.data.message,
        cart_items: response.data.cart_items || [],
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to add items to cart',
        cart_items: [],
      };
    }
  } catch (error: any) {
    console.error('[buyProductByMemberId] Error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Something went wrong while adding product to cart',
      cart_items: [],
    };
  }
};

const productPaymentByMemberId = async ({
    transactionId,
    savedCartItems,
    status,
  }: {
    transactionId: string;
    savedCartItems: {
      cart_id: number;
      product_id: string;
      quantity: number;
      total_price: number;
    }[];
    status: string;
  }) => {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is missing',
      };
    }

    const payload = {
      memberId: userId,
      transactionId,
      savedCartItems,
      status,
    };

    try {
      const response = await baseClient.post(APIEndpoints.productPayment, payload);
      console.log('[productPaymentByMemberId] Response:', response.data);

      if (response.data?.status === true) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data || {},
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Payment confirmation failed',
        };
      }
    } catch (error: any) {
      console.error('[productPaymentByMemberId] Error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Something went wrong during payment confirmation',
      };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    message,
    loading,
    error,
    refetch: fetchProducts,
    buyProductByMemberId, // ✅ Expose new function
    productPaymentByMemberId,
  };
};
