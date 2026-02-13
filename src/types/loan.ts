export type Deduction = {
  name: string;
  amount: number;
};

export type CustomerInput = {
  grossIncome: number;
  deductions: Deduction[];
  age: number;
};

export type PropertyInput = {
  spaPrice: number;
  margin: number;
};

export type LoanResult = {
  netIncome: number;
  maxInstallment: number;
  maxLoan: number;
  propertyLoan: number;
  propertyInstallment: number;
  tenureYears: number;
  interestRate: number;
  dsrLimit: number;
  confidence: number;
  status: "HIGH" | "BORDERLINE" | "LOW";
};
