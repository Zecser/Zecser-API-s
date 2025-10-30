import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logger';
import { rateLimiter } from './middlewares/rateLimiter';
import currencyRoutes from './routes/currencyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Currency Converter API',
    version: '1.0.0',
    description: 'A professional currency converter API',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/currency', currencyRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
