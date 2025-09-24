import React from 'react';
import Card from '../../../Card';

const SmartContractsView: React.FC = () => {
    const features = [
        "AI smart contract code auditor",
        "Predictive gas fee forecasting",
        "Conversational contract builder",
        "AI-driven auto bug patching",
        "Smart compliance validation",
        "Generative contract documentation",
        "AI exploit simulation",
        "Predictive contract usage clustering",
        "Conversational debugging assistant",
        "AI-driven contract upgrade suggestions",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Smart Contracts</h2>
            <Card title="AI-Powered Features">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default SmartContractsView;
