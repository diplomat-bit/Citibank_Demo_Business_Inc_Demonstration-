// components/views/platform/DemoBankCDPView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankCDPView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Customer Data Platform</h2>
            <Card title="Overview">
                <p className="text-gray-400">Unify customer data from multiple sources to create a single, coherent, 360-degree view of each customer.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Data Ingestion"><p>Connect to various sources like CRM, ERP, and analytics to pull in customer data.</p></Card>
                 <Card title="Identity Resolution"><p>Stitch together customer identities across different platforms and devices.</p></Card>
                 <Card title="Audience Segmentation"><p>Build and activate dynamic audience segments for marketing campaigns.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankCDPView;