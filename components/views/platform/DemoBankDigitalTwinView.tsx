// components/views/platform/DemoBankDigitalTwinView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankDigitalTwinView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Digital Twin</h2>
            <Card title="Overview">
                <p className="text-gray-400">Create, manage, and simulate digital representations of physical assets, processes, and systems. Integrate IoT data for real-time monitoring and predictive maintenance.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Twin Modeling"><p>Define the properties and relationships of your digital twins.</p></Card>
                 <Card title="Live Simulation"><p>Run complex simulations to predict outcomes and optimize performance.</p></Card>
                 <Card title="IoT Integration"><p>Connect real-world sensor data to your digital twin models.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankDigitalTwinView;
