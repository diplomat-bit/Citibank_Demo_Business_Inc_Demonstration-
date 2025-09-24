import React from 'react';
import Card from '../../../Card';

const AuditLogsView: React.FC = () => {
    const features = [
        "AI anomaly summarization",
        "Predictive breach indicators",
        "Natural language log querying",
        "Automated compliance briefings",
        "Suspicious event clustering",
        "AI cause-effect chain visualization",
        "Smart log volume scaling",
        "Conversational log exploration",
        "AI correlation with external incidents",
        "Risk-prioritized log tagging",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Audit Logs</h2>
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

export default AuditLogsView;
