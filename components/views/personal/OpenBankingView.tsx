// components/views/personal/OpenBankingView.tsx
import React, { useState } from 'react';
import Card from '../../Card';

const MOCK_CONNECTIONS = [
    { id: 1, name: 'MintFusion Budgeting', permissions: ['Read transaction history', 'View account balances'], icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
    { id: 2, name: 'TaxBot Pro', permissions: ['Read transaction history', 'Access income statements'], icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const OpenBankingView: React.FC = () => {
    const [connections, setConnections] = useState(MOCK_CONNECTIONS);

    const handleRevoke = (id: number) => {
        setConnections(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Open Banking Connections</h2>
            <Card>
                <p className="text-gray-400 mb-6">You are in control of your data. Here you can see which third-party applications have access to your Demo Bank data and manage their permissions.</p>
                <div className="space-y-4">
                    {connections.map(conn => (
                        <div key={conn.id} className="p-4 bg-gray-800/50 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-300 flex-shrink-0 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={conn.icon} /></svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{conn.name}</h4>
                                    <ul className="text-xs text-gray-400 list-disc list-inside mt-1">
                                        {conn.permissions.map(p => <li key={p}>{p}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <button onClick={() => handleRevoke(conn.id)} className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs w-full sm:w-auto">Revoke Access</button>
                        </div>
                    ))}
                    {connections.length === 0 && <p className="text-gray-500 text-center py-8">You have not connected any third-party applications.</p>}
                </div>
            </Card>
        </div>
    );
};

export default OpenBankingView;
