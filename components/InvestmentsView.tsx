// DEPRECATED: This component has been moved and refactored.
// The new, expanded investments logic is now located at:
// components/views/personal/InvestmentsView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All investments functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedInvestmentsView: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use InvestmentsView from components/views/personal/InvestmentsView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedInvestmentsView;
