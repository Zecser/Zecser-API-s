import { Router } from 'express';
import {
  getExchangeRates,
  convertCurrency,
  getSupportedCurrencies,
  getConversionHistory,
} from '../controllers/currencyController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { convertCurrencySchema, getRatesSchema } from '../validations/currencyValidation';

const router = Router();

/**
 * @swagger
 * /api/v1/currency/rates:
 *   get:
 *     summary: Get exchange rates
 *     parameters:
 *       - in: query
 *         name: base
 *         schema:
 *           type: string
 *         description: Base currency (default INR)
 *         example: USD
 *     responses:
 *       200:
 *         description: Exchange rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 base: { type: string }
 *                 rates: { type: object, additionalProperties: { type: number } }
 *             example:
 *               base: USD
 *               rates: { EUR: 0.85, GBP: 0.73, JPY: 110.0 }
 *       400:
 *         description: Bad request
 */
router.get('/rates', validateRequest(getRatesSchema), getExchangeRates);
/**
 * @swagger
 * /api/v1/currency/convert:
 *   get:
 *     summary: Convert currency
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         example: USD
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         example: EUR
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *         example: 100
 *     responses:
 *       200:
 *         description: Conversion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from: { type: string }
 *                 to: { type: string }
 *                 amount: { type: number }
 *                 convertedAmount: { type: number }
 *                 rate: { type: number }
 *             example:
 *               from: USD
 *               to: EUR
 *               amount: 100
 *               convertedAmount: 85.5
 *               rate: 0.855
 *       400:
 *         description: Bad request
 */

router.get('/convert', validateRequest(convertCurrencySchema), convertCurrency);

/**
 * @swagger
 * /api/v1/currency/supported:
 *   get:
 *     summary: Get supported currencies
 *     responses:
 *       200:
 *         description: List of supported currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currencies: { type: array, items: { type: string } }
 *             example:
 *               currencies: ["USD", "EUR", "GBP", "JPY"]
 */
router.get('/supported', getSupportedCurrencies);

/**
 * @swagger
 * /api/v1/currency/history:
 *   get:
 *     summary: Get conversion history
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return (default 10)
 *         example: 5
 *     responses:
 *       200:
 *         description: Conversion history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history: { type: array, items: { type: object, properties: { from: { type: string }, to: { type: string }, amount: { type: number }, convertedAmount: { type: number }, rate: { type: number }, timestamp: { type: string, format: date-time } } } }
 *             example:
 *               history: [{ from: "USD", to: "EUR", amount: 100, convertedAmount: 85.5, rate: 0.855, timestamp: "2023-10-01T12:00:00Z" }]
 *       400:
 *         description: Bad request
 */
router.get('/history', getConversionHistory);

export default router;
