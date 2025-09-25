// components/views/platform/DemoBankEventGridView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankEventGridView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Event Grid</h2>
            <Card title="Overview">
                <p className="text-gray-400">A fully-managed, intelligent event routing service that allows for uniform event consumption using a publish-subscribe model. Decouple applications and build event-driven architectures at scale.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Advanced Filtering"><p>Route events based on complex rules and payload attributes.</p></Card>
                 <Card title="Multiple Subscribers"><p>Deliver a single event to multiple endpoints, including Functions, Logic Apps, and Webhooks.</p></Card>
                 <Card title="High Reliability"><p>Ensure event delivery with built-in retry policies and dead-lettering.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankEventGridView;
