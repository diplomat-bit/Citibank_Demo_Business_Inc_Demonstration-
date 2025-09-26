// components/views/platform/DemoBankKnowledgeBaseView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankKnowledgeBaseView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Knowledge Base</h2>
            <Card title="Overview">
                <p className="text-gray-400">A centralized repository for your organization's knowledge. Create, share, and manage internal documentation, guides, and best practices.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Powerful Search"><p>Find the information you need instantly with AI-powered semantic search.</p></Card>
                 <Card title="Collaborative Editing"><p>Work together on documents with real-time collaborative editing.</p></Card>
                 <Card title="Version History"><p>Track changes and revert to previous versions of any article.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankKnowledgeBaseView;