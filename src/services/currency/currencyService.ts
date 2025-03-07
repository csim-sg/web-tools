import { env } from '@/config/env';

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  date: string;
}

export const currencyService = {
  async getExchangeRates(base: string = 'USD'): Promise<ExchangeRates> {
    const response = await fetch(`${env.api.exchangeRate}/latest/${base}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    return response.json();
  }
}; 