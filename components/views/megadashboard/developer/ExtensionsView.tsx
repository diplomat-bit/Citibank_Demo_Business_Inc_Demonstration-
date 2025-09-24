import React from 'react';
import Card from '../../../Card';

const ExtensionsView: React.FC = () => {
    const features = [
        "AI extension store recommendations",
        "Predictive extension lifecycle scoring",
        "Smart dependency checks",
        "Conversational extension builder",
        "AI code snippet suggestions",
        "Auto security scanning of extensions",
        "Predictive popularity ranking",
        "Smart compatibility alerts",
        "AI clustering of extension usage",
        "Generative extension documentation",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Extensions</h2>
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

export default ExtensionsView;
