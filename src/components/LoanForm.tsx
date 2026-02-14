import { useState, useRef } from "react";
import { simulateBanks } from "../engine/simulator";
import logo from "../assets/kemarisbluelogo.png";
import html2pdf from "html2pdf.js";
import ConfidenceGauge from "../components/ConfidenceGauge";


type Deduction = { name: string; amount: string };

export default function LoanForm() {
  // --- customer info ---
  const [customerName, setCustomerName] = useState("");
  const [icNumber, setIcNumber] = useState("");

  // --- report date ---
  const [reportDate, setReportDate] = useState("");

  // --- financial state ---
  const [grossIncome, setGrossIncome] = useState("");
  const [age, setAge] = useState(30);

  const [spaPrice, setSpaPrice] = useState("");
  const [margin, setMargin] = useState(0.9);

  const [deductions, setDeductions] = useState<Deduction[]>([
    { name: "", amount: "" },
  ]);

  // --- results ---
  const [bankResults, setBankResults] = useState<any[]>([]);
  const [showOnlyPass, setShowOnlyPass] = useState(false);

  const reportRef = useRef<HTMLDivElement | null>(null);

  // --- derived values ---
  const totalDeductions = deductions.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const netIncome = Math.max(
    0,
    Number(grossIncome || 0) - totalDeductions
  );

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
    setDeductions([...deductions, { name: "", amount: "" }]);
  }

  function handleCalculate() {
    const sims = simulateBanks(
      {
        grossIncome: Number(grossIncome || 0),
        deductions: deductions.map((d) => ({
          name: d.name,
          amount: Number(d.amount || 0),
        })),
        age,
      },
      {
        spaPrice: Number(spaPrice || 0),
        margin,
      }
    );

    setBankResults(sims);
  }

  function handleReset() {
    setCustomerName("");
    setIcNumber("");
    setGrossIncome("");
    setAge(30);
    setSpaPrice("");
    setMargin(0.9);
    setDeductions([{ name: "", amount: "" }]);
    setBankResults([]);
    setShowOnlyPass(false);
  }

  function handleExportPDF() {
    if (!reportRef.current) return;

    html2pdf()
      .set({
        margin: 10,
        filename: `${customerName || "loan-report"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  }

  const bestBank = displayedBanks[0];

  const confidence = bestBank
    ? Math.max(
        0,
        Math.min(100, Math.round((bestBank.ratio) * 100))
      )
    : 0;


  // --- UI ---
  return (
    <div className="app-container">

      {/* Header */}
      <div className="header">
        <img src={logo} alt="Company Logo" />
        <div className="company-name">
          Kemaris Development Sdn. Bhd.
        </div>
        <div className="report-title">
          Loan Readiness Report
        </div>
      </div>

      {/* Customer card */}
      <div className="card">
        <h3>Customer Info</h3>
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          placeholder="IC Number"
          value={icNumber}
          onChange={(e) => setIcNumber(e.target.value)}
        />
        <input
          placeholder="Report Date (e.g. 14 Feb 2026)"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
        />
      </div>

      {/* Income card */}
      <div className="card">
        <h3>Income</h3>
        <input
          value={grossIncome}
          placeholder="Gross income"
          type="number"
          onChange={(e) => setGrossIncome(e.target.value)}
        />

        <h3>Deductions / Debts</h3>
        {deductions.map((d, i) => (
          <div className="row" key={i}>
            <input
              placeholder="Loan / Debt Name"
              value={d.name}
              onChange={(e) =>
                updateDeduction(i, "name", e.target.value)
              }
            />
            <input
              placeholder="Amount"
              value={d.amount}
              type="number"
              onChange={(e) =>
                updateDeduction(i, "amount", e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={addDeduction}>+ Add deduction</button>

        <p>
          <strong>Net income:</strong> RM {netIncome.toLocaleString()}
        </p>
      </div>

      {/* Property card */}
      <div className="card">
        <h3>Property</h3>

        <div className="label">Property Price (SPA)</div>
        <input
          placeholder="Amount"
          value={spaPrice}
          type="number"
          onChange={(e) => setSpaPrice(e.target.value)}
        />

        <div className="label">Margin of Finance</div>
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

        <button onClick={handleCalculate}>Calculate</button>
        <button
          className="secondary"
          onClick={handleReset}
          style={{ marginLeft: 8 }}
        >
          Reset
        </button>

        {bankResults.length > 0 && (
          <button onClick={handleExportPDF}>
            Export PDF
          </button>
        )}
      </div>

      {/* Results */}
      {bankResults.length > 0 && (
        <div ref={reportRef}>

          <div className="card summary">
            <h3>Customer Capacity Summary</h3>

              <div className="summary-layout">

                {/* LEFT SIDE TEXT */}
                <div>

                  <p><strong>Customer:</strong> {customerName || "—"}</p>
                  <p><strong>IC:</strong> {icNumber || "—"}</p>
                  <p><strong>Report Date:</strong> {reportDate || "—"}</p>

                  <p>
                    Gross income: RM {Number(grossIncome || 0).toLocaleString()}
                  </p>

                  <p>
                    Total deductions: RM {totalDeductions.toLocaleString()}
                  </p>

                  <p>
                    Net income: RM {netIncome.toLocaleString()}
                  </p>

                  <p>
                    Max installment capacity:
                    <strong>
                      {" "}
                      RM {Math.round(maxInstallment).toLocaleString()}
                    </strong>
                  </p>

                  <p>
                    Requested loan:
                    <strong>
                      {" "}
                      RM {(Number(spaPrice || 0) * margin).toLocaleString()}
                    </strong>
                  </p>

                </div>

                {/* RIGHT SIDE GAUGE */}
                <ConfidenceGauge value={confidence} />

              </div>
            </div>


          <table style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Loan Amount</th>
                <th>Tenure</th>
                <th>Interest</th>
                <th>Monthly Installment</th>
                <th>Approval Rate</th>
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
                    <span className={`badge ${b.verdict.toLowerCase()}`}>
                      {b.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="report-footer">
            This report is a preliminary financial assessment only. Final
            approval is subject to bank credit evaluation and supporting
            documentation. Figures are estimates and do not constitute a loan offer.
          </div>
        </div>
      )}
    </div>
  );
}
