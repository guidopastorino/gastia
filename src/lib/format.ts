type MoneyOptions = {
  /** Prefix positive values with `+`. */
  signed?: boolean;
  decimals?: number;
};

/** 24850.4 -> "$24,850.40", -84.5 -> "-$84.50" */
export function formatMoney(value: number, { signed = false, decimals = 2 }: MoneyOptions = {}) {
  const abs = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = value < 0 ? '-' : signed && value > 0 ? '+' : '';
  return `${sign}$${abs}`;
}

/** 12.4 -> "+12.4%" */
export function formatPercent(value: number, { signed = true }: { signed?: boolean } = {}) {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;
}
