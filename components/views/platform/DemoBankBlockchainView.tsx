// components/views/platform/DemoBankBlockchainView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankBlockchainView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Blockchain Services</h2>
            <Card title="Overview">
                <p className="text-gray-400">Deploy, manage, and scale your decentralized applications on our enterprise-grade blockchain infrastructure.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Node Management"><p>Deploy and monitor dedicated nodes for various protocols (Ethereum, Solana, etc.).</p></Card>
                 <Card title="Smart Contract Registry"><p>Manage and version-control your organization's deployed smart contracts.</p></Card>
                 <Card title="On-Chain Data Indexing"><p>Access high-performance indexed data from public ledgers.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankBlockchainView;
