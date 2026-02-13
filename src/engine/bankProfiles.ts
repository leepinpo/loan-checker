// src/engine/bankProfiles.ts
import type { BankProfile } from "../types/bank";

export const BANK_PROFILES: BankProfile[] = [
  {
    id: "maybank",
    name: "Maybank",
    dsrLimit: 0.7, // banks don't publish exact DSR publicly; keep 0.7 as baseline
    maxTenureYears: 35,
    maxEndAge: 70,
    maxLTV: 0.9,
    typicalInterestRate: 0.045,
    ccTreatmentPercent: 0.05,
    notes:
      "Maybank calculator shows 35 years or up to age 70. Use 70% DSR baseline for simulation.",
    source: "Maybank",
    sourceRef: "https://www.maybank2u.com.my/WebBank/M2UHomeloanCalculator.html",
  },
  {
    id: "cimb",
    name: "CIMB",
    dsrLimit: 0.7,
    maxTenureYears: 35,
    maxEndAge: 70,
    maxLTV: 0.95, // some products show up to 95% inclusive of fees/promos
    typicalInterestRate: 0.044,
    ccTreatmentPercent: 0.05,
    notes:
      "CIMB advertises up to 95% financing on some packages; simulate with 95% as optimistic case.",
    source: "CIMB",
    sourceRef: "https://www.cimbpreferred.com.my/en/preferred-experience/banking-solutions/financing/home-loan.html",
  },
  {
    id: "hlb",
    name: "Hong Leong Bank",
    dsrLimit: 0.7,
    maxTenureYears: 35,
    maxEndAge: 70,
    maxLTV: 0.9,
    typicalInterestRate: 0.046,
    ccTreatmentPercent: 0.05,
    notes:
      "HLB notes 90% (residential) / 85% (non-residential) and tenure up to 35/age 70.",
    source: "HLB",
    sourceRef: "https://www.hlb.com.my/en/personal-banking/loans/property-loan/home-loan.html",
  },
  {
    id: "rhb",
    name: "RHB",
    dsrLimit: 0.7,
    maxTenureYears: 35,
    maxEndAge: 70,
    maxLTV: 0.9,
    typicalInterestRate: 0.047,
    ccTreatmentPercent: 0.05,
    notes:
      "RHB product pages list up to 90% + additional allowances for fees; assume 90% baseline.",
    source: "RHB",
    sourceRef: "https://www.rhbgroup.com/personal/home-loan/my1-full-flexi-home-loan/index.html",
  },
  {
    id: "publicbank",
    name: "Public Bank",
    dsrLimit: 0.7,
    maxTenureYears: 35,
    maxEndAge: 70,
    maxLTV: 0.9,
    typicalInterestRate: 0.044,
    ccTreatmentPercent: 0.05,
    notes: "Public Bank public materials show 35-year tenures; rates vary by product.",
    source: "Public Bank",
    sourceRef: "https://www.pbebank.com/en/loans/home-loan-financing/",
  },
];
