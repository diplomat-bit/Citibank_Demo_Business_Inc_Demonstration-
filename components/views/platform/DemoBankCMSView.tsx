// components/views/platform/DemoBankCMSView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankCMSView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank CMS</h2>
            <Card title="Overview">
                <p className="text-gray-400">A powerful headless CMS to manage and deliver content to any frontend application or device.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Content Models"><p>Define the structure of your content with flexible, reusable models.</p></Card>
                 <Card title="GraphQL API"><p>Access your content through a powerful and flexible GraphQL API.</p></Card>
                 <Card title="Localization"><p>Manage content in multiple languages and locales seamlessly.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankCMSView;
