// components/views/platform/DemoBankRoboticsView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankRoboticsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Robotics</h2>
            <Card title="Overview">
                <p className="text-gray-400">A cloud platform for developing, testing, and managing robotics applications. Simulate robot behavior and deploy updates to your fleet remotely.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Fleet Management"><p>Monitor the status and health of your entire robot fleet in real-time.</p></Card>
                 <Card title="Robotics Simulation"><p>Test your robot's software in a realistic 3D simulation environment.</p></Card>
                 <Card title="Over-the-Air Updates"><p>Deploy software updates and new features to your robots remotely.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankRoboticsView;
