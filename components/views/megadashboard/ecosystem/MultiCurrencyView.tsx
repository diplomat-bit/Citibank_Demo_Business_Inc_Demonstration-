import React from 'react';
import Card from '../../../Card';

const MultiCurrencyView: React.FC = () => {
    const features = [
        "AI-driven exchange rate optimization",
        "Predictive multi-currency wallets",
        "Conversational currency converter",
        "AI compliance flagging on currencies",
        "Smart auto-currency assignment",
        "Predictive FX volatility alerts",
        "AI-driven multi-currency portfolio balancing",
        "Conversational risk insights",
        "AI sentiment-driven FX trend analysis",
        "Generative multi-currency reports",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Multi-Currency</h2>
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

export default MultiCurrencyView;
