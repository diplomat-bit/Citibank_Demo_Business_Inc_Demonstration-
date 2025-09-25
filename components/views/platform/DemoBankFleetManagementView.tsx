// components/views/platform/DemoBankFleetManagementView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankFleetManagementView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Fleet Management</h2>
            <Card title="Overview">
                <p className="text-gray-400">Monitor, manage, and optimize your fleet of vehicles, drones, or mobile assets in real-time. Integrates with IoT Hub and Maps for live tracking and telematics.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Live Geotracking"><p>View the real-time location of all assets on a unified map.</p></Card>
                 <Card title="Route Optimization"><p>Use AI to plan the most efficient routes for your fleet.</p></Card>
                 <Card title="Maintenance Alerts"><p>Receive predictive maintenance alerts based on vehicle telematics data.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankFleetManagementView;
