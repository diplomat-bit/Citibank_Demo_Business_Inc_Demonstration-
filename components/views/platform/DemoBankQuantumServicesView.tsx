// components/views/platform/DemoBankQuantumServicesView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankQuantumServicesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Quantum Services</h2>
            <Card title="Overview">
                <p className="text-gray-400">Access quantum computing resources through the cloud. Run complex simulations, solve optimization problems, and explore the future of computing.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Quantum Simulators"><p>Test your quantum algorithms on powerful classical simulators.</p></Card>
                 <Card title="Hardware Access"><p>Submit jobs to run on real quantum hardware from leading providers.</p></Card>
                 <Card title="Algorithm Library"><p>Use pre-built quantum algorithms for finance, chemistry, and machine learning.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankQuantumServicesView;
