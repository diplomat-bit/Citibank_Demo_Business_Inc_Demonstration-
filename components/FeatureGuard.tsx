// components/FeatureGuard.tsx
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import { PAYWALL_DATA } from '../data/paywallData';
import Paywall from './Paywall';

interface FeatureGuardProps {
    view: View;
    children: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ view, children }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("FeatureGuard must be used within a DataProvider");

    const { unlockedFeatures, unlockFeature } = context;
    const featureDetails = PAYWALL_DATA[view];

    // The Dashboard is initially unlocked. For all others, check the lock status.
    const isUnlocked = unlockedFeatures.has(view);

    // If there are no paywall details for this view, or if it's unlocked, show the content.
    if (!featureDetails || isUnlocked) {
        return <>{children}</>;
    }

    // Otherwise, show the paywall.
    return <Paywall details={featureDetails} onUnlock={() => unlockFeature(view)} />;
};

export default FeatureGuard;
