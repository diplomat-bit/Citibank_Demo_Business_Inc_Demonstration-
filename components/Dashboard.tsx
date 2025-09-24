// DEPRECATED: This component has been moved and refactored.
// The new, expanded dashboard logic is now located at:
// components/views/personal/DashboardView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All dashboard functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedDashboard: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use DashboardView from components/views/personal/DashboardView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedDashboard;
