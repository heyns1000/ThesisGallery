import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpDown, DollarSign } from 'lucide-react';

interface CurrencyConverterProps {
  usdAmount: number;
  size?: 'sm' | 'md' | 'lg';
  showConverter?: boolean;
}

const exchangeRates = {
  USD: 1.00,
  EUR: 0.85,
  GBP: 0.73,
  ZAR: 18.50,
  JPY: 110.0,
  AUD: 1.35,
  CAD: 1.25,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZAR: 'R',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹'
};

export function CurrencyConverter({ usdAmount, size = 'md', showConverter = false }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(usdAmount);

  useEffect(() => {
    const rate = exchangeRates[selectedCurrency as keyof typeof exchangeRates];
    setConvertedAmount(usdAmount * rate);
  }, [usdAmount, selectedCurrency]);

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency as keyof typeof currencySymbols];
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    })}`;
  };

  if (!showConverter) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">
              {formatAmount(usdAmount, 'USD')}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs">
              <div>💱 Currency Conversions:</div>
              <div>🇺🇸 USD: ${usdAmount.toFixed(2)}</div>
              <div>🇿🇦 ZAR: R{(usdAmount * 18.50).toFixed(2)}</div>
              <div>🇪🇺 EUR: €{(usdAmount * 0.85).toFixed(2)}</div>
              <div>🇬🇧 GBP: £{(usdAmount * 0.73).toFixed(2)}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono">
        {formatAmount(convertedAmount, selectedCurrency)}
      </Badge>
      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <SelectTrigger className="w-20 h-6 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">🇺🇸 USD</SelectItem>
          <SelectItem value="ZAR">🇿🇦 ZAR</SelectItem>
          <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
          <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
          <SelectItem value="JPY">🇯🇵 JPY</SelectItem>
          <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
          <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
          <SelectItem value="CHF">🇨🇭 CHF</SelectItem>
          <SelectItem value="CNY">🇨🇳 CNY</SelectItem>
          <SelectItem value="INR">🇮🇳 INR</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}