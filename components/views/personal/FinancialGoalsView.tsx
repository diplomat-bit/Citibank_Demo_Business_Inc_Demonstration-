// components/views/personal/FinancialGoalsView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { FinancialGoal } from '../../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GOAL_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    home: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    car: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    education: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>,
    default: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
};


const FinancialGoalsView: React.FC = () => {
    type GoalView = 'LIST' | 'CREATE' | 'VIEW_PLAN';
    const [currentView, setCurrentView] = useState<GoalView>('LIST');
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
    const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);

    const context = useContext(DataContext);
    if (!context) throw new Error("FinancialGoalsView must be within a DataProvider.");
    const { financialGoals, addFinancialGoal, generateGoalPlan } = context;

    const handleGeneratePlan = async (goalId: string) => {
        setLoadingGoalId(goalId);
        await generateGoalPlan(goalId);
        const updatedGoal = context.financialGoals.find(g => g.id === goalId);
        if (updatedGoal) setSelectedGoal(updatedGoal);
        setLoadingGoalId(null);
    };
    
    const GoalListView: React.FC = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Financial Goals</h2>
                <button onClick={() => setCurrentView('CREATE')} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Create New Goal</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {financialGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
            </div>
        </div>
    );
    
    const GoalCard: React.FC<{ goal: FinancialGoal }> = ({ goal }) => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        const Icon = GOAL_ICONS[goal.iconName] || GOAL_ICONS.default;
        return (
            <Card className="flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-start justify-between"><h3 className="text-xl font-semibold text-white">{goal.name}</h3><div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-300 flex-shrink-0"><Icon className="w-6 h-6" /></div></div>
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
                <button onClick={() => setCurrentView('LIST')} className="flex items-center text-sm text-cyan-300 hover:text-cyan-200 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back to Goals</button>
                <Card title="Create a New Financial Goal">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div><label className="block text-sm font-medium text-gray-300">What is your goal?</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Down Payment for a Cyber-Loft" required className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                        <div><label className="block text-sm font-medium text-gray-300">How much do you need to save?</label><input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="e.g., 75000" required className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                        <div><label className="block text-sm font-medium text-gray-300">What's your target date?</label><input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                        <div><label className="block text-sm font-medium text-gray-300">Choose a symbol for your goal</label><div className="mt-2 grid grid-cols-6 gap-2">{Object.entries(GOAL_ICONS).map(([key, Icon]) => (<button type="button" key={key} onClick={() => setIconName(key)} className={`flex items-center justify-center p-3 rounded-lg transition-colors ${iconName === key ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : 'bg-gray-700/50 hover:bg-gray-700'}`}><Icon className="h-6 w-6 text-cyan-300" /></button>))}</div></div>
                        <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Create Goal</button>
                    </form>
                </Card>
            </div>
        );
    };

    const ViewPlanView: React.FC = () => {
        const [completedSteps, setCompletedSteps] = useState<number[]>([]);
        if (!selectedGoal || !selectedGoal.plan) return null;

        const plan = selectedGoal.plan;
        const categoryColors: {[key: string]: string} = { Savings: 'border-cyan-500', Budgeting: 'border-indigo-500', Investing: 'border-yellow-500', Income: 'border-green-500' };

        const projectionData = useMemo(() => {
            const data = [{ year: 'Now', value: selectedGoal.currentAmount }];
            let futureValue = selectedGoal.currentAmount;
            const years = new Date(selectedGoal.targetDate).getFullYear() - new Date().getFullYear();
            for (let i = 1; i <= years; i++) {
                futureValue += plan.monthlyContribution * 12;
                data.push({ year: `Year ${i}`, value: futureValue });
            }
            return data;
        }, [selectedGoal]);


        return (
            <div>
                 <button onClick={() => setCurrentView('LIST')} className="flex items-center text-sm text-cyan-300 hover:text-cyan-200 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back to Goals</button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <Card title="Goal Projection">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs><linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                    <XAxis dataKey="year" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" tickFormatter={(tick) => `$${(tick / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#colorGoal)" name="Projected Savings" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                    <Card title={`AI Plan for: ${selectedGoal.name}`}>
                        <div className="p-4 bg-gray-900/50 rounded-lg mb-6">
                            <p className="font-semibold text-cyan-300">AI Feasibility Summary:</p>
                            <p className="text-sm text-gray-300 italic">"{plan.feasibilitySummary}"</p>
                            <p className="mt-3 text-center"><span className="text-gray-400">Recommended Monthly Contribution:</span> <span className="font-bold text-2xl text-white">${plan.monthlyContribution.toLocaleString()}</span></p>
                        </div>
                    </Card>
                     <Card title="Your Action Plan">
                        <div className="space-y-4">
                            {plan.steps.map((step, index) => (
                                <div key={index} className={`p-4 rounded-lg flex items-start gap-4 bg-gray-800/50 border-l-4 ${categoryColors[step.category]}`}>
                                    <input type="checkbox" checked={completedSteps.includes(index)} onChange={() => setCompletedSteps(p => p.includes(index) ? p.filter(i=>i!==index) : [...p, index])} className="mt-1 h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                                    <div><h5 className={`font-semibold text-white ${completedSteps.includes(index) ? 'line-through text-gray-500' : ''}`}>{step.title}</h5><p className={`text-sm text-gray-400 ${completedSteps.includes(index) ? 'line-through' : ''}`}>{step.description}</p></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (currentView) {
            case 'LIST': return <GoalListView />;
            case 'CREATE': return <CreateGoalView />;
            case 'VIEW_PLAN': return <ViewPlanView />;
            default: return <GoalListView />;
        }
    };

    return <div className="animate-fade-in">{renderContent()}</div>;
};

export default FinancialGoalsView;