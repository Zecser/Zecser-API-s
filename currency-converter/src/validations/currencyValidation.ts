import { z } from 'zod';

export const convertCurrencySchema = z.object({
  query: z.object({
    from: z.string().length(3, 'Currency code must be 3 characters').toUpperCase(),
    to: z.string().length(3, 'Currency code must be 3 characters').toUpperCase(),
    amount: z.string().transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        throw new Error('Amount must be a positive number');
      }
      return num;
    }),
  }),
});

export const getRatesSchema = z.object({
  query: z.object({
    base: z.string().length(3, 'Currency code must be 3 characters').toUpperCase().optional(),
  }),
});

export type ConvertCurrencyInput = z.infer<typeof convertCurrencySchema>;
export type GetRatesInput = z.infer<typeof getRatesSchema>;
