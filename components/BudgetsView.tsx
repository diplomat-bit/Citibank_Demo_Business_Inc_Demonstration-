// DEPRECATED: This component has been moved and refactored.
// The new, expanded budgets logic is now located at:
// components/views/personal/BudgetsView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All budgets functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedBudgetsView: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use BudgetsView from components/views/personal/BudgetsView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedBudgetsView;
