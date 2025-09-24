import React from 'react';
import Card from '../../../Card';

const PredictiveModelsView: React.FC = () => {
    const features = [
        "Automated model training pipelines",
        "AI-optimized hyperparameters",
        "Bias detection in models",
        "Generative model documentation",
        "Auto-suggested feature engineering",
        "AI-based model explainability",
        "Predictive drift monitoring",
        "Conversational model testing",
        "AI ensemble blending",
        "Outcome probability forecasting",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Predictive Models</h2>
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

export default PredictiveModelsView;
