import React from 'react';
import Card from '../../../Card';

const RoleManagementView: React.FC = () => {
    const features = [
        "AI clustering of similar roles",
        "Least-privilege optimization suggestions",
        "Role drift detection",
        "Auto-suggested roles for new hires",
        "Predictive role needs mapping",
        "AI visualization of overlapping permissions",
        "Auto-deprecated unused roles",
        "Behavior-based role alignment",
        "AI audit chatbot for permissions",
        "Generative summaries of role risks",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Role Management</h2>
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

export default RoleManagementView;
