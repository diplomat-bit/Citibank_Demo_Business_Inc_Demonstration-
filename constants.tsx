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
const AIAdvisorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
const QuantumWeaverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CorpDashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M9 21v-3.07a2 2 0 01.15-.76 2 2 0 011.6-1.17h.5a2 2 0 011.6 1.17c.1.4.15.76.15.76V21" /></svg>
);
const PaymentOrdersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const TheVisionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const PlatformIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const DoctrineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.002 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
);


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
    { id: View.FinancialGoals, label: 'Financial Goals', icon: <FinancialGoalsIcon /> },
    { id: View.RewardsHub, label: 'Rewards Hub', icon: <RewardsHubIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },
    
    // --- AI & Platform Suite ---
    { type: 'header', label: 'AI & Advanced Features' },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },

    // --- Corporate Finance Suite ---
    { type: 'header', label: 'Corporate' },
    { id: View.CorporateDashboard, label: 'Corp Dashboard', icon: <CorpDashboardIcon /> },
    { id: View.PaymentOrders, label: 'Payment Orders', icon: <PaymentOrdersIcon /> },
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
        icon: <DoctrineIcon />,
    })),
    
    // --- Demo Bank Platform Suite ---
    { type: 'divider' },
    { type: 'header', label: 'Demo Bank Platform' },
    { id: View.DemoBankSocial, label: 'Social', icon: <PlatformIcon /> },
    { id: View.DemoBankERP, label: 'ERP', icon: <PlatformIcon /> },
    { id: View.DemoBankCRM, label: 'CRM', icon: <PlatformIcon /> },
    { id: View.DemoBankAPIGateway, label: 'API Gateway', icon: <PlatformIcon /> },
    { id: View.DemoBankGraphExplorer, label: 'Graph Explorer', icon: <PlatformIcon /> },
    { id: View.DemoBankDBQL, label: 'DBQL', icon: <PlatformIcon /> },
    { id: View.DemoBankCloud, label: 'Cloud', icon: <PlatformIcon /> },
    { id: View.DemoBankIdentity, label: 'Identity', icon: <PlatformIcon /> },
    { id: View.DemoBankStorage, label: 'Storage', icon: <PlatformIcon /> },
    { id: View.DemoBankCompute, label: 'Compute', icon: <PlatformIcon /> },
    { id: View.DemoBankAIPlatform, label: 'AI Platform', icon: <PlatformIcon /> },
    { id: View.DemoBankMachineLearning, label: 'Machine Learning', icon: <PlatformIcon /> },
    { id: View.DemoBankDevOps, label: 'DevOps', icon: <PlatformIcon /> },
    { id: View.DemoBankSecurityCenter, label: 'Security Center', icon: <PlatformIcon /> },
    { id: View.DemoBankComplianceHub, label: 'Compliance Hub', icon: <PlatformIcon /> },
    { id: View.DemoBankAppMarketplace, label: 'App Marketplace', icon: <PlatformIcon /> },
    { id: View.DemoBankConnect, label: 'Connect', icon: <PlatformIcon /> },
    { id: View.DemoBankEvents, label: 'Events', icon: <PlatformIcon /> },
    { id: View.DemoBankLogicApps, label: 'Logic Apps', icon: <PlatformIcon /> },
    { id: View.DemoBankFunctions, label: 'Functions', icon: <PlatformIcon /> },
    { id: View.DemoBankDataFactory, label: 'Data Factory', icon: <PlatformIcon /> },
    { id: View.DemoBankAnalytics, label: 'Analytics', icon: <PlatformIcon /> },
    { id: View.DemoBankBI, label: 'BI', icon: <PlatformIcon /> },
    { id: View.DemoBankIoTHub, label: 'IoT Hub', icon: <PlatformIcon /> },
    { id: View.DemoBankMaps, label: 'Maps', icon: <PlatformIcon /> },
    { id: View.DemoBankCommunications, label: 'Communications', icon: <PlatformIcon /> },
    { id: View.DemoBankCommerce, label: 'Commerce', icon: <PlatformIcon /> },
    { id: View.DemoBankTeams, label: 'Teams', icon: <PlatformIcon /> },
    { id: View.DemoBankCMS, label: 'CMS', icon: <PlatformIcon /> },
    { id: View.DemoBankLMS, label: 'LMS', icon: <PlatformIcon /> },
    { id: View.DemoBankHRIS, label: 'HRIS', icon: <PlatformIcon /> },
    { id: View.DemoBankProjects, label: 'Projects', icon: <PlatformIcon /> },
    { id: View.DemoBankLegalSuite, label: 'Legal Suite', icon: <PlatformIcon /> },
    { id: View.DemoBankSupplyChain, label: 'Supply Chain', icon: <PlatformIcon /> },
    { id: View.DemoBankPropTech, label: 'PropTech', icon: <PlatformIcon /> },
    { id: View.DemoBankGamingServices, label: 'Gaming Services', icon: <PlatformIcon /> },
    { id: View.DemoBankBookings, label: 'Bookings', icon: <PlatformIcon /> },
    { id: View.DemoBankCDP, label: 'CDP', icon: <PlatformIcon /> },
    { id: View.DemoBankQuantumServices, label: 'Quantum Services', icon: <PlatformIcon /> },
    { id: View.DemoBankBlockchain, label: 'Blockchain', icon: <PlatformIcon /> },
    { id: View.DemoBankGIS, label: 'GIS Platform', icon: <PlatformIcon /> },
    { id: View.DemoBankRobotics, label: 'Robotics', icon: <PlatformIcon /> },
    { id: View.DemoBankSimulations, label: 'Simulations', icon: <PlatformIcon /> },
    { id: View.DemoBankVoiceServices, label: 'Voice Services', icon: <PlatformIcon /> },
    { id: View.DemoBankSearchSuite, label: 'Search Suite', icon: <PlatformIcon /> },
    { id: View.DemoBankDigitalTwin, label: 'Digital Twin', icon: <PlatformIcon /> },
    { id: View.DemoBankWorkflowEngine, label: 'Workflow Engine', icon: <PlatformIcon /> },
    { id: View.DemoBankObservabilityPlatform, label: 'Observability', icon: <PlatformIcon /> },
    { id: View.DemoBankFeatureManagement, label: 'Feature Management', icon: <PlatformIcon /> },
    { id: View.DemoBankExperimentationPlatform, label: 'Experimentation', icon: <PlatformIcon /> },
    { id: View.DemoBankLocalizationPlatform, label: 'Localization', icon: <PlatformIcon /> },
    { id: View.DemoBankFleetManagement, label: 'Fleet Management', icon: <PlatformIcon /> },
    { id: View.DemoBankKnowledgeBase, label: 'Knowledge Base', icon: <PlatformIcon /> },
    { id: View.DemoBankMediaServices, label: 'Media Services', icon: <PlatformIcon /> },
    { id: View.DemoBankEventGrid, label: 'Event Grid', icon: <PlatformIcon /> },
    { id: View.DemoBankApiManagement, label: 'API Management', icon: <PlatformIcon /> },


    // --- Mega Dashboard Platforms ---
    { type: 'divider' },
    { type: 'header', label: 'Security & Identity' },
    { id: View.SecurityAccessControls, label: 'Access Controls', icon: <PlatformIcon /> },
    { id: View.SecurityRoleManagement, label: 'Role Management', icon: <PlatformIcon /> },
    { id: View.SecurityAuditLogs, label: 'Audit Logs', icon: <PlatformIcon /> },
    { id: View.SecurityFraudDetection, label: 'Fraud Detection', icon: <PlatformIcon /> },
    { id: View.SecurityThreatIntelligence, label: 'Threat Intelligence', icon: <PlatformIcon /> },
    { type: 'header', label: 'Finance & Banking' },
    { id: View.FinanceCardManagement, label: 'Card Management', icon: <PlatformIcon /> },
    { id: View.FinanceLoanApplications, label: 'Loan Applications', icon: <PlatformIcon /> },
    { id: View.FinanceMortgages, label: 'Mortgages', icon: <PlatformIcon /> },
    { id: View.FinanceInsuranceHub, label: 'Insurance Hub', icon: <PlatformIcon /> },
    { id: View.FinanceTaxCenter, label: 'Tax Center', icon: <PlatformIcon /> },
    { type: 'header', label: 'Advanced Analytics' },
    { id: View.AnalyticsPredictiveModels, label: 'Predictive Models', icon: <PlatformIcon /> },
    { id: View.AnalyticsRiskScoring, label: 'Risk Scoring', icon: <PlatformIcon /> },
    { id: View.AnalyticsSentimentAnalysis, label: 'Sentiment Analysis', icon: <PlatformIcon /> },
    { id: View.AnalyticsDataLakes, label: 'Data Lakes', icon: <PlatformIcon /> },
    { id: View.AnalyticsDataCatalog, label: 'Data Catalog', icon: <PlatformIcon /> },
    { type: 'header', label: 'User & Client Tools' },
    { id: View.UserClientOnboarding, label: 'Client Onboarding', icon: <PlatformIcon /> },
    { id: View.UserClientKycAml, label: 'KYC/AML', icon: <PlatformIcon /> },
    { id: View.UserClientUserInsights, label: 'User Insights', icon: <PlatformIcon /> },
    { id: View.UserClientFeedbackHub, label: 'Feedback Hub', icon: <PlatformIcon /> },
    { id: View.UserClientSupportDesk, label: 'Support Desk', icon: <PlatformIcon /> },
    { type: 'header', label: 'Developer & Integration' },
    { id: View.DeveloperSandbox, label: 'Sandbox', icon: <PlatformIcon /> },
    { id: View.DeveloperSdkDownloads, label: 'SDK Downloads', icon: <PlatformIcon /> },
    { id: View.DeveloperWebhooks, label: 'Webhooks', icon: <PlatformIcon /> },
    { id: View.DeveloperCliTools, label: 'CLI Tools', icon: <PlatformIcon /> },
    { id: View.DeveloperExtensions, label: 'Extensions', icon: <PlatformIcon /> },
    { type: 'header', label: 'Ecosystem & Connectivity' },
    { id: View.EcosystemPartnerHub, label: 'Partner Hub', icon: <PlatformIcon /> },
    { id: View.EcosystemAffiliates, label: 'Affiliates', icon: <PlatformIcon /> },
    { id: View.EcosystemIntegrationsMarketplace, label: 'Integrations', icon: <PlatformIcon /> },
    { id: View.EcosystemCrossBorderPayments, label: 'Cross-Border', icon: <PlatformIcon /> },
    { id: View.EcosystemMultiCurrency, label: 'Multi-Currency', icon: <PlatformIcon /> },
    { type: 'header', label: 'Digital Assets & Web3' },
    { id: View.DigitalAssetsNftVault, label: 'NFT Vault', icon: <PlatformIcon /> },
    { id: View.DigitalAssetsTokenIssuance, label: 'Token Issuance', icon: <PlatformIcon /> },
    { id: View.DigitalAssetsSmartContracts, label: 'Smart Contracts', icon: <PlatformIcon /> },
    { id: View.DigitalAssetsDaoGovernance, label: 'DAO Governance', icon: <PlatformIcon /> },
    { id: View.DigitalAssetsOnChainAnalytics, label: 'On-Chain Analytics', icon: <PlatformIcon /> },
    { type: 'header', label: 'Business & Growth' },
    { id: View.BusinessSalesPipeline, label: 'Sales Pipeline', icon: <PlatformIcon /> },
    { id: View.BusinessMarketingAutomation, label: 'Marketing Automation', icon: <PlatformIcon /> },
    { id: View.BusinessGrowthInsights, label: 'Growth Insights', icon: <PlatformIcon /> },
    { id: View.BusinessCompetitiveIntelligence, label: 'Comp. Intelligence', icon: <PlatformIcon /> },
    { id: View.BusinessBenchmarking, label: 'Benchmarking', icon: <PlatformIcon /> },
    { type: 'header', label: 'Regulation & Legal' },
    { id: View.RegulationLicensing, label: 'Licensing', icon: <PlatformIcon /> },
    { id: View.RegulationDisclosures, label: 'Disclosures', icon: <PlatformIcon /> },
    { id: View.RegulationLegalDocs, label: 'Legal Docs', icon: <PlatformIcon /> },
    { id: View.RegulationRegulatorySandbox, label: 'Regulatory Sandbox', icon: <PlatformIcon /> },
    { id: View.RegulationConsentManagement, label: 'Consent Management', icon: <PlatformIcon /> },
    { type: 'header', label: 'Infra & Ops' },
    { id: View.InfraContainerRegistry, label: 'Container Registry', icon: <PlatformIcon /> },
    { id: View.InfraApiThrottling, label: 'API Throttling', icon: <PlatformIcon /> },
    { id: View.InfraObservability, label: 'Observability', icon: <PlatformIcon /> },
    { id: View.InfraIncidentResponse, label: 'Incident Response', icon: <PlatformIcon /> },
    { id: View.InfraBackupRecovery, label: 'Backup & Recovery', icon: <PlatformIcon /> },

    // --- System & Settings ---
    { type: 'divider' },
    { id: View.Security, label: 'Security', icon: <SecurityIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.APIStatus, label: 'API Status', icon: <APIStatusIcon /> },
    { id: View.TheWinningVision, label: 'The Winning Vision', icon: <TheVisionIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },
];