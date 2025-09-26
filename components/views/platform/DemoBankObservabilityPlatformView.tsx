// components/views/platform/DemoBankObservabilityPlatformView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankObservabilityPlatformView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Observability Platform</h2>
            <Card title="Overview">
                <p className="text-gray-400">Gain deep insights into your system's performance. Correlate metrics, logs, and traces in one place to quickly identify and resolve issues.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Distributed Tracing"><p>Trace requests as they travel across your microservices architecture.</p></Card>
                 <Card title="Log Aggregation"><p>Collect, search, and analyze logs from all your services and infrastructure.</p></Card>
                 <Card title="Metrics & Alerting"><p>Monitor key performance indicators and set up intelligent alerts.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankObservabilityPlatformView;