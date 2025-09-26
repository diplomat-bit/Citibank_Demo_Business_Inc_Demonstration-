// components/views/platform/DemoBankGISView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankGISView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank GIS Platform</h2>
            <Card title="Overview">
                <p className="text-gray-400">An advanced platform for geospatial data analysis and visualization. Layer complex datasets, perform spatial queries, and generate insightful maps.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Data Layering"><p>Overlay multiple geospatial datasets, such as demographic, topographic, and transactional data.</p></Card>
                 <Card title="Spatial Analysis"><p>Run complex spatial queries like proximity analysis and hotspot detection.</p></Card>
                 <Card title="Heatmap Generation"><p>Create and customize heatmaps to visualize data density and intensity.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankGISView;