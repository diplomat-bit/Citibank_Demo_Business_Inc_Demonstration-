import React from 'react';
import Card from '../../../Card';

const SentimentAnalysisView: React.FC = () => {
    const features = [
        "AI social media sentiment tracking",
        "Customer support call tone detection",
        "Generative summaries of sentiment trends",
        "Predictive churn signals",
        "AI-driven brand reputation monitoring",
        "Market sentiment vs. stock prediction",
        "Conversational tone feedback",
        "Emotional heatmap dashboards",
        "Sentiment clustering across regions",
        "Predictive morale tracking",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Sentiment Analysis</h2>
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

export default SentimentAnalysisView;
