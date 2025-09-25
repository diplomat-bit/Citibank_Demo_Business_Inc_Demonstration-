// components/views/platform/DemoBankProjectsView.tsx
import React, { useMemo } from 'react';
import Card from '../../Card';
import { MOCK_PROJECTS } from '../../../data/platform/projectsData';
import { ProjectStatus, ProjectTask } from '../../../types';

const COLUMNS: ProjectStatus[] = ['Backlog', 'In Progress', 'Review', 'Done'];

const DemoBankProjectsView: React.FC = () => {
    const project = MOCK_PROJECTS[0];

    const columns = useMemo(() => {
        return COLUMNS.map(status => ({
            status,
            tasks: project.tasks.filter(task => task.status === status),
        }));
    }, [project.tasks]);
    
    const TaskCard: React.FC<{ task: ProjectTask }> = ({ task }) => (
        <div className="p-3 bg-gray-800/80 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-200">{task.title}</p>
            <p className="text-xs text-gray-400 mt-2">Assignee: {task.assignee}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Projects</h2>
            
            <Card title={`Project Board: ${project.name}`}>
                 <div className="flex gap-6 overflow-x-auto p-2">
                    {columns.map(column => (
                        <div key={column.status} className="w-72 flex-shrink-0 bg-gray-900/50 rounded-lg p-3">
                            <h3 className="font-semibold text-white mb-4 px-2">{column.status} ({column.tasks.length})</h3>
                            <div className="space-y-3 h-[60vh] overflow-y-auto pr-2">
                                {column.tasks.map(task => <TaskCard key={task.id} task={task} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default DemoBankProjectsView;
