import React from 'react';
import Card from '../../../Card';

const AccessControlsView: React.FC = () => {
    const features = [
        "AI-driven dynamic role assignment based on activity patterns",
        "Context-aware login approvals (geo, device, network)",
        "Risk-adaptive authentication prompts",
        "Smart MFA orchestration (face, voice, device trust)",
        "Predictive privilege escalation prevention",
        "Auto-expiring access with AI reminders",
        "AI-based dormant account deactivation",
        "Voice AI for access verification",
        "Smart anomaly-based lockouts",
        "Natural language policy creation assistant",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Access Controls</h2>
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

export default AccessControlsView;
