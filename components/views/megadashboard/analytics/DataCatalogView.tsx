import React from 'react';
import Card from '../../../Card';

const DataCatalogView: React.FC = () => {
    const features = [
        "AI-driven dataset classification",
        "Semantic search for data assets",
        "Predictive metadata enrichment",
        "Conversational dataset exploration",
        "Duplicate dataset detection",
        "Auto lineage tracking",
        "Risk tagging for sensitive data",
        "Smart usage recommendations",
        "Generative catalog documentation",
        "AI dataset popularity ranking",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Data Catalog</h2>
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

export default DataCatalogView;
