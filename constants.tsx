// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. This file is 
// the pantheon of the application's identity, defining its navigable realms
// and the symbols that represent them.

import React from 'react';
import { View } from './types';
import { CONSTITUTIONAL_ARTICLES } from './data/constitutionalArticles';

// ================================================================================================
// TYPE DEFINITIONS FOR NAVIGATION
// ================================================================================================
// FIX: Added `type?: never` to NavLink to fix type inference issues in Sidebar.tsx.
// This ensures that the 'type' property can be safely accessed on any NavItem.
type NavLink = { id: View; label: string; icon: React.ReactElement; type?: never; };
type NavHeader = { type: 'header'; label: string; id?: never; icon?: never };
type NavDivider = { type: 'divider'; id?: never; label?: never; icon?: never };
export type NavItem = NavLink | NavHeader | NavDivider;


// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
// Each icon is defined as a full React component for clarity, accessibility, and ease of use.
// They are designed to inherit color via `currentColor` for maximum flexibility.
// ------------------------------------------------------------------------------------------------

const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const NexusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 22V12m0-10l-4 2m4-2l4 2m-4 10s-4-2-4-5m4 5s4-2 4-5" /></svg>
);
const TransactionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const SendMoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);
const BudgetsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
);
const InvestmentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const PortfolioExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h7M4 18h7M15 14h.01M15 18h.01M18 14h.01M18 18h.01" /></svg>
);
const AIAdvisorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
const QuantumWeaverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const QuantumOracleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const CorpDashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /></svg>
);
const PaymentOrdersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const PayrollIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v-2.5a.5.5 0 00-1 0V14m-3.03-.47a.5.5 0 00.7.7m4.66 0a.5.5 0 01.7-.7" /></svg>
);
const CounterpartiesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 014.288 0M12 14a3 3 0 100-6 3 3 0 000 6z" /></svg>
);
const InvoicesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ComplianceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" /></svg>
);
const AnomalyDetectionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const APIStatusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
);
const AIAdStudioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const CryptoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const FinancialGoalsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const MarketplaceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
);
const PersonalizationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 12.728l-1.414-1.414M6.343 17.657l-1.414 1.414m12.02-6.02a4 4 0 11-5.656-5.656 4 4 0 015.656 5.656z" /></svg>
);
const CardCustomizationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3l4.5 4.5-10.5 10.5h-4.5v-4.5l10.5-10.5z" /></svg>
);
const SecurityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const ApiKeysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2m0 0v11a2 2 0 002 2h6a2 2 0 002-2V9M9 7h6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const OpenBankingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);
const RewardsHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" /></svg>
);
const CreditHealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const TheVisionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const PlatformIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);

// ================================================================================================
// CONSTITUTIONAL MODULE ICONS
// ================================================================================================
const DoctrineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const LawIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.002 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>);
const AiBrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l-2 3h4l-2-3zm0 14l-2-3h4l-2 3zM8 9l-3-2v6l3-2m8 0l3-2v6l-3-2" /></svg>);
const CreateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const FortressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.786-2.67 9.394M12 11c1.66 2.608 2.67 5.877 2.67 9.394m-5.34 0h5.34M3 20h18M6 20V10a2 2 0 012-2h8a2 2 0 012 2v10M9 6a3 3 0 013-3h0a3 3 0 013 3v4H9V6z" /></svg>);

const ARTICLE_ICONS: Record<string, React.ReactElement> = {
    charter: <DoctrineIcon />,
    law: <LawIcon />,
    ai: <AiBrainIcon />,
    creation: <CreateIcon />,
    security: <FortressIcon />,
    default: <DoctrineIcon />,
};


// ================================================================================================
// DEMO BANK PLATFORM ICONS
// ================================================================================================
const SocialIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>);
const ERPIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>);
const CRMIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>);
const APIGatewayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v4m0 0V3m0 4h4m-4 0H8m4 13v-4m0 0v4m0-4h4m-4 0H8" /></svg>);
const GraphExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><circle cx="12" cy="12" r="3" /><circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v-1.5m0-3V9m3.35-2.65L13.5 7.5m-3 0L9.35 6.35m0 11.3L10.5 16.5m3 0l1.15 1.15" /></svg>);
const DBQLIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h8M8 15h5" /><circle cx="17" cy="15" r="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 16.5l1.5 1.5" /></svg>);
const CloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>);
const IdentityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h4a2 2 0 002-2V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a2 2 0 002 2zM15 5a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0a2 2 0 01-2 2H9a2 2 0 01-2-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" /></svg>);
const StorageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2M4 7h16M8 11h.01M8 15h.01" /></svg>);
const ComputeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H4a1 1 0 00-1 1v5m0 6v5a1 1 0 001 1h5M20 3h-5a1 1 0 00-1 1v5m0 6v5a1 1 0 001 1h5m-6-8a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const MlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /><circle cx="6" cy="18" r="1" /><circle cx="10" cy="14" r="1" /><circle cx="18" cy="8" r="1" /></svg>);
const DevOpsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 2 2 2m-2-4l-2-2-2 2m4 4l2-2-2-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>);
const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ConnectIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);
const EventsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l-7 4 7-4-3 7z" /></svg>);
const LogicAppsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>);
const FunctionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 104 0v16a2 2 0 10-4 0V4zM7 12h10M7 6h10" /></svg>);
const DataFactoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>);
const AnalyticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>);
const IoTHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const MapsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const CommunicationsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const TeamsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 014.288 0M12 14a3 3 0 100-6 3 3 0 000 6zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CMSIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM15 12H9" /></svg>);
const LMSIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const HRISIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);
const ProjectsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const LegalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.688 3.688A1.5 1.5 0 019 3h6a1.5 1.5 0 011.313.688l2.5 4.331A1.5 1.5 0 0117.5 9H6.5a1.5 1.5 0 01-1.313-.981l-2.5-4.33z" /></svg>);
const SupplyChainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H6V6h11v4l2 2v3h-3zM6 6l6-4 6 4" /></svg>);
const PropTechIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1-1-1-2.5 0-3.5s2.5-1 3.5 0" /></svg>);
const GamingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a4 4 0 100-8 4 4 0 000 8zM6 20a4 4 0 100-8 4 4 0 000 8z" /></svg>);
const BookingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-2 2 4 4" /></svg>);
const CDPIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4m10 0h4M10 3v4m4 10v4" /></svg>);
const AtomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><circle cx="12" cy="12" r="1" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9" transform="rotate(60 12 12)" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9" transform="rotate(120 12 12)" /></svg>);
const BlockchainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><rect x="3" y="10" width="8" height="8" rx="2"/><rect x="13" y="6" width="8" height="8" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 14h2m-2-4h2" /></svg>);
const GpsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const RoboticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m14 0h2M3 15h2m14 0h2M12 15a3 3 0 110-6 3 3 0 010 6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10.5V12a5 5 0 005 5h0a5 5 0 005-5v-1.5" /></svg>);
const SimulationsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const VoiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072" /></svg>);
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const DigitalTwinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h10a2 2 0 012 2v12a4 4 0 01-4 4H7zM10 9L7 12l3 3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 15l-3-3 3-3" /></svg>);
const WorkflowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-8-6h8" /></svg>);
const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);
const ToggleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /><rect x="15" y="16" width="6" height="4" rx="2" /><circle cx="17" cy="18" r="1" /></svg>);
const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.363-.448c-.57-.108-1.14-.326-1.67-.648a2 2 0 01-1.022-1.84V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v5.18a2 2 0 01-1.022 1.84c-.53.322-1.1.54-1.67.648l-2.363.448a2 2 0 00-1.022.547M16 18v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2" /></svg>);
const TranslateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4 4-4-4M19 5v12m0 0h-4m4 0l-4-4m4 4l4-4" /></svg>);
const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H6V6h11v7h-4M6 6L12 2l6 4" /></svg>);
const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zM8 4v16m8-16v16M4 8h16M4 16h16" /></svg>);
const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4v16m4-16v16M4 10h16M4 14h16" /></svg>);

// ================================================================================================
// MEGA DASHBOARD ICONS
// ================================================================================================
const ShieldKeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const DollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>);
const BracketsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);
const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.688 3.688A1.5 1.5 0 019 3h6a1.5 1.5 0 011.313.688l2.5 4.331A1.5 1.5 0 0117.5 9H6.5a1.5 1.5 0 01-1.313-.981l-2.5-4.33z" /></svg>);
const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 7v10" /></svg>);
const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.002 0M18 7l3 9m-3-9l-6-2" /></svg>);
const ServerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>);


// ================================================================================================
// INTEGRATION ICON COMPONENTS
// ================================================================================================
// FIX: Moved from data/integrationData.ts to allow JSX in a .tsx file and exported for use.
export const StripeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M28.802 6.333H14.265c-1.42 0-2.613.95-2.921 2.301l-4.111 18.06a2.98 2.98 0 002.92 3.642h14.537c1.42 0 2.613-.95 2.921-2.301l4.111-18.06a2.98 2.98 0 00-2.92-3.642z" fill="#635BFF"></path><path d="M28.665 10.463c-.428 0-.79.308-.887.72l-1.129 4.957a.91.91 0 01-.887.72h-5.263a.81.81 0 00-.79.615l-.261 1.143a.81.81 0 00.79.998h5.255a.91.91 0 01.887.72l1.129 4.957c.097.412.46.72.887.72.428 0 .79-.308.887-.72l4.11-18.06a.81.81 0 00-.79-.998h-3.41z" fill="#fff"></path></svg>);
export const PlaidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" fill="#000"/><path d="M12 5a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 110-10 5 5 0 010 10z" fill="#000"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" fill="#000"/></svg>);
export const SlackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 122.8 122.8" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M25.8 73.4c0 6.3-5.1 11.4-11.4 11.4S3 79.7 3 73.4s5.1-11.4 11.4-11.4h11.4v11.4z" fill="#36c5f0"></path><path d="M37.2 73.4c6.3 0 11.4-5.1 11.4-11.4S43.5 50.6 37.2 50.6s-11.4 5.1-11.4 11.4v11.4h11.4z" fill="#2eb67d"></path><path d="M48.6 25.8c0-6.3 5.1-11.4 11.4-11.4s11.4 5.1 11.4 11.4v11.4H48.6V25.8z" fill="#ecb22e"></path><path d="M48.6 37.2c-6.3 0-11.4 5.1-11.4 11.4s5.1 11.4 11.4 11.4 11.4-5.1 11.4-11.4H48.6V37.2z" fill="#e01e5a"></path><path d="M97 49.4c0-6.3 5.1-11.4 11.4-11.4 6.3 0 11.4 5.1 11.4 11.4s-5.1 11.4-11.4 11.4H97V49.4z" fill="#e01e5a"></path><path d="M85.6 49.4c-6.3 0-11.4 5.1-11.4 11.4s5.1 11.4 11.4 11.4 11.4-5.1 11.4-11.4V49.4H85.6z" fill="#ecb22e"></path><path d="M74.2 97c0 6.3-5.1 11.4-11.4 11.4-6.3 0-11.4-5.1-11.4-11.4V85.6h22.8V97z" fill="#2eb67d"></path><path d="M74.2 85.6c6.3 0 11.4-5.1 11.4-11.4s-5.1-11.4-11.4-11.4-11.4 5.1-11.4 11.4h11.4v11.4z" fill="#36c5f0"></path></svg>);
export const SalesforceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M11.9 2.1c-5.5 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8 9.8-4.4 9.8-9.8-4.3-9.8-9.8-9.8zm3.2 13.3c-.4.3-1.1.2-1.7-.1-.5-.2-1.1-.6-1.5-.9-.8-.6-1.6-1.2-2.3-1.4-.8-.2-1.6.1-2.1.7-.5.6-.6 1.4-.1 2 .5.6 1.4.7 2 .1.4-.3 1.1-.2 1.7.1.5.2 1.1.6 1.5.9.8.6 1.6 1.2 2.3 1.4.8.2 1.6-.1 2.1-.7.5-.6.6-1.4.1-2-.4-.6-1.3-.7-1.9-.1z" fill="#009DDF"/></svg>);
export const PagerDutyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M20 20a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h12a2 2 0 012 2v16zM9.48 7.3a.5.5 0 00-.48.5v8.4a.5.5 0 00.48.5h5.04a.5.5 0 00.48-.5V7.8a.5.5 0 00-.48-.5H9.48zm.96 1.2h3.12v1.2H10.44V8.5zm0 2.4h3.12v1.2H10.44v-1.2zm0 2.4h3.12v1.2H10.44v-1.2z" fill="#06AC38"/></svg>);
export const JiraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M11.29 21.71a1.14 1.14 0 01-1.14-1.14V3.43a1.14 1.14 0 012.28 0v17.14a1.14 1.14 0 01-1.14 1.14z" fill="#2684FF"/><path d="M11.29 21.71a1.14 1.14 0 01-1.14-1.14V3.43a1.14 1.14 0 112.28 0v17.14a1.14 1.14 0 01-1.14 1.14z" transform="rotate(60 11.29 12.57)" fill="#2684FF"/><path d="M11.29 21.71a1.14 1.14 0 01-1.14-1.14V3.43a1.14 1.14 0 012.28 0v17.14a1.14 1.14 0 01-1.14 1.14z" transform="rotate(120 11.29 12.57)" fill="#2684FF"/></svg>);

// ================================================================================================
// NAVIGATION ITEMS
// ================================================================================================
/**
 * @description The single source of truth for all primary navigation items.
 * This array is used by the Sidebar component to dynamically generate the navigation menu.
 * Adding a new item here will automatically add it to the UI.
 * Special types 'divider' and 'header' are used for visual separation.
 */
export const NAV_ITEMS: NavItem[] = [
    // --- Personal Finance Suite ---
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: View.TheNexus, label: 'The Nexus', icon: <NexusIcon /> },
    { type: 'header', label: 'Personal' },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon /> },
    { id: View.SendMoney, label: 'Send Money', icon: <SendMoneyIcon /> },
    { id: View.Budgets, label: 'Budgets', icon: <BudgetsIcon /> },
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon /> },
    { id: View.PortfolioExplorer, label: 'Portfolio Explorer', icon: <PortfolioExplorerIcon /> },
    { id: View.FinancialGoals, label: 'Financial Goals', icon: <FinancialGoalsIcon /> },
    { id: View.RewardsHub, label: 'Rewards Hub', icon: <RewardsHubIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },
    
    // --- AI & Platform Suite ---
    { type: 'header', label: 'AI & Advanced Features' },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.QuantumOracle, label: 'Quantum Oracle', icon: <QuantumOracleIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },

    // --- Corporate Finance Suite ---
    { type: 'header', label: 'Corporate' },
    { id: View.CorporateDashboard, label: 'Corp Dashboard', icon: <CorpDashboardIcon /> },
    { id: View.PaymentOrders, label: 'Payment Orders', icon: <PaymentOrdersIcon /> },
    { id: View.Payroll, label: 'Payroll', icon: <PayrollIcon /> },
    { id: View.Counterparties, label: 'Counterparties', icon: <CounterpartiesIcon /> },
    { id: View.Invoices, label: 'Invoices', icon: <InvoicesIcon /> },
    { id: View.Compliance, label: 'Compliance', icon: <ComplianceIcon /> },
    { id: View.AnomalyDetection, label: 'Anomaly Detection', icon: <AnomalyDetectionIcon /> },
    
    // --- Constitutional Modules ---
    { type: 'divider' },
    { type: 'header', label: 'Constitutional Modules' },
    ...CONSTITUTIONAL_ARTICLES.map(article => ({
        id: View[`Article${article.id}` as keyof typeof View],
        label: `Article ${article.romanNumeral}`,
        icon: ARTICLE_ICONS[article.iconName] || ARTICLE_ICONS.default,
    })),
    
    // --- Demo Bank Platform Suite ---
    { type: 'divider' },
    { type: 'header', label: 'Demo Bank Platform' },
    { id: View.DemoBankSocial, label: 'Social', icon: <SocialIcon /> },
    { id: View.DemoBankERP, label: 'ERP', icon: <ERPIcon /> },
    { id: View.DemoBankCRM, label: 'CRM', icon: <CRMIcon /> },
    { id: View.DemoBankAPIGateway, label: 'API Gateway', icon: <APIGatewayIcon /> },
    { id: View.DemoBankGraphExplorer, label: 'Graph Explorer', icon: <GraphExplorerIcon /> },
    { id: View.DemoBankDBQL, label: 'DBQL', icon: <DBQLIcon /> },
    { id: View.DemoBankCloud, label: 'Cloud', icon: <CloudIcon /> },
    { id: View.DemoBankIdentity, label: 'Identity', icon: <IdentityIcon /> },
    { id: View.DemoBankStorage, label: 'Storage', icon: <StorageIcon /> },
    { id: View.DemoBankCompute, label: 'Compute', icon: <ComputeIcon /> },
    { id: View.DemoBankAIPlatform, label: 'AI Platform', icon: <AIAdvisorIcon /> },
    { id: View.DemoBankMachineLearning, label: 'Machine Learning', icon: <MlIcon /> },
    { id: View.DemoBankDevOps, label: 'DevOps', icon: <DevOpsIcon /> },
    { id: View.DemoBankSecurityCenter, label: 'Security Center', icon: <ShieldIcon /> },
    { id: View.DemoBankComplianceHub, label: 'Compliance Hub', icon: <ComplianceIcon /> },
    { id: View.DemoBankAppMarketplace, label: 'App Marketplace', icon: <MarketplaceIcon /> },
    { id: View.DemoBankConnect, label: 'Connect', icon: <ConnectIcon /> },
    { id: View.DemoBankEvents, label: 'Events', icon: <EventsIcon /> },
    { id: View.DemoBankLogicApps, label: 'Logic Apps', icon: <LogicAppsIcon /> },
    { id: View.DemoBankFunctions, label: 'Functions', icon: <FunctionsIcon /> },
    { id: View.DemoBankDataFactory, label: 'Data Factory', icon: <DataFactoryIcon /> },
    { id: View.DemoBankAnalytics, label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: View.DemoBankBI, label: 'BI', icon: <BudgetsIcon /> },
    { id: View.DemoBankIoTHub, label: 'IoT Hub', icon: <IoTHubIcon /> },
    { id: View.DemoBankMaps, label: 'Maps', icon: <MapsIcon /> },
    { id: View.DemoBankCommunications, label: 'Communications', icon: <CommunicationsIcon /> },
    { id: View.DemoBankCommerce, label: 'Commerce', icon: <MarketplaceIcon /> },
    { id: View.DemoBankTeams, label: 'Teams', icon: <TeamsIcon /> },
    { id: View.DemoBankCMS, label: 'CMS', icon: <CMSIcon /> },
    { id: View.DemoBankLMS, label: 'LMS', icon: <LMSIcon /> },
    { id: View.DemoBankHRIS, label: 'HRIS', icon: <HRISIcon /> },
    { id: View.DemoBankProjects, label: 'Projects', icon: <ProjectsIcon /> },
    { id: View.DemoBankLegalSuite, label: 'Legal Suite', icon: <LegalIcon /> },
    { id: View.DemoBankSupplyChain, label: 'Supply Chain', icon: <SupplyChainIcon /> },
    { id: View.DemoBankPropTech, label: 'PropTech', icon: <PropTechIcon /> },
    { id: View.DemoBankGamingServices, label: 'Gaming Services', icon: <GamingIcon /> },
    { id: View.DemoBankBookings, label: 'Bookings', icon: <BookingsIcon /> },
    { id: View.DemoBankCDP, label: 'CDP', icon: <CDPIcon /> },
    { id: View.DemoBankQuantumServices, label: 'Quantum Services', icon: <AtomIcon /> },
    { id: View.DemoBankBlockchain, label: 'Blockchain', icon: <BlockchainIcon /> },
    { id: View.DemoBankGIS, label: 'GIS Platform', icon: <GpsIcon /> },
    { id: View.DemoBankRobotics, label: 'Robotics', icon: <RoboticsIcon /> },
    { id: View.DemoBankSimulations, label: 'Simulations', icon: <SimulationsIcon /> },
    { id: View.DemoBankVoiceServices, label: 'Voice Services', icon: <VoiceIcon /> },
    { id: View.DemoBankSearchSuite, label: 'Search Suite', icon: <SearchIcon /> },
    { id: View.DemoBankDigitalTwin, label: 'Digital Twin', icon: <DigitalTwinIcon /> },
    { id: View.DemoBankWorkflowEngine, label: 'Workflow Engine', icon: <WorkflowIcon /> },
    { id: View.DemoBankObservabilityPlatform, label: 'Observability', icon: <EyeIcon /> },
    { id: View.DemoBankFeatureManagement, label: 'Feature Management', icon: <ToggleIcon /> },
    { id: View.DemoBankExperimentationPlatform, label: 'Experimentation', icon: <BeakerIcon /> },
    { id: View.DemoBankLocalizationPlatform, label: 'Localization', icon: <TranslateIcon /> },
    { id: View.DemoBankFleetManagement, label: 'Fleet Management', icon: <TruckIcon /> },
    { id: View.DemoBankKnowledgeBase, label: 'Knowledge Base', icon: <BookOpenIcon /> },
    { id: View.DemoBankMediaServices, label: 'Media Services', icon: <FilmIcon /> },
    { id: View.DemoBankEventGrid, label: 'Event Grid', icon: <GridIcon /> },
    { id: View.DemoBankApiManagement, label: 'API Management', icon: <ApiKeysIcon /> },


    // --- Mega Dashboard Platforms ---
    { type: 'divider' },
    { type: 'header', label: 'Security & Identity' },
    { id: View.SecurityAccessControls, label: 'Access Controls', icon: <ShieldKeyIcon /> },
    { id: View.SecurityRoleManagement, label: 'Role Management', icon: <TeamsIcon /> },
    { id: View.SecurityAuditLogs, label: 'Audit Logs', icon: <CMSIcon /> },
    { id: View.SecurityFraudDetection, label: 'Fraud Detection', icon: <AnomalyDetectionIcon /> },
    { id: View.SecurityThreatIntelligence, label: 'Threat Intelligence', icon: <EyeIcon /> },
    { type: 'header', label: 'Finance & Banking' },
    { id: View.FinanceCardManagement, label: 'Card Management', icon: <CardCustomizationIcon /> },
    { id: View.FinanceLoanApplications, label: 'Loan Applications', icon: <InvoicesIcon /> },
    { id: View.FinanceMortgages, label: 'Mortgages', icon: <PropTechIcon /> },
    { id: View.FinanceInsuranceHub, label: 'Insurance Hub', icon: <ShieldIcon /> },
    { id: View.FinanceTaxCenter, label: 'Tax Center', icon: <DollarIcon /> },
    { type: 'header', label: 'Advanced Analytics' },
    { id: View.AnalyticsPredictiveModels, label: 'Predictive Models', icon: <MlIcon /> },
    { id: View.AnalyticsRiskScoring, label: 'Risk Scoring', icon: <AnalyticsIcon /> },
    { id: View.AnalyticsSentimentAnalysis, label: 'Sentiment Analysis', icon: <SocialIcon /> },
    { id: View.AnalyticsDataLakes, label: 'Data Lakes', icon: <StorageIcon /> },
    { id: View.AnalyticsDataCatalog, label: 'Data Catalog', icon: <BookOpenIcon /> },
    { type: 'header', label: 'User & Client Tools' },
    { id: View.UserClientOnboarding, label: 'Client Onboarding', icon: <IdentityIcon /> },
    { id: View.UserClientKycAml, label: 'KYC/AML', icon: <ComplianceIcon /> },
    { id: View.UserClientUserInsights, label: 'User Insights', icon: <CRMIcon /> },
    { id: View.UserClientFeedbackHub, label: 'Feedback Hub', icon: <CommunicationsIcon /> },
    { id: View.UserClientSupportDesk, label: 'Support Desk', icon: <EventsIcon /> },
    { type: 'header', label: 'Developer & Integration' },
    { id: View.DeveloperSandbox, label: 'Sandbox', icon: <BeakerIcon /> },
    { id: View.DeveloperApiKeys, label: 'API Keys', icon: <ApiKeysIcon /> },
    { id: View.DeveloperSdkDownloads, label: 'SDK Downloads', icon: <CloudIcon /> },
    { id: View.DeveloperWebhooks, label: 'Webhooks', icon: <ConnectIcon /> },
    { id: View.DeveloperCliTools, label: 'CLI Tools', icon: <BracketsIcon /> },
    { id: View.DeveloperExtensions, label: 'Extensions', icon: <LogicAppsIcon /> },
    { type: 'header', label: 'Ecosystem & Connectivity' },
    { id: View.EcosystemPartnerHub, label: 'Partner Hub', icon: <GlobeIcon /> },
    { id: View.EcosystemAffiliates, label: 'Affiliates', icon: <TeamsIcon /> },
    { id: View.EcosystemIntegrationsMarketplace, label: 'Integrations', icon: <MarketplaceIcon /> },
    { id: View.EcosystemCrossBorderPayments, label: 'Cross-Border', icon: <SendMoneyIcon /> },
    { id: View.EcosystemMultiCurrency, label: 'Multi-Currency', icon: <DollarIcon /> },
    { type: 'header', label: 'Digital Assets & Web3' },
    { id: View.DigitalAssetsNftVault, label: 'NFT Vault', icon: <DiamondIcon /> },
    { id: View.DigitalAssetsTokenIssuance, label: 'Token Issuance', icon: <AtomIcon /> },
    { id: View.DigitalAssetsSmartContracts, label: 'Smart Contracts', icon: <BracketsIcon /> },
    { id: View.DigitalAssetsDaoGovernance, label: 'DAO Governance', icon: <LegalIcon /> },
    { id: View.DigitalAssetsOnChainAnalytics, label: 'On-Chain Analytics', icon: <AnalyticsIcon /> },
    { type: 'header', label: 'Business & Growth' },
    { id: View.BusinessSalesPipeline, label: 'Sales Pipeline', icon: <InvestmentsIcon /> },
    { id: View.BusinessMarketingAutomation, label: 'Marketing Automation', icon: <AIAdStudioIcon /> },
    { id: View.BusinessGrowthInsights, label: 'Growth Insights', icon: <AnalyticsIcon /> },
    { id: View.BusinessCompetitiveIntelligence, label: 'Comp. Intelligence', icon: <EyeIcon /> },
    { id: View.BusinessBenchmarking, label: 'Benchmarking', icon: <ScaleIcon /> },
    { type: 'header', label: 'Regulation & Legal' },
    { id: View.RegulationLicensing, label: 'Licensing', icon: <ComplianceIcon /> },
    { id: View.RegulationDisclosures, label: 'Disclosures', icon: <InvoicesIcon /> },
    { id: View.RegulationLegalDocs, label: 'Legal Docs', icon: <LegalIcon /> },
    { id: View.RegulationRegulatorySandbox, label: 'Regulatory Sandbox', icon: <BeakerIcon /> },
    { id: View.RegulationConsentManagement, label: 'Consent Management', icon: <ShieldKeyIcon /> },
    { type: 'header', label: 'Infra & Ops' },
    { id: View.InfraContainerRegistry, label: 'Container Registry', icon: <StorageIcon /> },
    { id: View.InfraApiThrottling, label: 'API Throttling', icon: <APIGatewayIcon /> },
    { id: View.InfraObservability, label: 'Observability', icon: <EyeIcon /> },
    { id: View.InfraIncidentResponse, label: 'Incident Response', icon: <EventsIcon /> },
    { id: View.InfraBackupRecovery, label: 'Backup & Recovery', icon: <ServerIcon /> },

    // --- System & Settings ---
    { type: 'divider' },
    { id: View.Security, label: 'Security', icon: <SecurityIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.APIStatus, label: 'API Status', icon: <APIStatusIcon /> },
    { id: View.TheWinningVision, label: 'The Winning Vision', icon: <TheVisionIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },

    // --- Blueprints ---
    { type: 'divider' },
    { type: 'header', label: 'Blueprints' },
    { id: View.CrisisAIManager, label: 'Crisis AI Manager', icon: <BriefcaseIcon /> },
    { id: View.CognitiveLoadBalancer, label: 'Cognitive Load Balancer', icon: <MlIcon /> },
    { id: View.HolographicMeetingScribe, label: 'Holographic Scribe', icon: <CMSIcon /> },
    { id: View.QuantumProofEncryptor, label: 'Quantum Encryptor', icon: <ShieldKeyIcon /> },
    { id: View.EtherealMarketplace, label: 'Ethereal Marketplace', icon: <MarketplaceIcon /> },
    { id: View.AdaptiveUITailor, label: 'Adaptive UI Tailor', icon: <PersonalizationIcon /> },
    { id: View.UrbanSymphonyPlanner, label: 'Urban Symphony Planner', icon: <MapsIcon /> },
    { id: View.PersonalHistorianAI, label: 'Personal Historian AI', icon: <BookOpenIcon /> },
    { id: View.DebateAdversary, label: 'Debate Adversary', icon: <SocialIcon /> },
    { id: View.CulturalAssimilationAdvisor, label: 'Cultural Advisor', icon: <GlobeIcon /> },
    { id: View.DynamicSoundscapeGenerator, label: 'Soundscape Generator', icon: <VoiceIcon /> },
    { id: View.EmergentStrategyWargamer, label: 'Strategy Wargamer', icon: <GamingIcon /> },
    { id: View.EthicalGovernor, label: 'Ethical Governor', icon: <ScaleIcon /> },
    { id: View.QuantumEntanglementDebugger, label: 'Quantum Debugger', icon: <AtomIcon /> },
    { id: View.LinguisticFossilFinder, label: 'Linguistic Fossil Finder', icon: <TranslateIcon /> },
    { id: View.ChaosTheorist, label: 'Chaos Theorist', icon: <SimulationsIcon /> },
    { id: View.SelfRewritingCodebase, label: 'Self-Rewriting Codebase', icon: <BracketsIcon /> },
];