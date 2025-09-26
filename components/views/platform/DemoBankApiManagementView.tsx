// components/views/platform/DemoBankApiManagementView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankApiManagementView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank API Management</h2>
            <Card title="Overview">
                <p className="text-gray-400">Manage the full lifecycle of your APIs. This dashboard provides tools for designing, publishing, securing, and analyzing APIs at scale.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="API Products"><p>Group APIs into product offerings for different consumer tiers.</p></Card>
                 <Card title="Developer Portal"><p>Customize the onboarding and documentation experience for API consumers.</p></Card>
                 <Card title="Policies & Security"><p>Enforce global security policies, authentication methods, and rate limits.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankApiManagementView;