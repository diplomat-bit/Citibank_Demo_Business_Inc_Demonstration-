// components/views/platform/DemoBankSupplyChainView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankSupplyChainView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Supply Chain</h2>
            <Card title="Overview">
                <p className="text-gray-400">A comprehensive platform for supply chain management. Track inventory, manage shipments, and collaborate with suppliers in real-time.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Inventory Management"><p>Get a real-time view of your inventory across all locations.</p></Card>
                 <Card title="Shipment Tracking"><p>Track shipments from origin to destination with live updates.</p></Card>
                 <Card title="Supplier Collaboration"><p>Share data and collaborate with your suppliers in a secure portal.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankSupplyChainView;