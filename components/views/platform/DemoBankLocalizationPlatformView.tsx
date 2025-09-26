// components/views/platform/DemoBankLocalizationPlatformView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankLocalizationPlatformView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Localization Platform</h2>
            <Card title="Overview">
                <p className="text-gray-400">Manage the translation and localization of your applications and content for a global audience. Integrate with your CI/CD pipeline for continuous localization.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Translation Management"><p>A centralized system for managing translation strings and workflows.</p></Card>
                 <Card title="AI-Powered Translations"><p>Use machine translation to accelerate the localization process.</p></Card>
                 <Card title="In-Context Review"><p>Allow translators to review translations directly within your application's UI.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankLocalizationPlatformView;