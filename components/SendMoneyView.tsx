// DEPRECATED: This component has been moved and refactored.
// The new, expanded send money logic is now located at:
// components/views/personal/SendMoneyView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All send money functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedSendMoneyView: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use SendMoneyView from components/views/personal/SendMoneyView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedSendMoneyView;
