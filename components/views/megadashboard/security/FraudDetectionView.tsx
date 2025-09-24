import React from 'react';
import Card from '../../../Card';

const FraudDetectionView: React.FC = () => {
    const features = [
        "Real-time AI anomaly detection in payments",
        "AI behavioral fingerprinting per user",
        "Synthetic identity detection",
        "AI correlation across devices/channels",
        "Generative fraud playbook drafting",
        "Predictive fraud scoring engine",
        "Network analysis for fraud rings",
        "AI-driven false-positive suppression",
        "Conversational fraud alerting",
        "Fraud simulation with synthetic data",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Fraud Detection</h2>
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

export default FraudDetectionView;
