import { CustomerInput, PropertyInput, LoanResult } from "../types/loan";
import { installmentToLoan, loanToInstallment } from "./mortgage";

const RATE = 0.045;
const DSR = 0.7;

export function calculateProfile(
  customer: CustomerInput,
  property: PropertyInput
): LoanResult {
  const totalDeductions = customer.deductions.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  const netIncome = Math.max(0, customer.grossIncome - totalDeductions);

  const tenureYears = Math.max(1, Math.min(35, 70 - customer.age));
  const months = tenureYears * 12;

  const maxInstallment = netIncome * DSR;
  const maxLoan = installmentToLoan(maxInstallment, RATE, months);

  const propertyLoan = property.spaPrice * property.margin;

  const propertyInstallment = loanToInstallment(
    propertyLoan,
    RATE,
    months
  );

  const ratio = maxInstallment > 0 ? propertyInstallment / maxInstallment : Infinity;

  let status: LoanResult["status"] = "HIGH";
  if (ratio > 1) status = "LOW";
  else if (ratio > 0.9) status = "BORDERLINE";

  const confidence = Number.isFinite(ratio)
    ? Math.max(0, Math.round(ratio * 100))
    : 100;

  return {
    netIncome: Math.round(netIncome),
    maxInstallment: Math.round(maxInstallment),
    maxLoan: Math.round(maxLoan),
    propertyLoan: Math.round(propertyLoan),
    propertyInstallment: Math.round(propertyInstallment),
    tenureYears,
    interestRate: RATE,
    dsrLimit: DSR,
    confidence,
    status,
  };
}
