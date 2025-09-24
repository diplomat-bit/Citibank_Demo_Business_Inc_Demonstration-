import React from 'react';
import Card from '../../../Card';

const ClientOnboardingView: React.FC = () => {
    const features = [
        "AI ID verification",
        "Predictive onboarding flow optimization",
        "Conversational onboarding assistant",
        "Smart form pre-filling",
        "AI fraud checks on documents",
        "Generative onboarding tutorials",
        "Behavior-based KYC scoring",
        "AI-driven success probability prediction",
        "Onboarding friction detection",
        "Smart compliance enforcement",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Client Onboarding</h2>
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

export default ClientOnboardingView;
