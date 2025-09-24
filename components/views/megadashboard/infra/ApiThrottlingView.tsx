import React from 'react';
import Card from '../../../Card';

const ApiThrottlingView: React.FC = () => {
    const features = [
        "AI adaptive rate limits",
        "Predictive traffic spike alerts",
        "Conversational API assistant",
        "Smart quota optimization",
        "AI anomaly detection in API usage",
        "Predictive DDoS attack alerts",
        "Auto scaling rate-limit rules",
        "Generative API usage reports",
        "Smart SLA breach prevention",
        "Conversational quota insights",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">API Throttling</h2>
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

export default ApiThrottlingView;
