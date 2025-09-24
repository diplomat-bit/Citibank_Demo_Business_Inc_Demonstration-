import React from 'react';
import Card from '../../../Card';

const BackupRecoveryView: React.FC = () => {
    const features = [
        "AI-driven backup scheduling",
        "Predictive recovery time estimation",
        "Conversational backup assistant",
        "Smart anomaly detection in backups",
        "Auto test restore simulations",
        "Generative recovery documentation",
        "Predictive storage cost optimization",
        "Smart compliance enforcement",
        "AI-driven backup tiering",
        "Conversational recovery Q&A",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Backup & Recovery</h2>
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

export default BackupRecoveryView;
