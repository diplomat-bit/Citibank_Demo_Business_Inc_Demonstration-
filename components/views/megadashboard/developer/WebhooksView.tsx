import React from 'react';
import Card from '../../../Card';

const WebhooksView: React.FC = () => {
    const features = [
        "AI webhook reliability scoring",
        "Predictive latency alerts",
        "Smart retry policies",
        "Conversational webhook query assistant",
        "AI anomaly detection in payloads",
        "Auto-suggested webhook integrations",
        "Predictive webhook scaling",
        "Smart webhook orchestration",
        "AI-driven failure clustering",
        "Generative webhook test payloads",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Webhooks</h2>
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

export default WebhooksView;
