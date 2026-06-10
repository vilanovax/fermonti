/** نمایش مبلغ به میلیون تومان با ارقام فارسی */
export function formatMillionToman(value: number, decimals = 1): string {
  const fa = value.toLocaleString("fa-IR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${fa} میلیون`;
}

export function formatCompactToman(millions: number): string {
  if (millions >= 1000) {
    return `${(millions / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 2 })} میلیارد`;
  }
  return `${millions.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیون`;
}
