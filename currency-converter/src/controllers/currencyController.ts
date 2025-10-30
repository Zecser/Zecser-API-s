import { Request, Response, NextFunction } from 'express';
import { currencyApi } from '../utils/currencyApi';
import { ConversionHistoryModel } from '../models/ConversionHistory';
import { logger } from '../middlewares/logger';
import { CustomError } from '../middlewares/errorHandler';

const historyModel = new ConversionHistoryModel();

export const getExchangeRates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const base = req.query.base as string || 'EUR';
    const rates = await currencyApi.getExchangeRates(base);

    logger.info(`Fetched exchange rates for base ${base}`);
    res.json({
      success: true,
      data: {
        base,
        rates,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const convertCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, to, amount } = req.query as { from: string; to: string; amount: string };
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      const error: CustomError = new Error('Invalid amount');
      error.statusCode = 400;
      return next(error);
    }

    const result = await currencyApi.convertCurrency(from, to, amountNum);
    const rates = await currencyApi.getExchangeRates(from);
    const rate = rates[to];

    // Add to history
    historyModel.addConversion({
      from,
      to,
      amount: amountNum,
      result,
      rate,
    });

    logger.info(`Converted ${amountNum} ${from} to ${result} ${to}`);
    res.json({
      success: true,
      data: {
        from,
        to,
        amount: amountNum,
        result,
        rate,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSupportedCurrencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currencies = await currencyApi.getSupportedCurrencies();

    logger.info('Fetched supported currencies');
    res.json({
      success: true,
      data: currencies,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const history = historyModel.getHistory(limit);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
