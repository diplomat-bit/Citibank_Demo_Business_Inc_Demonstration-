// components/views/personal/FinancialGoalsView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { FinancialGoal } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

const FinancialGoalsView: React.FC = () => {
    type GoalView = 'LIST' | 'CREATE' | 'VIEW_PLAN';
    const [currentView, setCurrentView] = useState<GoalView>('LIST');
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
    const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);

    const context = useContext(DataContext);
    if (!context) throw new Error("FinancialGoalsView must be within a DataProvider.");
    const { financialGoals, addFinancialGoal, generateGoalPlan } = context;

    const GOAL_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
        home: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
        car: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        education: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>,
        ring: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11a3.03 3.03 0 01-3.022 3.022A3.03 3.03 0 015 11a3.03 3.03 0 013-3.022A3.03 3.03 0 0111 11zM11 5a6.06 6.06 0 00-6.043 6.043A6.06 6.06 0 0011 17.086 6.06 6.06 0 0017.043 11 6.06 6.06 0 0011 5zm5.121 1.879l-1.414 1.414" /></svg>,
        default: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    };

    const handleGeneratePlan = async (goalId: string) => {
        setLoadingGoalId(goalId);
        await generateGoalPlan(goalId);
        setLoadingGoalId(null);
    };

    const GoalCard: React.FC<{ goal: FinancialGoal }> = ({ goal }) => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        const Icon = GOAL_ICONS[goal.iconName] || GOAL_ICONS.default;
        return (
            <Card className="flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-start justify-between"><h3 className="text-xl font-semibold text-white">{goal.name}</h3><div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-300"><Icon className="w-6 h-6" /></div></div>
                    <p className="text-sm text-gray-400 mt-2">Target Date: {goal.targetDate}</p>
                    <div className="mt-4"><div className="flex justify-between text-sm font-mono text-gray-300 mb-1"><span>${goal.currentAmount.toLocaleString()}</span><span>${goal.targetAmount.toLocaleString()}</span></div><div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div><p className="text-right text-xs text-gray-400 mt-1">{progress.toFixed(0)}% Complete</p></div>
                </div>
                <div className="mt-6">
                    {goal.plan ? (<button onClick={() => { setSelectedGoal(goal); setCurrentView('VIEW_PLAN'); }} className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-200 rounded-lg text-sm">View Plan</button>) : (<button onClick={() => handleGeneratePlan(goal.id)} disabled={loadingGoalId === goal.id} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm disabled:opacity-50">{loadingGoalId === goal.id ? 'Generating...' : 'Generate AI Plan'}</button>)}
                </div>
            </Card>
        );
    };

    const CreateGoalView: React.FC = () => {
        const [name, setName] = useState('');
        const [targetAmount, setTargetAmount] = useState('');
        const [targetDate, setTargetDate] = useState('');
        const [iconName, setIconName] = useState('default');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            addFinancialGoal({ name, targetAmount: parseFloat(targetAmount), targetDate, iconName });
            setCurrentView('LIST');
        };

        return (
            <div>
                 <button onClick={() => setCurrentView('LIST')} className="flex items-center text-sm text-cyan-300 hover:text-cyan-200 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
                <Card title="Create a New Financial Goal">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-300">