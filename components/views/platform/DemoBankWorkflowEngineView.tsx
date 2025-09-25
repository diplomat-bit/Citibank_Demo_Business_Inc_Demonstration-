// components/views/platform/DemoBankWorkflowEngineView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankWorkflowEngineView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Workflow Engine</h2>
            <Card title="Overview">
                <p className="text-gray-400">Orchestrate complex, long-running business processes. Model stateful workflows with human approval steps, parallel branches, and error handling.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Visual Workflow Designer"><p>Model your business processes with a drag-and-drop visual designer.</p></Card>
                 <Card title="Stateful Execution"><p>Workflows can run for days or weeks, maintaining their state between steps.</p></Card>
                 <Card title="Human-in-the-Loop"><p>Incorporate human approval and task steps directly into your workflows.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankWorkflowEngineView;
