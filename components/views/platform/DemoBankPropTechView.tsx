// components/views/platform/DemoBankPropTechView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankPropTechView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank PropTech</h2>
            <Card title="Overview">
                <p className="text-gray-400">A modern platform for real estate and property management. Streamline operations, manage listings, and enhance tenant experiences.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Property Management"><p>Track leases, manage maintenance requests, and handle accounting for your properties.</p></Card>
                 <Card title="Listing Syndication"><p>Publish your property listings to multiple platforms with a single click.</p></Card>
                 <Card title="Tenant Portal"><p>Provide tenants with a self-service portal for payments and communication.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankPropTechView;