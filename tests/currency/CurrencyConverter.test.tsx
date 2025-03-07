import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyConverter } from '@/app/(tools)/popular/currency/page';
import { currencyService } from '@/services/currency/currencyService';

jest.mock('@/services/currency/currencyService');

describe('CurrencyConverter', () => {
  const mockRates = {
    base: 'USD',
    rates: {
      EUR: 0.85,
      GBP: 0.73,
    },
    date: '2024-03-20',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (currencyService.getExchangeRates as jest.Mock).mockResolvedValue(mockRates);
  });

  it('renders currency inputs and fetches rates', async () => {
    render(<CurrencyConverter />);
    
    await waitFor(() => {
      expect(currencyService.getExchangeRates).toHaveBeenCalled();
    });

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
  });

  it('converts currency correctly', async () => {
    render(<CurrencyConverter />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.type(amountInput, '100');
    
    const toSelect = screen.getByLabelText(/to/i);
    await userEvent.selectOptions(toSelect, 'EUR');

    await waitFor(() => {
      expect(screen.getByText('85.00')).toBeInTheDocument();
    });
  });
}); 