import React from 'react';
import Card from '../../../Card';

const LicensingView: React.FC = () => {
    const features = [
        "AI license requirement detection",
        "Predictive renewal reminders",
        "Conversational license compliance assistant",
        "Smart license type recommendations",
        "AI license fraud detection",
        "Auto document validation",
        "Generative license agreements",
        "Predictive cost optimization of licenses",
        "AI usage monitoring vs. license limits",
        "Conversational license Q&A",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Licensing</h2>
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

export default LicensingView;
