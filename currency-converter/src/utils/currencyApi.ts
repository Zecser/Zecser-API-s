import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import { config } from '../config';

interface ExchangeRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface SupportedCurrenciesResponse {
  [key: string]: string;
}

class CurrencyApi {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: config.cacheTtl });
  }

  async getExchangeRates(base: string = 'EUR'): Promise<Record<string, number>> {
    const cacheKey = `rates_${base}`;
    const cachedRates = this.cache.get<Record<string, number>>(cacheKey);

    if (cachedRates) {
      return cachedRates;
    }

    try {
      const response: AxiosResponse<ExchangeRatesResponse> = await axios.get(
        `${config.apiBaseUrl}/latest?base=${base}`
      );

      const rates = response.data.rates;
      this.cache.set(cacheKey, rates);
      return rates;
    } catch (error) {
      throw new Error('Failed to fetch exchange rates');
    }
  }

  async convertCurrency(from: string, to: string, amount: number): Promise<number> {
    const cacheKey = `convert_${from}_${to}_${amount}`;
    const cachedResult = this.cache.get<number>(cacheKey);

    if (cachedResult !== undefined) {
      return cachedResult;
    }

    try {
      const rates = await this.getExchangeRates(from);
      if (!rates[to]) {
        throw new Error(`Currency ${to} not supported`);
      }
      const result = amount * rates[to];
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new Error('Failed to convert currency');
    }
  }

  async getSupportedCurrencies(): Promise<Record<string, string>> {
    const cacheKey = 'supported_currencies';
    const cachedCurrencies = this.cache.get<Record<string, string>>(cacheKey);

    if (cachedCurrencies) {
      return cachedCurrencies;
    }

    try {
      const response: AxiosResponse<SupportedCurrenciesResponse> = await axios.get(
        `${config.apiBaseUrl}/currencies`
      );

      const currencies = response.data;
      this.cache.set(cacheKey, currencies);
      return currencies;
    } catch (error) {
      throw new Error('Failed to fetch supported currencies');
    }
  }
}

export const currencyApi = new CurrencyApi();
