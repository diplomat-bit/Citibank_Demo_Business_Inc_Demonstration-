import React from 'react';
import Card from '../../../Card';

const CompetitiveIntelligenceView: React.FC = () => {
    const features = [
        "AI competitor trend detection",
        "Predictive competitor pricing shifts",
        "Conversational CI assistant",
        "Smart competitor SWOT generation",
        "AI-driven product gap analysis",
        "Generative competitor reports",
        "Predictive market share changes",
        "AI anomaly detection in competitor data",
        "Conversational benchmarking insights",
        "Smart alerting on competitor news",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Competitive Intelligence</h2>
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

export default CompetitiveIntelligenceView;
