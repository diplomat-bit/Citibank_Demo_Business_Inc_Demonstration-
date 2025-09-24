import React from 'react';
import Card from '../../../Card';

const ThreatIntelligenceView: React.FC = () => {
    const features = [
        "AI global threat trend forecasting",
        "Automated attack surface scans",
        "AI clustering of malware strains",
        "Patch prioritization with ML",
        "Generative red-team simulations",
        "Dark web threat feed enrichment",
        "Contextual AI risk scoring",
        "Automated adversary scenario creation",
        "Predictive zero-day detection",
        "AI threat summary reports",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Threat Intelligence</h2>
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

export default ThreatIntelligenceView;
