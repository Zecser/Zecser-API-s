### 1. Get Exchange Rates
GET `/api/v1/currency/rates`

#### Get rates with default base (EUR)

GET `http://localhost:3000/api/v1/currency/rates`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "base": "EUR",
    "rates": {
      "USD": 1.0845,
      "GBP": 0.8573,
      "INR": 89.12,
      ...
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get rates with USD as base

GET `http://localhost:3000/api/v1/currency/rates?base=USD`

### 2. Convert Currency

GET http://localhost:3000/api/v1/currency/convert?from=USD&to=INR&amount=100

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "INR",
    "amount": 100,
    "result": 8325.50,
    "rate": 83.255,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}

### 3. Get Supported Currencies

GET http://localhost:3000/api/v1/currency/supported
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "EUR": "Euro",
    "USD": "US Dollar",
    "GBP": "British Pound",
    "INR": "Indian Rupee",
    ...
  }
}
```

### 4. Get Conversion History

GET http://localhost:3000/api/v1/currency/history?limit=5

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1705312200000",
      "from": "USD",
      "to": "EUR",
      "amount": 100,
      "result": 92.15,
      "rate": 0.9215,
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    ...
  ]
}
```