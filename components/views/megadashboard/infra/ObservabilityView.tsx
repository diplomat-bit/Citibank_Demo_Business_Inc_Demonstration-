import React from 'react';
import Card from '../../../Card';

const ObservabilityView: React.FC = () => {
    const features = [
        "AI anomaly detection across logs",
        "Predictive downtime alerts",
        "Conversational observability bot",
        "Smart tracing recommendations",
        "AI-driven root cause analysis",
        "Predictive performance degradation",
        "Generative observability reports",
        "Auto metric correlation engine",
        "Smart error prioritization",
        "Conversational health dashboards",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Observability</h2>
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

export default ObservabilityView;
