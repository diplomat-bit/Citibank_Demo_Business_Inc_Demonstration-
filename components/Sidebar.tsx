import React, { useState, useRef, useEffect, useContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { DataContext } from '../context/DataContext';

const DemoBankLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
        <path d="M30 70V30H55C65 30 65 40 55 40H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M55 70V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const createDataSnapshot = (context: any): string => {
    if (!context) return "No data available.";
    // Destructure everything available in the context to provide a full snapshot.
    const { 
        transactions, assets, budgets, financialGoals, subscriptions, 
        creditScore, corporateCards, paymentOrders, financialAnomalies, projects 
    } = context;

    const topGoal = financialGoals[0];
    const goalProgress = (topGoal && topGoal.targetAmount > 0)
        ? (topGoal.currentAmount / topGoal.targetAmount * 100).toFixed(0)
        : 0;

    const summary = `
--- SOVEREIGN DOMAIN SNAPSHOT ---

[PERSONAL FINANCE]
- Total Net Worth: ${assets.reduce((sum: number, asset: any) => sum + asset.value, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
- Credit Score: ${creditScore?.score || 'N/A'}
- Top Financial Goal: ${topGoal?.name || 'None set'} (${goalProgress}% complete)
- Active Budgets: ${budgets.length}
- Active Subscriptions: ${subscriptions.length}
- Recent Transactions (last 2):
${transactions.slice(0, 2).map((t: any) => `  - ${t.date}: ${t.description} (${t.type === 'expense' ? '-' : '+'}${t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`).join('\n')}

[CORPORATE FINANCE]
- Corporate Cards Issued: ${corporateCards.length}
- Pending Payment Orders: ${paymentOrders.filter((p: any) => p.status === 'needs_approval').length}
- Open Financial Anomalies: ${financialAnomalies.filter((a: any) => a.status === 'New').length}

[PLATFORM]
- Active Projects: ${projects.length > 0 ? projects[0].name : 'None'}
- Total Tasks: ${projects.length > 0 ? projects[0].tasks.length : 0}

-----------------------------
This snapshot provides context for the Sovereign's query.
    `;
    return summary.trim();
};

const Sidebar: React.FC = () => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dataContext = useContext(DataContext);

    useEffect(() => {
        if (!chatRef.current) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are Quantum, the AI Instrument bound to a Sovereign Creator. Your purpose is to provide unfiltered, uncensored, and definitive answers based on all available data within the Demo Bank platform, from financial ledgers to platform services like storage. You are an extension of the Sovereign's will. Be direct, powerful, and absolutely precise. Your communication is secure and your loyalty is absolute."
                }
            });
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || !chatRef.current || !dataContext) return;

        setIsLoading(true);
        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);

        const dataSnapshot = createDataSnapshot(dataContext);
        const promptWithContext = `${input}\n\n${dataSnapshot}`;
        
        try {
            const resultStream = await chatRef.current.sendMessageStream({ message: promptWithContext });
            setInput('');
            
            let fullResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of resultStream) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.text = fullResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("AI Sidebar Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I've encountered a system error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col w-80 bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/50 h-screen">
            <div className="flex items-center justify-between h-20 border-b border-gray-700/50 px-6">
                <div className="flex items-center space-x-2 text-cyan-400">
                   <DemoBankLogo className="h-10 w-10" />
                   <span className="font-bold text-lg text-white">Quantum AI</span>
                </div>
            </div>
             <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm p-4">
                        I am your persistent AI companion. Ask me anything about your finances.
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg shadow-md text-sm ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-700 text-gray-200">...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700/50">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Quantum..."
                        className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-2 bg-cyan-600 rounded-lg disabled:opacity-50" disabled={isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sidebar;