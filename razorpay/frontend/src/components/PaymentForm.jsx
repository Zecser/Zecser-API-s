import { useState } from 'react';
import { createOrder, verifyPayment } from '../api/paymentApi';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      // Create order
      const orderData = await createOrder(parseInt(amount));
      setMessage({ type: 'success', text: 'Order created successfully' });

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage({ type: 'error', text: 'Failed to load Razorpay script' });
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Razorpay Payment',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            const verifyResult = await verifyPayment(verifyData);
            if (verifyResult.success) {
              setMessage({ type: 'success', text: 'Payment verified successfully!' });
            } else {
              setMessage({ type: 'error', text: 'Payment verification failed' });
            }
          } catch (error) {
            setMessage({ type: 'error', text: 'Payment verification failed' });
          }
          setLoading(false);
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create order' });
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xs text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Make a Payment</h1>
        <p className="text-gray-500 mt-2">All transactions are secure and encrypted.</p>
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        />
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-1/2 bg-blue-600 text-white font-medium py-2 mt-4 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
      {message && (
        <div className={`mt-4 p-3 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
