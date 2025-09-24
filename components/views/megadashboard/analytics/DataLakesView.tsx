import React from 'react';
import Card from '../../../Card';

const DataLakesView: React.FC = () => {
    const features = [
        "AI-driven schema discovery",
        "Auto-suggested data cataloging",
        "Anomaly detection in stored data",
        "Predictive query optimization",
        "Natural language data exploration",
        "AI lifecycle management of datasets",
        "Automated data quality checks",
        "Smart retention policy enforcement",
        "Generative data summaries",
        "AI-driven compliance tagging",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Lakes</h2>
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

export default DataLakesView;
