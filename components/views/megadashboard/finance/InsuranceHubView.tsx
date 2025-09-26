// components/views/megadashboard/finance/InsuranceHubView.tsx
import React from 'react';
import Card from '../../../Card';

const InsuranceHubView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Insurance Hub</h2>
             <Card title="Mission Brief">
                <p className="text-gray-400">The future of underwriting and claims is autonomous. This is an end-to-end insurance platform for policy administration, claims processing, and underwriting, supercharged by AI to detect fraud, predict risk, and personalize premiums in real-time.</p>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="AI Claims Fraud Detection"><p>Our models analyze millions of data points to automatically flag suspicious insurance claims, catching fraud that human auditors would miss.</p></Card>
                 <Card title="Automated Claims Adjudication"><p>Use AI to automatically process and adjudicate simple, low-risk claims in seconds, freeing up your team for complex cases.</p></Card>
                 <Card title="Smart Premium Personalization"><p>Leverage machine learning to offer hyper-personalized insurance premiums based on a holistic view of individual risk.</p></Card>
            </div>
        </div>
    );
};

export default InsuranceHubView;