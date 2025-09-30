import React from 'react';
import { View } from '../../../types';
import { NAV_ITEMS, NavItem } from '../../../constants';
import DashboardTile from '../../DashboardTile';

interface DashboardViewProps {
    openModalView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ openModalView }) => {

    const renderSection = (header: string, items: NavItem[]) => (
        <div key={header}>
            <h2 className="text-2xl font-bold text-white tracking-wider mb-4 mt-8">{header}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map(item => {
                     if ('id' in item) {
                        return <DashboardTile key={item.id} item={item} onClick={() => openModalView(item.id)} />;
                    }
                    return null;
                })}
            </div>
        </div>
    );

    // Group NAV_ITEMS by their headers
    const sections: { [key: string]: NavItem[] } = {};
    let currentHeader = 'Main';
    NAV_ITEMS.forEach(item => {
        if (item.type === 'header') {
            currentHeader = item.label;
        } else if (item.type !== 'divider' && 'id' in item) {
            if (!sections[currentHeader]) {
                sections[currentHeader] = [];
            }
            sections[currentHeader].push(item);
        }
    });

    return (
        <div className="space-y-6">
            {Object.entries(sections).map(([header, items]) => renderSection(header, items))}
        </div>
    );
};

export default DashboardView;