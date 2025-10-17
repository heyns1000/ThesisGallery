interface CurrencyConverterProps {
  usdAmount: number;
  showConverter?: boolean;
}

export function CurrencyConverter({ usdAmount, showConverter = true }: CurrencyConverterProps) {
  return (
    <span className="font-bold text-green-600 dark:text-green-400">
      ${usdAmount.toFixed(2)}
    </span>
  );
}
