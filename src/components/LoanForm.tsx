import { useState } from "react";
import { simulateBanks } from "../engine/simulator";

type Deduction = { name: string; amount: number };

export default function LoanForm() { //edited 13.2.26 9:30pm
  // --- state ---
  const [grossIncome, setGrossIncome] = useState(0);
  const [age, setAge] = useState(30);

  const [spaPrice, setSpaPrice] = useState(0);
  const [margin, setMargin] = useState(0.9);

  const [deductions, setDeductions] = useState<Deduction[]>([
    { name: "", amount: 0 },
  ]);

  const [bankResults, setBankResults] = useState<any[]>([]);
  const [showOnlyPass, setShowOnlyPass] = useState(false);

  // --- derived values ---
  const totalDeductions = deductions.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );

  const netIncome = Math.max(0, grossIncome - totalDeductions);
  const dsrLimit = 0.7;
  const maxInstallment = netIncome * dsrLimit;

  const displayedBanks = showOnlyPass
    ? bankResults.filter((b) => b.verdict !== "LOW")
    : bankResults;

  // --- handlers ---
  function updateDeduction(index: number, field: string, value: any) {
    const copy = [...deductions];
    copy[index] = { ...copy[index], [field]: value };
    setDeductions(copy);
  }

  function addDeduction() {
    setDeductions([...deductions, { name: "", amount: 0 }]);
  }

  function handleCalculate() {
    const sims = simulateBanks(
      { grossIncome, deductions, age },
      { spaPrice, margin }
    );
    setBankResults(sims);
  }

  // --- UI ---
  return (
    <div style={{ maxWidth: 650 }}>
      <h2>Loan Readiness Tool</h2>

      <h3>Income</h3>
      <input
        value={grossIncome}
        placeholder="Gross income"
        type="number"
        onChange={(e) => setGrossIncome(Number(e.target.value))}
      />

      <h3>Deductions / Debts</h3>
      {deductions.map((d, i) => (
        <div key={i}>
          <input
            value={d.name}
            placeholder="Name"
            onChange={(e) =>
              updateDeduction(i, "name", e.target.value)
            }
          />
          <input
            value={d.amount}
            placeholder="Amount"
            type="number"
            onChange={(e) =>
              updateDeduction(i, "amount", Number(e.target.value))
            }
          />
        </div>
      ))}

      <button onClick={addDeduction}>+ Add deduction</button>

      <p>Net income: RM {netIncome.toLocaleString()}</p>

      <h3>Property</h3>
      <input
        value={spaPrice}
        placeholder="SPA price"
        type="number"
        onChange={(e) => setSpaPrice(Number(e.target.value))}
      />

      <select
        value={margin}
        onChange={(e) => setMargin(Number(e.target.value))}
      >
        <option value={0.9}>90%</option>
        <option value={0.85}>85%</option>
      </select>

      <h3>Age</h3>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />

      <br />
      <button onClick={handleCalculate}>Calculate</button>

      {bankResults.length > 0 && (
        <>
          <div
            style={{
              marginTop: 20,
              padding: 12,
              border: "2px solid #333",
              background: "#f7f7f7",
            }}
          >
            <h3>Customer Capacity Summary</h3>

            <p>Gross income: RM {grossIncome.toLocaleString()}</p>
            <p>Total deductions: RM {totalDeductions.toLocaleString()}</p>
            <p>Net income: RM {netIncome.toLocaleString()}</p>

            <p>
              Max monthly installment capacity (70% DSR):
              <strong>
                {" "}
                RM {Math.round(maxInstallment).toLocaleString()}
              </strong>
            </p>

            <p>
              Requested property loan:
              <strong>
                {" "}
                RM {(spaPrice * margin || 0).toLocaleString()}
              </strong>
            </p>
          </div>

          <label>
            <input
              type="checkbox"
              checked={showOnlyPass}
              onChange={(e) => setShowOnlyPass(e.target.checked)}
            />
            Show only likely approvals
          </label>

          <table border={1} cellPadding={6} style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Loan Amount</th>
                <th>Tenure</th>
                <th>Interest</th>
                <th>Monthly Installment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {displayedBanks.map((b) => (
                <tr key={b.bankId}>
                  <td>{b.bankName}</td>
                  <td>RM {b.propertyLoanAllowed.toLocaleString()}</td>
                  <td>{b.assumptions.tenureYears} yrs</td>
                  <td>
                    {(b.assumptions.interestRate * 100).toFixed(2)}%
                  </td>
                  <td>RM {b.propertyInstallment.toLocaleString()}</td>
                  <td>
                    <strong
                      style={{
                        color:
                          b.verdict === "HIGH"
                            ? "green"
                            : b.verdict === "BORDERLINE"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {b.verdict}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
