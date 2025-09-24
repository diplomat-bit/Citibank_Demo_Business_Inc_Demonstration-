import React from 'react';
import Card from '../../../Card';

const CardManagementView: React.FC = () => {
    const features = [
        "AI spend categorization",
        "Smart fraud prevention alerts",
        "Dynamic card limit recommendations",
        "AI-driven freeze/unfreeze triggers",
        "Personalized card perks suggestions",
        "Predictive recurring payment reminders",
        "AI budgeting linked to card usage",
        "Smart dispute assistant",
        "AI virtual card creation automation",
        "Card replacement prediction",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Card Management</h2>
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

export default CardManagementView;
