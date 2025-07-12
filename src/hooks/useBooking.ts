import { useState } from "react";
import { useSelector } from "react-redux";
import { baseClient } from "../services/api.clients";
import { APIEndpoints } from "../services/api.endpoints";

export const useBooking = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [bookingList, setBookingList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const getBookingList = async () => {
    setLoading(true);
    setError(null);
    setBookingMessage(null);
    
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }

      const response = await baseClient.post(APIEndpoints.bookingList, {
        member_id: userId,
      });

      if (response.data?.status === "success") {
        setBookingList(response.data.bookings);
        setBookingMessage(`Found ${response.data.total_bookings} bookings`);
        return response.data;
      } else {
        throw new Error(response.data?.error || "Unknown error occurred");
      }
    } catch (error: any) {
      let errorMessage = "Failed to fetch booking list";
      
      if (error.response) {
        // Handle HTTP error responses
        if (error.response.status === 400) {
          errorMessage = "Invalid or missing member ID";
        } else if (error.response.status === 404) {
          errorMessage = "Member not found";
        } else if (error.response.status === 405) {
          errorMessage = "Invalid request method. Please try again";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later";
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getBookingList,
    bookingList,
    loading,
    error,
    bookingMessage,
  };
};