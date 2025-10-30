# Postman Testing Guide for Razorpay Backend

This guide provides step-by-step instructions for testing the Razorpay backend API using Postman. The backend is built with TypeScript and Express.js, integrating Razorpay for payment processing.

## Prerequisites

- Node.js installed (version 14 or higher)
- Postman installed (download from [postman.com](https://www.postman.com/downloads/))
- A Razorpay account with API keys (test mode recommended)
- MongoDB installed and running (download from [mongodb.com](https://www.mongodb.com/try/download/community))
- MongoDB Compass installed (optional, for GUI database management)

## Environment Setup

1. Clone or navigate to the project directory.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   MONGODB_URI=mongodb://localhost:27017/razorpay-demo
   ```
   Replace `your_razorpay_key_id` and `your_razorpay_key_secret` with your actual Razorpay test credentials.
   The `MONGODB_URI` is set to connect to a local MongoDB instance. Adjust if using a different MongoDB setup (e.g., MongoDB Atlas).

## Running the Server

1. Build the project:
   ```
   npm run build
   ```
2. Start the server in development mode:
   ```
   npm run dev
   ```
   The server should start on `http://localhost:5000`.

## Postman Setup

1. Open Postman.
2. Create a new collection named "Razorpay Backend Tests".
3. Set the base URL to `http://localhost:5000` in the collection variables or directly in requests.

## API Endpoints Testing

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Checks if the server is running.

**Steps:**
1. Create a new GET request.
2. Set URL to `{{base_url}}/` (or `http://localhost:5000/`).
3. Click "Send".
4. Expected Response (200 OK):
   ```json
   {
     "message": "Razorpay Backend Server is running!"
   }
   ```

### 2. Create Order

**Endpoint:** `POST /api/payment/create-order`

**Description:** Creates a new Razorpay order for payment.

**Request Body:**
- Content-Type: `application/json`
- Body:
  ```json
  {
    "amount": 100
  }
  ```
  (Amount in rupees, e.g., 100 for ₹100)

**Steps:**
1. Create a new POST request.
2. Set URL to `{{base_url}}/api/payment/create-order`.
3. Go to "Body" tab, select "raw" and "JSON".
4. Paste the request body above.
5. Click "Send".
6. Expected Response (200 OK):
   ```json
   {
     "id": "order_xyz123",
     "amount": 10000,
     "currency": "INR"
   }
   ```
   Note: Amount is returned in paisa (100 * 100 = 10000).

**Error Cases:**
- Invalid amount (e.g., 0 or negative): 400 Bad Request with `{"error": "Invalid amount"}`
- Missing amount: 400 Bad Request

### 3. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Description:** Verifies a payment using Razorpay's signature.

**Request Body:**
- Content-Type: `application/json`
- Body:
  ```json
  {
    "razorpay_order_id": "order_xyz123",
    "razorpay_payment_id": "pay_abc456",
    "razorpay_signature": "signature_from_razorpay_webhook_or_frontend"
  }
  ```

**Steps:**
1. Create a new POST request.
2. Set URL to `{{base_url}}/api/payment/verify`.
3. Go to "Body" tab, select "raw" and "JSON".
4. Paste the request body above (use actual values from a real payment or test data).
5. Click "Send".
6. Expected Response (200 OK for success):
   ```json
   {
     "success": true,
     "message": "Payment verified successfully"
   }
   ```
   For failure (400 Bad Request):
   ```json
   {
     "success": false,
     "message": "Payment verification failed"
   }
   ```

**Note:** For testing, you may need to simulate a payment through Razorpay's dashboard or use test payment IDs. The signature is generated using HMAC SHA256 with the order ID, payment ID, and your secret key.

## Testing Tips

- Use Razorpay's test mode for all testing to avoid real transactions.
- Test edge cases like invalid amounts, missing fields, and incorrect signatures.
- Monitor server logs for any errors during testing.
- If the server is not responding, ensure it's running and the port is correct.

## Troubleshooting

- **Server not starting:** Check for missing environment variables or port conflicts.
- **Razorpay errors:** Verify your API keys are correct and in test mode.
- **Postman issues:** Ensure the correct HTTP method and content type are set.

This guide covers the basic testing scenarios. For more advanced testing, consider using Postman's Runner for automated tests or Newman for CI/CD integration.
