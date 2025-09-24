import React from 'react';
import Card from '../../../Card';

const MarketingAutomationView: React.FC = () => {
    const features = [
        "AI content personalization engine",
        "Predictive campaign performance scoring",
        "Conversational campaign builder",
        "Generative ad creatives",
        "AI lead nurturing optimizer",
        "Predictive ad spend allocation",
        "Smart channel optimization",
        "AI-driven brand voice generator",
        "Conversational marketing insights",
        "Predictive customer journey mapping",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Marketing Automation</h2>
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

export default MarketingAutomationView;
