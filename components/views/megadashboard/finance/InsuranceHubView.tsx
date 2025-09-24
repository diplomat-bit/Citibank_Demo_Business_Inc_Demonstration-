import React from 'react';
import Card from '../../../Card';

const InsuranceHubView: React.FC = () => {
    const features = [
        "AI claims fraud detection",
        "Automated claims adjudication",
        "Smart premium personalization",
        "Predictive risk scoring",
        "Generative insurance policy documents",
        "Conversational claims assistant",
        "AI health/life risk modeler",
        "Disaster risk prediction",
        "Dynamic coverage recommendations",
        "Claim payout forecasting",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Insurance Hub</h2>
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

export default InsuranceHubView;
