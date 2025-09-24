import React from 'react';
import Card from '../../../Card';

const FeedbackHubView: React.FC = () => {
    const features = [
        "AI clustering of feedback themes",
        "Predictive feature request ranking",
        "Generative feedback summaries",
        "Sentiment analysis of reviews",
        "Smart duplicate feedback detection",
        "Conversational feedback Q&A",
        "AI user satisfaction forecasting",
        "Predictive bug prioritization",
        "Feedback-driven roadmap generator",
        "AI correlation with churn metrics",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Feedback Hub</h2>
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

export default FeedbackHubView;
