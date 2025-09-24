import React from 'react';
import Card from '../../../Card';

const ConsentManagementView: React.FC = () => {
    const features = [
        "AI consent clustering by risk",
        "Predictive consent expiry alerts",
        "Conversational consent assistant",
        "Smart consent categorization",
        "AI anomaly detection in consent data",
        "Generative privacy policy alignment",
        "Predictive consent conflicts",
        "AI-driven audit reports",
        "Conversational user consent Q&A",
        "Automated consent lifecycle tracking",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Consent Management</h2>
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

export default ConsentManagementView;
