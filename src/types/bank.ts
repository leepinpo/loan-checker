// src/types/bank.ts
export type BankProfile = {
  id: string;
  name: string;
  dsrLimit: number;
  maxTenureYears: number;
  maxEndAge: number;
  maxLTV: number;
  typicalInterestRate: number;
  ccTreatmentPercent: number;
  notes?: string;
  source?: string;
  sourceRef?: string;
};

export type BankSimulationResult = {
  bankId: string;
  bankName: string;
  maxLoanAllowed: number;
  maxInstallmentAllowed: number;
  propertyLoanAllowed: number; // min(propertyLoan, bankLTV*spa)
  propertyInstallment: number;
  ratio: number; // propertyInstallment / maxInstallmentAllowed
  verdict: "HIGH" | "BORDERLINE" | "LOW";
  assumptions: {
    tenureYears: number;
    interestRate: number;
    dsrLimit: number;
    maxLTV: number;
  };
};
