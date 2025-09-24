import React from 'react';
import Card from '../../../Card';

const CliToolsView: React.FC = () => {
    const features = [
        "AI autocomplete for CLI commands",
        "Conversational CLI assistant",
        "Predictive error correction",
        "AI usage pattern clustering",
        "Smart CLI onboarding guide",
        "AI context-based command recommendations",
        "CLI logs anomaly detection",
        "Predictive CLI feature updates",
        "Auto-summarized CLI usage reports",
        "Generative CLI tutorials",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">CLI Tools</h2>
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

export default CliToolsView;
