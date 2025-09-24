import React from 'react';
import Card from '../../../Card';

const DaoGovernanceView: React.FC = () => {
    const features = [
        "AI voting trend forecasting",
        "Predictive governance participation scoring",
        "Conversational DAO advisor",
        "AI clustering of member behavior",
        "Generative governance summaries",
        "Smart proposal prioritization",
        "Predictive governance risks",
        "AI anomaly detection in votes",
        "Smart governance token analytics",
        "Conversational DAO Q&A assistant",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">DAO Governance</h2>
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

export default DaoGovernanceView;
