import React from 'react';
import Card from '../../../Card';

const RegulatorySandboxView: React.FC = () => {
    const features = [
        "AI predictive compliance tests",
        "Conversational regulatory assistant",
        "Smart mock audit generator",
        "Predictive approval timelines",
        "AI anomaly detection in submissions",
        "Automated compliance gap checks",
        "Generative regulatory reports",
        "Predictive regulation change alerts",
        "Conversational sandbox walkthroughs",
        "Smart audit readiness scoring",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Regulatory Sandbox</h2>
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

export default RegulatorySandboxView;
