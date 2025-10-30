import axios from "axios";

const API_BASE_URL =
  "https://razorpay-sxsq.onrender.com/api/payment" || "http://localhost:5000/api/payment";

export const createOrder = async (amount) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-order`, {
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
