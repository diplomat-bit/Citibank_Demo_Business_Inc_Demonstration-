import React from 'react';
import Card from '../../../Card';

const NftVaultView: React.FC = () => {
    const features = [
        "AI NFT valuation estimator",
        "Predictive NFT price trends",
        "Fraud detection on NFT transfers",
        "Conversational NFT curator",
        "Smart NFT portfolio suggestions",
        "AI clustering of NFT themes",
        "Predictive NFT rarity scoring",
        "Generative NFT collection insights",
        "Smart duplicate NFT detection",
        "AI-driven NFT sentiment analysis",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">NFT Vault</h2>
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

export default NftVaultView;
