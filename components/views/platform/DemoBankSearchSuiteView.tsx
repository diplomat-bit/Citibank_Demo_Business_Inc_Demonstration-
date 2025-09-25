// components/views/platform/DemoBankSearchSuiteView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankSearchSuiteView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Search Suite</h2>
            <Card title="Overview">
                <p className="text-gray-400">A fully-managed search and analytics engine. Add powerful search capabilities to your applications and analyze large volumes of data in real-time.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Full-Text Search"><p>Implement fast and relevant full-text search with customizable ranking.</p></Card>
                 <Card title="Geospatial Search"><p>Perform complex geospatial queries on your data.</p></Card>
                 <Card title="Analytics & Visualization"><p>Aggregate and visualize your search data to uncover insights.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankSearchSuiteView;
