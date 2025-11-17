import React, { useState, useContext, useEffect } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface KPI {
  name: string;
  category: string;
  baselineValue: number;
  projectedValue: number;
  unit: string;
  changePercentage: number;
  severity: 'low' | 'medium' | 'high' | 'neutral' | 'critical';
  description: string;
}

interface TimeSeriesPoint {
  month: number;
  netWorth: number;
  savingsBalance: number;
  debtBalance: number;
  investmentValue: number;
  discretionaryCash: number;
  emergencyFundCoverage: number;
}

interface SimulationRequest {
  prompt: string;
  parameters: {
    durationMonths: number;
    amountUSD: number;
  };
  currentFinancialState: {
    totalAssets: number;
    totalLiabilities: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    emergencyFund: number;
    savingsGoals: { name: string; target: number; current: number }[];
    investmentAccounts: { name: string; value: number; type: string }[];
    debtAccounts: { name: string; balance: number; monthlyPayment: number; interestRate: number }[];
    creditScore: number;
    age: number;
    employmentStatus: string;
    riskTolerance: string;
  };
}

interface SimulationResponse {
  simulationId: string;
  narrativeSummary: string;
  shortTermOutlook: string;
  longTermProjections: string;
  keyImpacts: {
    metric: string;
    value: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  recommendations: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  kpis: KPI[];
  projectedTimeSeries: TimeSeriesPoint[];
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_FALLBACK');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const ImpactSeverityIndicator: React.FC<{ severity: 'low' | 'medium' | 'high' | 'neutral' | 'critical' }> = ({ severity }) => {
    let colorsClass;
    switch (severity) {
        case 'low':
            colorsClass = 'bg-green-500';
            break;
        case 'medium':
            colorsClass = 'bg-yellow-500';
            break;
        case 'high':
            colorsClass = 'bg-orange-500';
            break;
        case 'critical':
            colorsClass = 'bg-red-600';
            break;
        case 'neutral':
        default:
            colorsClass = 'bg-gray-500';
            break;
    }
    return <div className={`w-3 h-3 rounded-full ${colorsClass}`} title={`Severity: ${severity}`}></div>;
};

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const isPositiveChange = kpi.changePercentage >= 0;
    const changeColorClass = kpi.changePercentage === 0 ? 'text-gray-400' : isPositiveChange ? 'text-green-400' : 'text-red-400';
    const changeArrow = kpi.changePercentage === 0 ? '↔︎' : isPositiveChange ? '↑' : '↓';
    const unitDisplay = kpi.unit === '$' ? '$' : kpi.unit === '%' ? '%' : kpi.unit;

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-md flex items-center gap-2">
                    <ImpactSeverityIndicator severity={kpi.severity} />
                    {kpi.name}
                </h4>
                <span className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded-full">{kpi.category}</span>
            </div>
            <p className="text-gray-300 text-sm h-12 overflow-hidden line-clamp-2">{kpi.description}</p>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-700">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Baseline</div>
                    <div className="text-white text-md font-mono">
                        {unitDisplay}{kpi.unit === '%' ? (kpi.baselineValue * 100).toFixed(1) : kpi.baselineValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Projected</div>
                    <div className="text-cyan-400 text-lg font-bold font-mono">
                        {unitDisplay}{kpi.unit === '%' ? (kpi.projectedValue * 100).toFixed(1) : kpi.projectedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div className={`text-sm flex items-center ${changeColorClass} font-mono gap-1`}>
                    {changeArrow} {Math.abs(kpi.changePercentage * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    );
};

const QuantumOracleView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState("What if I experience a recession and my freelance income drops by 50% for 6 months, and I need to buy a new car for $25,000?");
    const [duration, setDuration] = useState(12);
    const [amount, setAmount] = useState(-25000);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResponse | null>(null);

    const defaultUserData = {
      totalAssets: 150000,
      totalLiabilities: 75000,
      monthlyIncome: 6000,
      monthlyExpenses: 4500,
      emergencyFund: 12000,
      savingsGoals: [
        { name: "Condo Down Payment", target: 50000, current: 15000 },
        { name: "Retirement Early", target: 1000000, current: 50000 }
      ],
      investmentAccounts: [
        { name: "Roth IRA", value: 30000, type: "Retirement" },
        { name: "Brokerage", value: 20000, type: "General" }
      ],
      debtAccounts: [
        { name: "Mortgage", balance: 200000, monthlyPayment: 1200, interestRate: 3.5 },
        { name: "Student Loan", balance: 15000, monthlyPayment: 150, interestRate: 4.0 },
        { name: "Credit Card", balance: 2500, monthlyPayment: 75, interestRate: 18.0 }
      ],
      creditScore: 720,
      age: 35,
      employmentStatus: "Freelance/Contractor",
      riskTolerance: "Moderate",
    };
    const financialStateForGemini = context?.userData || defaultUserData;

    const generateGeminiPrompt = (request: SimulationRequest) => `
You are an advanced financial oracle AI, named "Quantum Oracle", capable of performing complex simulations and providing highly detailed, actionable insights for personal finance. Your analysis should be comprehensive, covering a wide array of financial metrics and projections.

Your task is to analyze a hypothetical financial scenario for a user and provide a comprehensive, structured JSON response.

Here is the user's current detailed financial situation:
- Total Assets: $${request.currentFinancialState.totalAssets}
- Total Liabilities: $${request.currentFinancialState.totalLiabilities}
- Monthly Income: $${request.currentFinancialState.monthlyIncome}
- Monthly Expenses: $${request.currentFinancialState.monthlyExpenses}
- Emergency Fund: $${request.currentFinancialState.emergencyFund}
- Savings Goals: ${JSON.stringify(request.currentFinancialState.savingsGoals)}
- Investment Accounts: ${JSON.stringify(request.currentFinancialState.investmentAccounts)}
- Debt Accounts: ${JSON.stringify(request.currentFinancialState.debtAccounts)}
- Credit Score: ${request.currentFinancialState.creditScore}
- Age: ${request.currentFinancialState.age}
- Employment Status: ${request.currentFinancialState.employmentStatus}
- Risk Tolerance: ${request.currentFinancialState.riskTolerance}

The user's hypothetical scenario: "${request.prompt}"
The simulation duration is ${request.parameters.durationMonths} months.
There is a specific financial event impact of $${request.parameters.amountUSD} USD (positive for bonus/income, negative for cost/expense).

Please provide a JSON object structured exactly as follows, containing a rich narrative, 50 diverse KPIs, detailed multi-series time-series data, and strategic recommendations. Ensure all values are numeric where applicable. Percentages should be represented as decimals (e.g., -0.15 for -15% change). All dollar values should be raw numbers, not strings with symbols.

\`\`\`json
{
  "simulationId": "sim_${Date.now()}",
  "narrativeSummary": "A compelling and detailed story outlining the overall impact, trajectory, and key turning points of the simulation.",
  "shortTermOutlook": "A focused, actionable analysis of the financial situation for the first 1-3 months, highlighting immediate challenges and opportunities.",
  "longTermProjections": "A comprehensive analysis of the financial situation beyond 3 months, up to the full duration, discussing long-term trends, goal impacts, and potential future states.",
  "keyImpacts": [
    { "metric": "Emergency Fund Depletion Risk", "value": "Very High, within 3 months", "severity": "critical" },
    { "metric": "Condo Down Payment Delay", "value": "+18 months", "severity": "high" },
    { "metric": "Credit Score Drop", "value": "-50 points projected", "severity": "medium" },
    { "metric": "Debt Accumulation", "value": "+$15,000", "severity": "high" },
    { "metric": "Investment Growth Halting", "value": "Stagnant for 12 months", "severity": "medium" }
  ],
  "recommendations": [
    { "title": "Immediate Spending Freeze", "description": "Implement a strict zero-based budget. Cut all non-essential discretionary spending (e.g., dining out, entertainment, subscriptions) for at least the next 3 months to preserve liquidity.", "priority": "high" },
    { "title": "Income Augmentation Strategy", "description": "Actively pursue short-term freelance gigs, contract work, or consider a temporary part-time job to supplement income. Prioritize opportunities that can be quickly acquired and executed.", "priority": "high" },
    { "title": "Debt Prioritization and Negotiation", "description": "Review all high-interest debts (e.g., credit cards). Consider negotiating with creditors for lower interest rates or temporary payment deferrals. Focus on minimum payments for lower interest debts.", "priority": "medium" },
    { "title": "Emergency Fund Rebuilding Plan", "description": "Once income stabilizes, aggressively funnel any extra funds into rebuilding the emergency fund to cover at least 3-6 months of essential expenses. This will provide a critical safety net.", "priority": "high" },
    { "title": "Re-evaluate Long-Term Goals", "description": "Assess the feasibility of existing long-term goals (e.g., condo down payment, early retirement) in light of the new projections. Adjust timelines or contribution strategies as necessary to maintain realism.", "priority": "low" }
  ],
  "kpis": [
    { "name": "Monthly Net Income", "category": "Income", "baselineValue": 3500, "projectedValue": 2500, "unit": "$", "changePercentage": -0.285, "severity": "high", "description": "The average monthly income available after taxes and recurring deductions." },
    { "name": "Emergency Fund Runway", "category": "Savings", "baselineValue": 2.6, "projectedValue": 0.8, "unit": "months", "changePercentage": -0.69, "severity": "critical", "description": "Number of months essential expenses can be covered by the emergency fund." },
    { "name": "Total Liquid Net Worth", "category": "Net Worth", "baselineValue": 75000, "projectedValue": 60000, "unit": "$", "changePercentage": -0.20, "severity": "high", "description": "Total assets easily convertible to cash minus short-term liabilities." },
    { "name": "Debt-to-Income Ratio", "category": "Debt", "baselineValue": 0.35, "projectedValue": 0.55, "unit": "%", "changePercentage": 0.57, "severity": "high", "description": "Ratio of total monthly debt payments to gross monthly income." },
    { "name": "Investment Portfolio Value", "category": "Investments", "baselineValue": 50000, "projectedValue": 48000, "unit": "$", "changePercentage": -0.04, "severity": "medium", "description": "The current market value of all investment accounts." },
    { "name": "Savings Rate", "category": "Savings", "baselineValue": 0.15, "projectedValue": 0.05, "unit": "%", "changePercentage": -0.66, "severity": "high", "description": "Percentage of net income allocated to savings and investments." },
    { "name": "Credit Utilization Ratio", "category": "Debt", "baselineValue": 0.20, "projectedValue": 0.45, "unit": "%", "changePercentage": 1.25, "severity": "high", "description": "Amount of credit used relative to total available credit." },
    { "name": "Housing Cost to Income Ratio", "category": "Expenses", "baselineValue": 0.25, "projectedValue": 0.35, "unit": "%", "changePercentage": 0.40, "severity": "medium", "description": "Percentage of gross income spent on housing expenses." },
    { "name": "Discretionary Spending Ratio", "category": "Expenses", "baselineValue": 0.30, "projectedValue": 0.15, "unit": "%", "changePercentage": -0.50, "severity": "low", "description": "Percentage of net income spent on non-essential items." },
    { "name": "Time to Achieve Primary Savings Goal", "category": "Goals", "baselineValue": 36, "projectedValue": 54, "unit": "months", "changePercentage": 0.50, "severity": "high", "description": "Estimated time remaining to reach the largest savings goal." },
    { "name": "Retirement Account Growth Rate", "category": "Investments", "baselineValue": 0.08, "projectedValue": 0.02, "unit": "%", "changePercentage": -0.75, "severity": "high", "description": "Annualized growth rate of retirement investments." },
    { "name": "Net Worth Growth Trajectory", "category": "Net Worth", "baselineValue": 0.05, "projectedValue": -0.02, "unit": "%", "changePercentage": -1.40, "severity": "critical", "description": "Projected annual percentage change in total net worth." },
    { "name": "Interest Paid on Debt (Annualized)", "category": "Debt", "baselineValue": 3500, "projectedValue": 4800, "unit": "$", "changePercentage": 0.37, "severity": "high", "description": "Total estimated interest paid on all debts over a year." },
    { "name": "Diversification Index (Investments)", "category": "Investments", "baselineValue": 0.75, "projectedValue": 0.70, "unit": "score", "changePercentage": -0.06, "severity": "neutral", "description": "A measure of how well diversified the investment portfolio is." },
    { "name": "Income Stability Index", "category": "Income", "baselineValue": 0.80, "projectedValue": 0.40, "unit": "score", "changePercentage": -0.50, "severity": "critical", "description": "Assesses the predictability and reliability of income sources." },
    { "name": "Financial Stress Level", "category": "Risk", "baselineValue": 3, "projectedValue": 8, "unit": "score (1-10)", "changePercentage": 1.66, "severity": "critical", "description": "A subjective score indicating the level of financial worry and pressure." },
    { "name": "Monthly Cash Flow", "category": "Income", "baselineValue": 1500, "projectedValue": -500, "unit": "$", "changePercentage": -1.33, "severity": "critical", "description": "Income minus expenses each month." },
    { "name": "Debt Repayment Velocity", "category": "Debt", "baselineValue": 0.02, "projectedValue": 0.005, "unit": "factor", "changePercentage": -0.75, "severity": "high", "description": "Rate at which total debt is being reduced." },
    { "name": "Investment Contribution Ability", "category": "Investments", "baselineValue": 500, "projectedValue": 0, "unit": "$/month", "changePercentage": -1.00, "severity": "critical", "description": "Amount of money available to contribute to investments monthly." },
    { "name": "Savings Goal Attainment Probability", "category": "Goals", "baselineValue": 0.70, "projectedValue": 0.30, "unit": "%", "changePercentage": -0.57, "severity": "high", "description": "The estimated likelihood of achieving all current savings goals." },
    { "name": "Credit Score Impact", "category": "Risk", "baselineValue": 720, "projectedValue": 670, "unit": "points", "changePercentage": -0.07, "severity": "medium", "description": "Projected change in FICO credit score." },
    { "name": "Cost of Living Buffer", "category": "Expenses", "baselineValue": 0.10, "projectedValue": -0.05, "unit": "% of income", "changePercentage": -1.50, "severity": "critical", "description": "Percentage of income remaining after essential expenses and savings goals are met." },
    { "name": "Path to Financial Independence", "category": "Goals", "baselineValue": 25, "projectedValue": 40, "unit": "years", "changePercentage": 0.60, "severity": "high", "description": "Estimated years remaining until financial independence." },
    { "name": "Asset-to-Liability Ratio", "category": "Net Worth", "baselineValue": 2.0, "projectedValue": 1.5, "unit": "ratio", "changePercentage": -0.25, "severity": "medium", "description": "Total assets divided by total liabilities." },
    { "name": "Discretionary Income Available", "category": "Income", "baselineValue": 1500, "projectedValue": 200, "unit": "$/month", "changePercentage": -0.86, "severity": "high", "description": "Income remaining after all necessary expenses and savings contributions." },
    { "name": "Investment Portfolio Volatility", "category": "Risk", "baselineValue": 0.12, "projectedValue": 0.18, "unit": "%", "changePercentage": 0.50, "severity": "medium", "description": "A measure of how much the investment portfolio value fluctuates." },
    { "name": "Passive Income Contribution", "category": "Income", "baselineValue": 100, "projectedValue": 50, "unit": "$/month", "changePercentage": -0.50, "severity": "low", "description": "Amount of income generated from passive sources like investments or rentals." },
    { "name": "Education Savings Progress", "category": "Goals", "baselineValue": 0.30, "projectedValue": 0.25, "unit": "%", "changePercentage": -0.16, "severity": "neutral", "description": "Progress towards any child education savings goals." },
    { "name": "Insurance Coverage Adequacy", "category": "Risk", "baselineValue": 0.90, "projectedValue": 0.80, "unit": "score (0-1)", "changePercentage": -0.11, "severity": "low", "description": "A measure of whether current insurance policies provide sufficient coverage." },
    { "name": "Student Loan Debt Burden", "category": "Debt", "baselineValue": 15000, "projectedValue": 14500, "unit": "$", "changePercentage": -0.03, "severity": "neutral", "description": "Total outstanding student loan balance." },
    { "name": "Home Equity Growth Rate", "category": "Investments", "baselineValue": 0.03, "projectedValue": 0.01, "unit": "%", "changePercentage": -0.66, "severity": "low", "description": "Annualized growth rate of home equity." },
    { "name": "Retirement Contribution Rate", "category": "Savings", "baselineValue": 0.10, "projectedValue": 0.05, "unit": "% of income", "changePercentage": -0.50, "severity": "high", "description": "Percentage of gross income contributed to retirement accounts." },
    { "name": "Emergency Fund Replenishment Time", "category": "Savings", "baselineValue": 6, "projectedValue": 18, "unit": "months", "changePercentage": 2.00, "severity": "critical", "description": "Estimated time to fully replenish the emergency fund if depleted." },
    { "name": "Job Security Impact", "category": "Risk", "baselineValue": 0.70, "projectedValue": 0.50, "unit": "score (0-1)", "changePercentage": -0.28, "severity": "high", "description": "Perceived or actual stability of primary income source." },
    { "name": "Luxury Spending Reduction Potential", "category": "Expenses", "baselineValue": 0.20, "projectedValue": 0.50, "unit": "%", "changePercentage": 1.50, "severity": "low", "description": "Percentage of current luxury spending that can realistically be cut." },
    { "name": "Financial Goal Buffer", "category": "Goals", "baselineValue": 0.15, "projectedValue": 0.05, "unit": "%", "changePercentage": -0.66, "severity": "high", "description": "Percentage of buffer in current financial plans for unforeseen events." },
    { "name": "Mortgage Payment to Income", "category": "Expenses", "baselineValue": 0.20, "projectedValue": 0.25, "unit": "%", "changePercentage": 0.25, "severity": "medium", "description": "Percentage of gross income dedicated to mortgage payments." },
    { "name": "Total Debt Service Ratio", "category": "Debt", "baselineValue": 0.18, "projectedValue": 0.28, "unit": "%", "changePercentage": 0.55, "severity": "high", "description": "Total monthly debt payments as a percentage of gross monthly income." },
    { "name": "Investment Realized Gains/Losses", "category": "Investments", "baselineValue": 500, "projectedValue": -1000, "unit": "$", "changePercentage": -3.00, "severity": "high", "description": "Net gains or losses from investment sales." },
    { "name": "Wealth Accumulation Rate", "category": "Net Worth", "baselineValue": 0.07, "projectedValue": 0.01, "unit": "%", "changePercentage": -0.85, "severity": "critical", "description": "Annual rate at which total wealth is increasing." },
    { "name": "Budget Adherence Score", "category": "Expenses", "baselineValue": 0.85, "projectedValue": 0.60, "unit": "score (0-1)", "changePercentage": -0.29, "severity": "medium", "description": "A measure of how closely spending aligns with budgeted amounts." },
    { "name": "Dependence on Primary Income", "category": "Risk", "baselineValue": 0.90, "projectedValue": 0.95, "unit": "%", "changePercentage": 0.05, "severity": "low", "description": "Percentage of total income derived from a single primary source." },
    { "name": "Time to Pay Off Non-Mortgage Debt", "category": "Debt", "baselineValue": 60, "projectedValue": 96, "unit": "months", "changePercentage": 0.60, "severity": "high", "description": "Estimated time to clear all consumer and student loan debt." },
    { "name": "Potential for Income Diversification", "category": "Income", "baselineValue": 0.20, "projectedValue": 0.40, "unit": "score (0-1)", "changePercentage": 1.00, "severity": "low", "description": "Potential to add new income streams to reduce reliance on primary source." },
    { "name": "Long-Term Care Readiness", "category": "Risk", "baselineValue": 0.60, "projectedValue": 0.50, "unit": "score (0-1)", "changePercentage": -0.16, "severity": "neutral", "description": "Assessment of preparedness for potential future long-term care costs." },
    { "name": "Inheritance Impact on Net Worth", "category": "Net Worth", "baselineValue": 0, "projectedValue": 0, "unit": "$", "changePercentage": 0, "severity": "neutral", "description": "Projected impact of expected inheritance on overall net worth (if applicable)." },
    { "name": "Financial Literacy Score", "category": "Lifestyle", "baselineValue": 0.70, "projectedValue": 0.75, "unit": "score (0-1)", "changePercentage": 0.07, "severity": "low", "description": "Subjective score representing understanding of personal finance principles." },
    { "name": "Monthly Investment Yield", "category": "Investments", "baselineValue": 0.005, "projectedValue": 0.002, "unit": "%", "changePercentage": -0.60, "severity": "medium", "description": "Average monthly return on investment portfolio." },
    { "name": "Wealth Generation Capacity", "category": "Net Worth", "baselineValue": 0.04, "projectedValue": 0.01, "unit": "ratio", "changePercentage": -0.75, "severity": "high", "description": "The rate at which new wealth is being created from all sources." },
    { "name": "Cost of Debt (Weighted Average)", "category": "Debt", "baselineValue": 0.07, "projectedValue": 0.09, "unit": "%", "changePercentage": 0.28, "severity": "medium", "description": "Weighted average interest rate across all outstanding debts." },
    { "name": "Charitable Giving Capacity", "category": "Lifestyle", "baselineValue": 200, "projectedValue": 0, "unit": "$/month", "changePercentage": -1.00, "severity": "high", "description": "Amount of discretionary income available for charitable donations." },
    { "name": "Financial Legacy Potential", "category": "Goals", "baselineValue": 0.50, "projectedValue": 0.20, "unit": "score (0-1)", "changePercentage": -0.60, "severity": "high", "description": "The likelihood of leaving a substantial financial legacy." },
    { "name": "Quality of Life Index (Financial)", "category": "Lifestyle", "baselineValue": 0.70, "projectedValue": 0.40, "unit": "score (0-1)", "changePercentage": -0.42, "severity": "high", "description": "A subjective measure of well-being directly tied to financial health." }
  ],
  "projectedTimeSeries": [
    { "month": 0, "netWorth": ${request.currentFinancialState.totalAssets - request.currentFinancialState.totalLiabilities}, "savingsBalance": ${request.currentFinancialState.emergencyFund + (request.currentFinancialState.savingsGoals.reduce((acc, goal) => acc + goal.current, 0))}, "debtBalance": ${request.currentFinancialState.totalLiabilities}, "investmentValue": ${request.currentFinancialState.investmentAccounts.reduce((acc, inv) => acc + inv.value, 0)}, "discretionaryCash": ${request.currentFinancialState.monthlyIncome - request.currentFinancialState.monthlyExpenses}, "emergencyFundCoverage": ${request.currentFinancialState.emergencyFund / request.currentFinancialState.monthlyExpenses} }
    // The Gemini model will fill in subsequent months based on the prompt.
    // Ensure all projected values dynamically change based on the scenario.
  ]
}
\`\`\`

Generate realistic numerical values and narrative based on the prompt and current financial state. The number of recommendations should be between 5-10. The key impacts should be 3-7. The projectedTimeSeries should have entries for each month up to the duration.
`;

    const handleSimulate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            setError("Gemini API Key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
            setIsLoading(false);
            return;
        }

        try {
            const requestBody: SimulationRequest = {
                prompt,
                parameters: { durationMonths: duration, amountUSD: amount },
                currentFinancialState: financialStateForGemini
            };

            const fullPrompt = generateGeminiPrompt(requestBody);

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (!jsonMatch || jsonMatch.length < 2) {
                console.error("Gemini response did not contain a valid JSON block:", text);
                throw new Error("Failed to parse Gemini's response. Expected a JSON block.");
            }

            let parsedResponse: SimulationResponse;
            try {
                parsedResponse = JSON.parse(jsonMatch[1]);
            } catch (jsonError: any) {
                console.error("JSON parsing error:", jsonError, "Raw text:", jsonMatch[1]);
                throw new Error("Failed to parse Gemini's JSON output: " + jsonError.message);
            }

            // Basic validation for parsedResponse structure
            if (!parsedResponse.kpis || parsedResponse.kpis.length === 0 || !parsedResponse.projectedTimeSeries) {
                throw new Error("Gemini response is missing critical data (KPIs or Time Series).");
            }
            
            // Ensure projectedTimeSeries always starts from month 0 and covers the duration
            // This is a safety measure if Gemini doesn't always provide month 0 or fills all months
            const finalProjectedTimeSeries = parsedResponse.projectedTimeSeries.length > 0 ? parsedResponse.projectedTimeSeries : [
                { month: 0, netWorth: financialStateForGemini.totalAssets - financialStateForGemini.totalLiabilities, savingsBalance: financialStateForGemini.emergencyFund, debtBalance: financialStateForGemini.totalLiabilities, investmentValue: financialStateForGemini.investmentAccounts.reduce((sum, inv) => sum + inv.value, 0), discretionaryCash: financialStateForGemini.monthlyIncome - financialStateForGemini.monthlyExpenses, emergencyFundCoverage: financialStateForGemini.emergencyFund / financialStateForGemini.monthlyExpenses }
            ];
            for (let i = 1; i <= duration; i++) {
                if (!finalProjectedTimeSeries.find(p => p.month === i)) {
                    const lastPoint = finalProjectedTimeSeries[finalProjectedTimeSeries.length - 1];
                    finalProjectedTimeSeries.push({ ...lastPoint, month: i });
                }
            }
            parsedResponse.projectedTimeSeries = finalProjectedTimeSeries.sort((a, b) => a.month - b.month);


            setResult(parsedResponse);

        } catch (e: any) {
            console.error("Simulation error:", e);
            setError(e.message || "An unknown error occurred during the simulation. Please check your prompt and API key.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white text-center tracking-tight leading-tight">Quantum Oracle: Your Future, Unveiled</h1>
            <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">Leveraging advanced AI to simulate complex financial scenarios and deliver unparalleled strategic foresight.</p>

            <Card title="Simulate Your Financial Future" className="bg-gray-900/60 border border-gray-700 shadow-xl">
                <p className="text-sm text-gray-400 mb-6">Describe a hypothetical scenario you're curious about. The Quantum Oracle will utilize a comprehensive model of your financial state to simulate the outcome, providing in-depth analysis and strategic recommendations.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                    placeholder="e.g., 'What if I get a $10,000 bonus next month and save it all?' or 'What if I lose my job for 3 months and my investments drop by 15%?'"
                    disabled={isLoading}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div>
                        <label htmlFor="duration-slider" className="block text-md font-medium text-gray-300 mb-2">Simulation Duration</label>
                        <input
                            id="duration-slider"
                            type="range"
                            min="1"
                            max="60"
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
                            disabled={isLoading}
                        />
                        <div className="text-center font-mono text-cyan-300 text-sm mt-1">{duration} months</div>
                    </div>
                     <div>
                        <label htmlFor="amount-input" className="block text-md font-medium text-gray-300 mb-2">Event Impact Amount (USD)</label>
                        <input
                            id="amount-input"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full bg-gray-700/50 border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                            placeholder="e.g., 10000 for a bonus, -5000 for an unexpected cost"
                            disabled={isLoading}
                        />
                         <p className="text-xs text-gray-500 mt-1 text-center">Positive for income/bonus, negative for expense/cost.</p>
                    </div>
                </div>
                 <button onClick={handleSimulate} disabled={isLoading || !prompt.trim()} className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exploring Timelines...
                        </div>
                    ) : 'Run Quantum Simulation'}
                </button>
            </Card>

            {isLoading && <Card><div className="text-center p-12 text-white text-xl flex items-center justify-center space-x-3">
                <svg className="animate-pulse h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-1-3m-6.964-14.964A12 12 0 0121.24 10.35M7.429 7.429a12.012 12.012 0 00-3.321 3.96M2 12h-.01M12 2v.01M19 12h.01M12 22v.01M6.429 19.571a12.012 12.012 0 003.96 3.321M17.571 4.429a12.012 12.012 0 00-3.96-3.321M21.24 13.65a12 12 0 01-18.48 0"/></svg>
                <span>Analyzing vast data streams and projecting future states...</span>
                </div></Card>}
            {error && <Card><p className="text-red-400 p-6 text-center text-lg">{error}</p></Card>}

            {result && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card title="Simulation Narrative" className="lg:col-span-3">
                            <p className="italic text-gray-300 leading-relaxed text-lg mb-4">"{result.narrativeSummary}"</p>
                            <h3 className="font-semibold text-xl text-white mb-2 border-b border-gray-700 pb-2">Short-Term Outlook (1-3 Months)</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">{result.shortTermOutlook}</p>
                            <h3 className="font-semibold text-xl text-white mb-2 border-b border-gray-700 pb-2">Long-Term Projections (3+ Months)</h3>
                            <p className="text-gray-400 leading-relaxed">{result.longTermProjections}</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Key Strategic Impacts">
                            <ul className="space-y-4">
                                {result.keyImpacts.map((impact, index) => (
                                    <li key={index} className="flex items-start p-3 bg-gray-800/60 rounded-lg border border-gray-700">
                                        <div className="flex-shrink-0 mt-1 mr-3">
                                            <ImpactSeverityIndicator severity={impact.severity} />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white text-md">{impact.metric}: </span>
                                            <span className="text-gray-300 text-sm">{impact.value}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card title="AI Strategic Recommendations">
                            <div className="space-y-4">
                                {result.recommendations.map((rec, index) => (
                                    <div key={index} className="p-4 bg-gray-800/60 rounded-lg border-l-4 border-cyan-500 shadow-md">
                                        <h4 className="font-bold text-white text-md flex items-center justify-between">
                                            {rec.title}
                                            <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                                                rec.priority === 'high' ? 'bg-red-800 text-red-100' :
                                                rec.priority === 'medium' ? 'bg-yellow-800 text-yellow-100' :
                                                'bg-green-800 text-green-100'
                                            }`}>
                                                {rec.priority.toUpperCase()}
                                            </span>
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{rec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Card title="Projected Financial Trajectories" className="bg-gray-900/60 border border-gray-700 shadow-xl">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={result.projectedTimeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#9ca3af" unit="m" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(tick) => `$${(tick / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.5}/>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#4b5563', borderRadius: '8px', padding: '10px' }}
                                    labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#d1d5db' }}
                                    formatter={(value: number, name: string) => [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, name]}
                                />
                                <Legend wrapperStyle={{ color: '#e5e7eb', fontSize: '12px', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="netWorth" stackId="1" stroke="#8884d8" fill="url(#colorNetWorth)" name="Net Worth" />
                                <Area type="monotone" dataKey="savingsBalance" stackId="1" stroke="#82ca9d" fill="url(#colorSavings)" name="Savings" />
                                <Area type="monotone" dataKey="investmentValue" stackId="1" stroke="#fbbf24" fill="url(#colorInvestments)" name="Investments" />
                                <Area type="monotone" dataKey="debtBalance" stackId="1" stroke="#ef4444" fill="url(#colorDebt)" name="Total Debt" />
                            </AreaChart>
                        </ResponsiveContainer>
                         <div className="mt-6 text-gray-400 text-sm italic text-center">
                            Note: Stacking areas may not accurately represent individual balances if they decrease. Each line represents its total value.
                        </div>
                    </Card>

                    <Card title="Key Performance Indicators (KPIs)" className="bg-gray-900/60 border border-gray-700 shadow-xl">
                        <p className="text-gray-400 text-sm mb-6">A comprehensive overview of 50 critical financial health metrics, comparing baseline values against projected outcomes.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {result.kpis.map((kpi, index) => (
                                <KPICard key={index} kpi={kpi} />
                            ))}
                        </div>
                    </Card>
                </div>
            )}
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default QuantumOracleView;