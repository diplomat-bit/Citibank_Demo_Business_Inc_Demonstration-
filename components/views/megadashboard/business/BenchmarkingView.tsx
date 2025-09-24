import React from 'react';
import Card from '../../../Card';

const BenchmarkingView: React.FC = () => {
    const features = [
        "AI-driven KPI benchmarking",
        "Predictive peer comparison modeling",
        "Conversational benchmarking coach",
        "Smart goal-setting recommendations",
        "AI anomaly detection in benchmarks",
        "Generative performance reports",
        "Predictive improvement forecasts",
        "AI-driven cohort clustering",
        "Conversational scorecard assistant",
        "Smart incentive optimization",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Benchmarking</h2>
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

export default BenchmarkingView;
