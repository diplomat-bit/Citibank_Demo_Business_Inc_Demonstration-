// components/views/platform/DemoBankSimulationsView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankSimulationsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Simulations</h2>
            <Card title="Overview">
                <p className="text-gray-400">Run large-scale simulations in the cloud. Model complex systems, from financial markets to supply chains, and analyze potential outcomes.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Scenario Modeling"><p>Define and compare multiple scenarios to understand the impact of different variables.</p></Card>
                 <Card title="Distributed Computing"><p>Leverage our massive compute infrastructure to run simulations in parallel.</p></Card>
                 <Card title="Visualization & Analysis"><p>Analyze and visualize your simulation results with our built-in tools.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankSimulationsView;