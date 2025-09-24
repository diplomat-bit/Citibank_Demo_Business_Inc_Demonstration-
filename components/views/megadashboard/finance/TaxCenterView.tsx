import React from 'react';
import Card from '../../../Card';

const TaxCenterView: React.FC = () => {
    const features = [
        "AI receipt categorization",
        "Predictive tax liability calculator",
        "AI audit risk detection",
        "Automated filing assistant",
        "Smart deduction finder",
        "AI natural language tax Q&A",
        "Tax anomaly alerts",
        "Predictive quarterly payment reminders",
        "Generative tax reports",
        "Compliance gap analysis",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Tax Center</h2>
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

export default TaxCenterView;
