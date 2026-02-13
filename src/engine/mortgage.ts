export function installmentToLoan(monthly: number, rate: number, months: number) {
  if (months <= 0 || monthly <= 0) return 0;

  const r = rate / 12;
  if (r === 0) return monthly * months;

  return monthly * ((1 - Math.pow(1 + r, -months)) / r);
}

export function loanToInstallment(loan: number, rate: number, months: number) {
  if (months <= 0 || loan <= 0) return 0;

  const r = rate / 12;
  if (r === 0) return loan / months;

  return loan * (r / (1 - Math.pow(1 + r, -months)));
}
