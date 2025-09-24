import React from 'react';
import Card from '../../../Card';

const ContainerRegistryView: React.FC = () => {
    const features = [
        "AI vulnerability scanning",
        "Predictive image popularity",
        "Conversational container assistant",
        "Smart image dependency mapping",
        "AI anomaly detection in builds",
        "Auto cleanup of unused images",
        "Predictive scaling recommendations",
        "Generative Dockerfile optimization",
        "Smart compliance tagging",
        "Conversational container usage insights",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Container Registry</h2>
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

export default ContainerRegistryView;
