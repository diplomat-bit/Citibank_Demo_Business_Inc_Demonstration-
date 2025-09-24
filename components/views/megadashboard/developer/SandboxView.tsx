import React from 'react';
import Card from '../../../Card';

const SandboxView: React.FC = () => {
    const features = [
        "AI auto-setup of dev environments",
        "Predictive traffic simulation",
        "Conversational sandbox assistant",
        "AI test data generation",
        "Behavior-driven mock APIs",
        "AI-guided API testing",
        "Smart error simulation",
        "Predictive environment scaling",
        "Automated sandbox cleanup",
        "AI-driven access rules",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sandbox</h2>
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

export default SandboxView;
