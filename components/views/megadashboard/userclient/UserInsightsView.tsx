import React from 'react';
import Card from '../../../Card';

const UserInsightsView: React.FC = () => {
    const features = [
        "AI clustering of user behavior",
        "Predictive churn detection",
        "Smart personalization engine",
        "Conversational insights assistant",
        "Sentiment analysis on interactions",
        "Predictive engagement scoring",
        "AI usage anomaly alerts",
        "Generative user journey maps",
        "Smart lifetime value prediction",
        "AI segment growth forecasting",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">User Insights</h2>
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

export default UserInsightsView;
