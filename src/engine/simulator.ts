import { BANK_PROFILES } from "./bankProfiles";
import type { BankSimulationResult } from "../types/bank";
import { loanToInstallment, installmentToLoan } from "./mortgage";

export function simulateBanks(
  customer: {
    grossIncome: number;
    deductions: { name: string; amount: number }[];
    age: number;
  },
  property: { spaPrice: number; margin: number }
): BankSimulationResult[] {
  const totalDeductions = customer.deductions.reduce((s, d) => s + d.amount, 0);
  const netIncome = Math.max(0, customer.grossIncome - totalDeductions);

  return BANK_PROFILES.map((bank) => {
    const maxInstallment = Math.max(0, netIncome * bank.dsrLimit);

    const tenureYears = Math.min(
      bank.maxTenureYears,
      Math.max(1, bank.maxEndAge - customer.age)
    );
    const months = Math.max(1, Math.floor(tenureYears * 12));

    const maxLoanAllowed = Math.round(
      installmentToLoan(maxInstallment, bank.typicalInterestRate, months)
    );

    const bankMaxLoanByLTV = Math.round(bank.maxLTV * property.spaPrice);
    const requestedPropertyLoan = Math.round(property.spaPrice * property.margin);
    const propertyLoanAllowed = Math.min(maxLoanAllowed, bankMaxLoanByLTV);

    const propertyInstallment = Math.round(
      loanToInstallment(
        Math.min(requestedPropertyLoan, bankMaxLoanByLTV),
        bank.typicalInterestRate,
        months
      )
    );

    const ratio = maxInstallment > 0 ? propertyInstallment / maxInstallment : Infinity;

    let verdict: BankSimulationResult["verdict"] = "HIGH";
    if (ratio > 1) verdict = "LOW";
    else if (ratio > 0.9) verdict = "BORDERLINE";

    return {
      bankId: bank.id,
      bankName: bank.name,
      maxLoanAllowed,
      maxInstallmentAllowed: Math.round(maxInstallment),
      propertyLoanAllowed,
      propertyInstallment,
      ratio: Number.isFinite(ratio) ? Number(ratio.toFixed(3)) : Number.POSITIVE_INFINITY,
      verdict,
      assumptions: {
        tenureYears,
        interestRate: bank.typicalInterestRate,
        dsrLimit: bank.dsrLimit,
        maxLTV: bank.maxLTV,
      },
    };
  });
}
