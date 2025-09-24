import React from 'react';
import Card from '../../../Card';

const LoanApplicationsView: React.FC = () => {
    const features = [
        "AI pre-approval scoring",
        "Risk-adjusted loan offers",
        "Smart repayment schedule suggestions",
        "AI-driven income verification",
        "Fraud detection in loan docs",
        "Conversational loan eligibility assistant",
        "AI rejection explanation generator",
        "Predictive default monitoring",
        "Loan portfolio optimization",
        "Sentiment analysis of applicant intent",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Loan Applications</h2>
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

export default LoanApplicationsView;
