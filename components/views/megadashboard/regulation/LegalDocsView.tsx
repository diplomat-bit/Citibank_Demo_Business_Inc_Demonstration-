import React from 'react';
import Card from '../../../Card';

const LegalDocsView: React.FC = () => {
    const features = [
        "AI contract clause detection",
        "Smart contract drafting assistant",
        "Predictive litigation risk scoring",
        "Conversational legal doc Q&A",
        "Generative NDA / agreement templates",
        "AI anomaly detection in clauses",
        "Predictive compliance risks",
        "AI-driven legal doc clustering",
        "Smart contract lifecycle tracking",
        "Auto multilingual translations",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Legal Docs</h2>
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

export default LegalDocsView;
