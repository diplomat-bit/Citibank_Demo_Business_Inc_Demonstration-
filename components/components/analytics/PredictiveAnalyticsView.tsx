// components/components/analytics/PredictiveAnalyticsView.tsx
// ARCHITECTURAL BLUEPRINT: This file provides a specialized view offering AI-driven financial forecasts,
// cash flow predictions, and advanced trend analysis beyond historical data.
// It leverages Plato's Intelligence Suite for proactive financial guidance.

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { FlowMatrixTransaction, FinancialGoal, AIRecommendation } from '../../TransactionsView';
import { AITransactionWidget } from '../../TransactionsView';
import { Type } from "@google/genai";

// ================================================================================================
// PREDICTIVE ANALYTICS DATA TYPES AND INTERFACES
// ================================================================================================

/**
 * @description Represents a monthly or quarterly cash flow projection.
 */
export interface CashFlowProjectionItem {
    period: string; // e.g., "July 2024", "Q3 2024"
    estimatedIncome: number;
    estimatedExpenses: number;
    netCashFlow: number;
    keyDrivers: string[];
}

/**
 * @description Schema for AI-generated cash flow projections.
 */
export const cashFlowProjectionSchema = {
    type: Type.OBJECT,
    properties: {
        projections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    period: { type: Type.STRING },
                    estimatedIncome: { type: Type.NUMBER },
                    estimatedExpenses: { type: Type.NUMBER },
                    netCashFlow: { type: Type.NUMBER },
                    keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['period', 'estimatedIncome', 'estimatedExpenses', 'netCashFlow', 'keyDrivers']
            }
        },
        summary: { type: Type.STRING }
    },
    required: ['projections', 'summary']
};


/**
 * @description Represents a monthly or quarterly net worth projection.
 */
export interface NetWorthProjectionItem {
    period: string; // e.g., "July 2024", "Q3 2024"
    estimatedNetWorth: number;
    assetGrowthDrivers: string[];
    liabilityReductionDrivers: string[];
}

/**
 * @description Schema for AI-generated net worth projections.
 */
export const netWorthProjectionSchema = {
    type: Type.OBJECT,
    properties: {
        projections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    period: { type: Type.STRING },
                    estimatedNetWorth: { type: Type.NUMBER },
                    assetGrowthDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    liabilityReductionDrivers: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['period', 'estimatedNetWorth']
            }
        },
        summary: { type: Type.STRING }
    },
    required: ['projections', 'summary']
};

/**
 * @description Result of a "What If" scenario analysis.
 */
export interface WhatIfScenarioResult {
    scenarioDescription: string;
    impactSummary: string;
    projectedCashFlowChange: number; // e.g., -500 (monthly avg change)
    affectedGoals: Array<{
        goalId: string;
        goalName: string;
        impact: 'positive' | 'negative' | 'neutral';
        details: string;
    }>;
    recommendations: string[];
}

/**
 * @description Schema for AI-generated "What If" scenario analysis.
 */
export const whatIfScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        scenarioDescription: { type: Type.STRING },
        impactSummary: { type: Type.STRING },
        projectedCashFlowChange: { type: Type.NUMBER },
        affectedGoals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    goalId: { type: Type.STRING },
                    goalName: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                    details: { type: Type.STRING }
                },
                required: ['goalId', 'goalName', 'impact', 'details']
            }
        },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['scenarioDescription', 'impactSummary', 'projectedCashFlowChange', 'affectedGoals', 'recommendations']
};

/**
 * @description Represents a potential future financial risk or warning.
 */
export interface FinancialWarning {
    type: 'budget_overrun' | 'cash_flow_shortfall' | 'goal_at_risk' | 'unusual_expense_predicted' | 'debt_increase_risk';
    description: string;
    estimatedTiming: string; // e.g., "Next 2 months", "Q3 2024"
    severity: 'low' | 'medium' | 'high';
    suggestedActions: string[];
}

/**
 * @description Schema for AI-generated financial warnings.
 */
export const financialWarningSchema = {
    type: Type.OBJECT,
    properties: {
        warnings: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['budget_overrun', 'cash_flow_shortfall', 'goal_at_risk', 'unusual_expense_predicted', 'debt_increase_risk'] },
                    description: { type: Type.STRING },
                    estimatedTiming: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                    suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['type', 'description', 'estimatedTiming', 'severity', 'suggestedActions']
            }
        }
    },
    required: ['warnings']
};

/**
 * @description A component to visualize projections (reusing TrendAnalysisChart pattern).
 */
const ProjectionChart: React.FC<{ data: { label: string; value: number; }[]; title: string; valuePrefix?: string }> = ({ data, title, valuePrefix = '$' }) => {
    const maxVal = Math.max(...data.map(d => Math.abs(d.value)));
    if (data.length === 0) {
        return (
            <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col items-center justify-center">
                <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
                <p className="text-gray-500 text-xs">No projection data available.</p>
            </div>
        );
    }
    return (
        <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700/50 h-full flex flex-col">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">{title}</h4>
            <div className="flex-grow flex items-end h-32 p-2 bg-gray-800 rounded-md relative overflow-hidden">
                <div className="absolute w-full h-px bg-gray-600 top-1/2 left-0 right-0"></div> {/* Zero line */}
                {data.map((item, index) => (
                    <div key={index} className="flex-grow flex flex-col items-center mx-0.5 relative z-10">
                        <div
                            className={`w-4 rounded-t-sm ${item.value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{
                                height: `${(Math.abs(item.value) / maxVal) * 90}%`, // 90% to leave room for labels
                                // Position bars relative to the zero line
                                bottom: item.value >= 0 ? '50%' : 'auto',
                                top: item.value < 0 ? '50%' : 'auto',
                            }}
                            title={`${item.label}: ${valuePrefix}${item.value.toFixed(2)}`}
                        ></div>
                        <span className="text-gray-500 text-xxs mt-1 absolute bottom-0">{item.label}</span>
                    </div>
                ))}
            </div>
            <p className="text-gray-400 text-xs mt-2 text-center">AI-projected {title.toLowerCase()}</p>
        </div>
    );
};

// ================================================================================================
// MAIN PREDICTIVE ANALYTICS VIEW
// ================================================================================================
export const PredictiveAnalyticsView: React.FC = () => {
    const context = useContext(DataContext);
    const [scenarioInput, setScenarioInput] = useState<string>('');
    const [whatIfResult, setWhatIfResult] = useState<WhatIfScenarioResult | null>(null);
    const [isLoadingScenario, setIsLoadingScenario] = useState(false);
    const [scenarioError, setScenarioError] = useState('');

    if (!context) {
        throw new Error("PredictiveAnalyticsView must be within a DataProvider");
    }
    const { transactions, budgets, goals } = context;

    // Helper to format currency
    const formatAmount = useCallback((amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
    }, []);

    // Function to trigger "What If" scenario analysis
    const runWhatIfScenario = useCallback(async () => {
        if (!scenarioInput.trim()) {
            setScenarioError('Please enter a scenario to analyze.');
            return;
        }
        if (!process.env.NEXT_PUBLIC_API_KEY) {
            setScenarioError('Plato AI API key is not configured.');
            return;
        }

        setIsLoadingScenario(true);
        setScenarioError('');
        setWhatIfResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY as string });

            const transactionSummary = transactions.slice(0, 50).map(t =>
                `${t.date} - ${t.description} (${t.category}): ${t.type === 'income' ? '+' : '-'}${t.currency}${t.amount.toFixed(2)}`
            ).join('\n');

            const goalSummary = goals ? goals.map(g =>
                `${g.name}: Target ${g.targetAmount}, Current ${g.currentAmount}, Progress ${g.progressPercentage.toFixed(1)}%`
            ).join('\n') : 'No financial goals set.';

            const fullPrompt = `Analyze the following hypothetical financial scenario against the user's historical transactions and current financial goals. Describe the potential impact on their cash flow and financial goals over the next 6-12 months. Focus on key changes and actionable insights, and provide concrete recommendations. Return a JSON object matching the 'whatIfScenarioSchema'.\n\nUser Scenario: ${scenarioInput}\n\nRecent Transactions:\n${transactionSummary}\n\nFinancial Goals:\n${goalSummary}`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-pro',
                contents: [{ text: fullPrompt }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 2048,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ],
                responseMimeType: "application/json",
                responseSchema: whatIfScenarioSchema,
            });

            const textResult = response.text.trim();
            // The API response might wrap JSON in ```json\n...\n``` or similar, so parse carefully
            let parsedResult;
            try {
                parsedResult = JSON.parse(textResult.replace(/```json\n|```/g, '').trim());
            } catch (jsonError) {
                console.error("Failed to parse AI response as JSON:", jsonError, "Raw response:", textResult);
                throw new Error("AI returned an unparseable response.");
            }
            setWhatIfResult(parsedResult as WhatIfScenarioResult);

        } catch (err) {
            console.error('Error running What If scenario:', err);
            setScenarioError(`Plato AI could not analyze the scenario: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoadingScenario(false);
        }
    }, [scenarioInput, transactions, goals]);


    // Mock data for charts if AI widgets don't auto-generate or for initial display
    const mockCashFlowData = useMemo(() => [
        { label: 'Jul', value: 500 }, { label: 'Aug', value: 750 }, { label: 'Sep', value: 300 },
        { label: 'Oct', value: 600 }, { label: 'Nov', value: 800 }, { label: 'Dec', value: -100 } // Example of negative cash flow
    ], []);

    const mockNetWorthData = useMemo(() => [
        { label: 'Jul', value: 50000 }, { label: 'Aug', value: 50500 }, { label: 'Sep', value: 50800 },
        { label: 'Oct', value: 51400 }, { label: 'Nov', value: 52200 }, { label: 'Dec', value: 52100 }
    ], []);

    return (
        <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-white tracking-wider mb-8 drop-shadow-lg">Plato's Oracle: Predictive Analytics</h2>

            {/* Cash Flow Projections */}
            <Card title="Cash Flow Forecast (Next 6 Months)" isCollapsible>
                <AITransactionWidget
                    title="Detailed Monthly Cash Flow"
                    prompt="Predict the user's cash flow for the next 6 months based on their historical transactions, recurring income, and expenses. Provide monthly breakdowns of estimated income, expenses, and net cash flow. Assume the user's base currency is USD."
                    transactions={transactions}
                    responseSchema={cashFlowProjectionSchema}
                    model="gemini-1.5-pro"
                    autoGenerate={true}
                >
                    {(result: { projections: CashFlowProjectionItem[], summary: string }) => (
                        <div className="text-xs text-gray-300 space-y-2 p-2 max-h-48 overflow-y-auto">
                            <p className="italic text-gray-400">{result.summary}</p>
                            <ul className="list-disc list-inside">
                                {result.projections.map((proj, idx) => (
                                    <li key={idx}>
                                        <span className="font-semibold">{proj.period}:</span> Income {formatAmount(proj.estimatedIncome)}, Expenses {formatAmount(proj.estimatedExpenses)}, Net {formatAmount(proj.netCashFlow)}
                                        <span className="block text-gray-500 text-xxs ml-4">Drivers: {proj.keyDrivers.join(', ')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AITransactionWidget>
                <div className="mt-4">
                    {/* Placeholder for actual chart rendering from AI data */}
                    <ProjectionChart title="Projected Net Cash Flow" data={mockCashFlowData} />
                </div>
            </Card>

            {/* Net Worth Projections */}
            <Card title="Net Worth Trajectory (Next 12 Months)" isCollapsible>
                <AITransactionWidget
                    title="Estimated Net Worth Growth"
                    prompt="Estimate the user's net worth trajectory for the next 12 months, considering their current assets (e.g., bank balance, known investments), liabilities (e.g., debts, recurring payments), and projected savings/spending habits. Provide monthly net worth figures. Assume the user's base currency is USD."
                    transactions={transactions}
                    responseSchema={netWorthProjectionSchema}
                    model="gemini-1.5-pro"
                    autoGenerate={true}
                    contextualData={{ currentBankBalance: '15000', totalDebts: '8000', knownInvestments: '25000' }} // Mock current state
                >
                    {(result: { projections: NetWorthProjectionItem[], summary: string }) => (
                        <div className="text-xs text-gray-300 space-y-2 p-2 max-h-48 overflow-y-auto">
                            <p className="italic text-gray-400">{result.summary}</p>
                            <ul className="list-disc list-inside">
                                {result.projections.map((proj, idx) => (
                                    <li key={idx}>
                                        <span className="font-semibold">{proj.period}:</span> Estimated Net Worth {formatAmount(proj.estimatedNetWorth)}
                                        <span className="block text-gray-500 text-xxs ml-4">Assets: {proj.assetGrowthDrivers.join(', ')} / Liabilities: {proj.liabilityReductionDrivers.join(', ')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AITransactionWidget>
                <div className="mt-4">
                    {/* Placeholder for actual chart rendering from AI data */}
                    <ProjectionChart title="Projected Net Worth" data={mockNetWorthData} />
                </div>
            </Card>

            {/* "What If" Scenario Planner */}
            <Card title="What If? Scenario Planner" isCollapsible>
                <p className="text-gray-400 text-sm mb-3">Ask Plato AI to analyze hypothetical financial changes and predict their impact.</p>
                <div className="flex flex-col gap-3">
                    <textarea
                        value={scenarioInput}
                        onChange={(e) => setScenarioInput(e.target.value)}
                        placeholder="e.g., 'What if I save an extra $200 per month?', 'What if I take a loan of $10,000 for a car at 5% interest?', 'What if my salary increases by 10% next quarter?'"
                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 min-h-[80px]"
                    />
                    <button
                        onClick={runWhatIfScenario}
                        disabled={isLoadingScenario || !scenarioInput.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingScenario ? 'Analyzing Scenario...' : 'Run Scenario Analysis'}
                    </button>
                </div>

                {scenarioError && <p className="text-red-400 text-xs mt-3">{scenarioError}</p>}

                {whatIfResult && (
                    <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3">
                        <h5 className="font-semibold text-cyan-300 text-base">Scenario: {whatIfResult.scenarioDescription}</h5>
                        <p className="text-gray-300 text-sm">{whatIfResult.impactSummary}</p>
                        <p className="text-gray-400 text-sm">
                            Projected Monthly Cash Flow Change: <span className={whatIfResult.projectedCashFlowChange >= 0 ? 'text-green-400' : 'text-red-400'}>{formatAmount(whatIfResult.projectedCashFlowChange)}</span>
                        </p>
                        <div>
                            <p className="font-semibold text-gray-300 text-sm">Affected Goals:</p>
                            <ul className="list-disc list-inside text-xs text-gray-400">
                                {whatIfResult.affectedGoals.map(goal => (
                                    <li key={goal.goalId}>
                                        <span className={`font-semibold ${goal.impact === 'positive' ? 'text-green-400' : goal.impact === 'negative' ? 'text-red-400' : 'text-gray-400'}`}>{goal.goalName}</span>: {goal.details}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-300 text-sm">Recommendations:</p>
                            <ul className="list-disc list-inside text-xs text-gray-400">
                                {whatIfResult.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </Card>

            {/* Early Financial Warning System */}
            <Card title="Plato AI Early Warning System" isCollapsible>
                <AITransactionWidget
                    title="Potential Future Risks"
                    prompt="Based on historical spending, income patterns, and known recurring expenses, identify any potential future financial risks or challenges in the next 3-6 months. Examples: risk of overspending in a category, approaching a budget limit, potential cash flow crunch, missed goal targets, increasing debt. Provide the nature of the risk, its estimated timing, its severity, and suggested preventative actions. Assume the user's base currency is USD."
                    transactions={transactions}
                    responseSchema={financialWarningSchema}
                    model="gemini-1.5-pro"
                    autoGenerate={true}
                    contextualData={{ currentBudgets: budgets, currentGoals: goals }} // Pass relevant data
                >
                    {(result: { warnings: FinancialWarning[] }) => (
                        <div className="text-xs text-gray-300 space-y-2 p-2 max-h-48 overflow-y-auto">
                            {result.warnings.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {result.warnings.map((warning, idx) => (
                                        <li key={idx} className="mb-2">
                                            <span className={`font-semibold ${warning.severity === 'high' ? 'text-red-400' : warning.severity === 'medium' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                                {warning.type.replace(/_/g, ' ')} ({warning.severity})
                                            </span> - {warning.description} <span className="text-gray-500">({warning.estimatedTiming})</span>
                                            <ul className="list-disc list-inside ml-4 text-gray-500">
                                                {warning.suggestedActions.map((action, aidx) => <li key={aidx}>{action}</li>)}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>No significant future financial risks detected by Plato AI for the next 3-6 months. Keep up the great work!</p>}
                        </div>
                    )}
                </AITransactionWidget>
            </Card>

            {/* Advanced Goal Attainment Probability (Conceptual Widget) */}
            <Card title="Goal Attainment Probability (Advanced)" isCollapsible>
                 <AITransactionWidget
                    title="Goal Projections & Optimizations"
                    prompt="Analyze the user's current financial goals and provide an updated probability of achieving each goal, estimated time to achievement, and tailored recommendations to optimize their progress. Consider their current spending, income, and any linked categories. Assume the user's base currency is USD."
                    transactions={transactions}
                    responseSchema={{
                        type: Type.OBJECT,
                        properties: {
                            goalsAnalysis: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        goalName: { type: Type.STRING },
                                        currentProgress: { type: Type.NUMBER }, // %
                                        probability: { type: Type.NUMBER }, // %
                                        estimatedCompletionDate: { type: Type.STRING },
                                        optimizations: { type: Type.ARRAY, items: { type: Type.STRING } }
                                    },
                                    required: ['goalName', 'currentProgress', 'probability', 'estimatedCompletionDate', 'optimizations']
                                }
                            }
                        },
                        required: ['goalsAnalysis']
                    }}
                    model="gemini-1.5-pro"
                    autoGenerate={true}
                    contextualData={{ financialGoals: goals }} // Pass user's goals
                >
                    {(result: { goalsAnalysis: Array<{ goalName: string; currentProgress: number; probability: number; estimatedCompletionDate: string; optimizations: string[]; }> }) => (
                        <div className="text-xs text-gray-300 space-y-2 p-2 max-h-48 overflow-y-auto">
                            {result.goalsAnalysis.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {result.goalsAnalysis.map((goal, idx) => (
                                        <li key={idx} className="mb-2">
                                            <span className="font-semibold text-green-400">{goal.goalName}:</span>
                                            <p className="ml-4">Current Progress: {goal.currentProgress.toFixed(1)}%</p>
                                            <p className="ml-4">Probability of Achievement: <span className={goal.probability > 75 ? 'text-green-300' : goal.probability > 50 ? 'text-yellow-300' : 'text-red-300'}>{goal.probability.toFixed(1)}%</span></p>
                                            <p className="ml-4">Est. Completion: {goal.estimatedCompletionDate}</p>
                                            <p className="ml-4 font-semibold text-gray-400">Optimizations:</p>
                                            <ul className="list-disc list-inside ml-8 text-gray-500">
                                                {goal.optimizations.map((opt, oidx) => <li key={oidx}>{opt}</li>)}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>No financial goals to analyze. Consider setting some goals to get started!</p>}
                        </div>
                    )}
                </AITransactionWidget>
            </Card>

        </div>
    );
};

export default PredictiveAnalyticsView;