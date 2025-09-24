import React from 'react';
import Card from '../../../Card';

const SupportDeskView: React.FC = () => {
    const features = [
        "AI ticket categorization",
        "Smart SLA breach prediction",
        "Generative canned responses",
        "Conversational troubleshooting bot",
        "Predictive escalation alerts",
        "AI duplicate ticket merging",
        "Sentiment scoring of support chats",
        "AI root cause detection",
        "Predictive customer satisfaction scoring",
        "AI-driven support knowledge base updates",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Support Desk</h2>
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

export default SupportDeskView;
