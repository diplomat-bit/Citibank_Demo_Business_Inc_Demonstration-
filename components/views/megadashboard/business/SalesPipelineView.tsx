import React from 'react';
import Card from '../../../Card';

const SalesPipelineView: React.FC = () => {
    const features = [
        "AI deal probability scoring",
        "Predictive sales cycle length",
        "Conversational sales coach",
        "AI lead prioritization",
        "Generative follow-up emails",
        "Smart quota forecasting",
        "Predictive territory optimization",
        "AI-driven competitive win analysis",
        "Conversational pipeline insights",
        "AI anomaly detection in sales data",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sales Pipeline</h2>
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

export default SalesPipelineView;
