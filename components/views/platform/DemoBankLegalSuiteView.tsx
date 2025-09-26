// components/views/platform/DemoBankLegalSuiteView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankLegalSuiteView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Legal Suite</h2>
            <Card title="Overview">
                <p className="text-gray-400">An integrated platform for legal operations. Manage contracts, conduct e-discovery, and track cases with AI-powered insights.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Contract Lifecycle Management"><p>Track contracts from drafting to renewal with automated alerts.</p></Card>
                 <Card title="AI-Powered E-Discovery"><p>Use AI to quickly find relevant documents and reduce review time.</p></Card>
                 <Card title="Case Management"><p>Organize case files, track deadlines, and collaborate with your legal team.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankLegalSuiteView;