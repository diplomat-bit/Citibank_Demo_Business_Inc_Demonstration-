import React from 'react';
import Card from '../../../Card';

const IncidentResponseView: React.FC = () => {
    const features = [
        "AI incident prioritization",
        "Predictive outage forecasting",
        "Conversational incident assistant",
        "Smart root cause detection",
        "AI-driven response playbooks",
        "Predictive incident escalation alerts",
        "Generative incident reports",
        "Auto incident clustering",
        "Conversational recovery guide",
        "AI-based SLA impact scoring",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Incident Response</h2>
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

export default IncidentResponseView;
