import React from 'react';
import Card from '../../../Card';

const PartnerHubView: React.FC = () => {
    const features = [
        "AI partner scoring engine",
        "Predictive partnership opportunities",
        "Conversational partner insights",
        "Smart collaboration recommendations",
        "AI-driven partner risk analysis",
        "Auto contract review summaries",
        "Predictive partner churn alerts",
        "AI partner clustering visualization",
        "Generative partner performance reports",
        "Smart partner matching",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Partner Hub</h2>
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

export default PartnerHubView;
