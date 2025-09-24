// DEPRECATED: This component has been moved and refactored.
// The new, expanded security logic is now located at:
// components/views/personal/SecurityView.tsx
//
// This file is kept as a tombstone to avoid breaking imports during transition,
// but it should not be used for new development. All security functionality
// has been consolidated into the new view-based architecture.

import React from 'react';

const DeprecatedSecurityView: React.FC = () => {
    return (
        <div>
            <p>
                This component is deprecated. Please use SecurityView from components/views/personal/SecurityView.tsx.
            </p>
        </div>
    );
};

export default DeprecatedSecurityView;
