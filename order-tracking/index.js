const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const ordersRoute = require('./routes/orders');
const productsRoute = require('./routes/products');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Tracking API',
      version: '1.0.0',
      description: 'API documentation for the Order Tracking system',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/orders', ordersRoute);
app.use('/api/products', productsRoute);

app.get('/', (req, res) => {
  res.send('☁️ Server is running on the cloud!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
