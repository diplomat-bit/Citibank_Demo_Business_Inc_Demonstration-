// DEPRECATED: This component has been moved and refactored.
// The new, expanded transactions logic is now located at:
// components/views/personal/TransactionsView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All transactions functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedTransactionsView: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use TransactionsView from components/views/personal/TransactionsView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedTransactionsView;
