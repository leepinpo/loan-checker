export function installmentToLoan(
  monthly: number,
  rate: number,
  months: number
) {
  const r = rate / 12;
  return monthly * ((1 - Math.pow(1 + r, -months)) / r);
}

export function loanToInstallment(
  loan: number,
  rate: number,
  months: number
) {
  const r = rate / 12;
  return loan * (r / (1 - Math.pow(1 + r, -months)));
}
