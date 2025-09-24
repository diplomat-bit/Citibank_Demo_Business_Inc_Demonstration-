import React from 'react';
import Card from '../../../Card';

const DisclosuresView: React.FC = () => {
    const features = [
        "AI disclosure compliance checker",
        "Predictive disclosure deadlines",
        "Generative disclosure drafts",
        "Smart redaction AI",
        "AI-driven anomaly detection in filings",
        "Conversational disclosure assistant",
        "Predictive impact of disclosures",
        "Smart disclosure categorization",
        "AI cross-check with regulations",
        "Automated disclosure summaries",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Disclosures</h2>
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

export default DisclosuresView;
