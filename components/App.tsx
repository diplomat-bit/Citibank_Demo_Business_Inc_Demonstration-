

import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { View } from '../types';
import { DataContext } from '../context/DataContext';
import FeatureGuard from './FeatureGuard';
import AIWrapper from './AIWrapper';

// Personal Finance Views
import DashboardView from './views/personal/DashboardView';
import TransactionsView from './views/personal/TransactionsView';
import SendMoneyView from './views/personal/SendMoneyView';
import BudgetsView from './views/personal/BudgetsView';
import InvestmentsView from './views/personal/InvestmentsView';
import CryptoView from './views/personal/CryptoView';
import FinancialGoalsView from './views/personal/FinancialGoalsView';
import MarketplaceView from './views/personal/MarketplaceView';
import PersonalizationView from './views/personal/PersonalizationView';
import CardCustomizationView from './views/personal/CardCustomizationView';
import RewardsHubView from './views/personal/RewardsHubView';
import CreditHealthView from './views/personal/CreditHealthView';
import SecurityView from './views/personal/SecurityView';
import OpenBankingView from './views/personal/OpenBankingView';
import SettingsView from './views/personal/SettingsView';

// AI & Platform Views
import AIAdvisorView from './views/platform/AIAdvisorView';
import QuantumWeaverView from './views/platform/QuantumWeaverView';
import QuantumOracleView from './views/platform/QuantumOracleView';
import AIAdStudioView from './views/platform/AIAdStudioView';
import TheVisionView from './views/platform/TheVisionView';
import APIStatusView from './views/platform/APIStatusView';
import TheNexusView from './views/platform/TheNexusView'; // The 27th Module
import ConstitutionalArticleView from './views/platform/ConstitutionalArticleView';
import TheCharterView from './views/platform/TheCharterView';
import FractionalReserveView from './views/platform/FractionalReserveView';
import FinancialInstrumentForgeView from './views/platform/TheAssemblyView';


// Corporate Finance Views
import CorporateDashboardView from './views/corporate/CorporateDashboardView';
import PaymentOrdersView from './views/corporate/PaymentOrdersView';
import CounterpartiesView from './views/corporate/CounterpartiesView';
import InvoicesView from './views/corporate/InvoicesView';
import ComplianceView from './views/corporate/ComplianceView';
import AnomalyDetectionView from './views/corporate/AnomalyDetectionView';

// Demo Bank Platform Views
import DemoBankSocialView from './views/platform/DemoBankSocialView';
import DemoBankERPView from './views/platform/DemoBankERPView';
import DemoBankCRMView from './views/platform/DemoBankCRMView';
import DemoBankAPIGatewayView from './views/platform/DemoBankAPIGatewayView';
import DemoBankGraphExplorerView from './views/platform/DemoBankGraphExplorerView';
import DemoBankDBQLView from './views/platform/DemoBankDBQLView';
import DemoBankCloudView from './views/platform/DemoBankCloudView';
import DemoBankIdentityView from './views/platform/DemoBankIdentityView';
import DemoBankStorageView from './views/platform/DemoBankStorageView';
import DemoBankComputerView from './views/platform/DemoBankComputerView';
import DemoBankAIPlatformView from './views/platform/DemoBankAIPlatformView';
import DemoBankMachineLearningView from './views/platform/DemoBankMachineLearningView';
import DemoBankDevOpsView from './views/platform/DemoBankDevOpsView';
import DemoBankSecurityCenterView from './views/platform/DemoBankSecurityCenterView';
import DemoBankComplianceHubView from './views/platform/DemoBankComplianceHubView';
import DemoBankAppMarketplaceView from './views/platform/DemoBankAppMarketplaceView';
import DemoBankConnectView from './views/platform/DemoBankConnectView';
import DemoBankEventsView from './views/platform/DemoBankEventsView';
import DemoBankLogicAppsView from './views/platform/DemoBankLogicAppsView';
import DemoBankFunctionsView from './views/platform/DemoBankFunctionsView';
import DemoBankDataFactoryView from './views/platform/DemoBankDataFactoryView';
import DemoBankAnalyticsView from './views/platform/DemoBankAnalyticsView';
import DemoBankBIView from './views/platform/DemoBankBIView';
import DemoBankIoTHubView from './views/platform/DemoBankIoTHubView';
import DemoBankMapsView from './views/platform/DemoBankMapsView';
import DemoBankCommunicationsView from './views/platform/DemoBankCommunicationsView';
import DemoBankCommerceView from './views/platform/DemoBankCommerceView';
import DemoBankTeamsView from './views/platform/DemoBankTeamsView';
import DemoBankCMSView from './views/platform/DemoBankCMSView';
import DemoBankLMSView from './views/platform/DemoBankLMSView';
import DemoBankHRISView from './views/platform/DemoBankHRISView';
import DemoBankProjectsView from './views/platform/DemoBankProjectsView';
import DemoBankLegalSuiteView from './views/platform/DemoBankLegalSuiteView';
import DemoBankSupplyChainView from './views/platform/DemoBankSupplyChainView';
import DemoBankPropTechView from './views/platform/DemoBankPropTechView';
import DemoBankGamingServicesView from './views/platform/DemoBankGamingServicesView';
import DemoBankBookingsView from './views/platform/DemoBankBookingsView';
import DemoBankCDPView from './views/platform/DemoBankCDPView';
import DemoBankQuantumServicesView from './views/platform/DemoBankQuantumServicesView';
import DemoBankBlockchainView from './views/platform/DemoBankBlockchainView';
import DemoBankGISView from './views/platform/DemoBankGISView';
import DemoBankRoboticsView from './views/platform/DemoBankRoboticsView';
import DemoBankSimulationsView from './views/platform/DemoBankSimulationsView';
import DemoBankVoiceServicesView from './views/platform/DemoBankVoiceServicesView';
import DemoBankSearchSuiteView from './views/platform/DemoBankSearchSuiteView';
import DemoBankDigitalTwinView from './views/platform/DemoBankDigitalTwinView';
import DemoBankWorkflowEngineView from './views/platform/DemoBankWorkflowEngineView';
import DemoBankObservabilityPlatformView from './views/platform/DemoBankObservabilityPlatformView';
import DemoBankFeatureManagementView from './views/platform/DemoBankFeatureManagementView';
import DemoBankExperimentationPlatformView from './views/platform/DemoBankExperimentationPlatformView';
import DemoBankLocalizationPlatformView from './views/platform/DemoBankLocalizationPlatformView';
import DemoBankFleetManagementView from './views/platform/DemoBankFleetManagementView';
import DemoBankKnowledgeBaseView from './views/platform/DemoBankKnowledgeBaseView';
import DemoBankMediaServicesView from './views/platform/DemoBankMediaServicesView';
import DemoBankEventGridView from './views/platform/DemoBankEventGridView';
import DemoBankApiManagementView from './views/platform/DemoBankApiManagementView';


// Mega Dashboard Views
import AccessControlsView from './views/megadashboard/security/AccessControlsView';
import RoleManagementView from './views/megadashboard/security/RoleManagementView';
import AuditLogsView from './views/megadashboard/security/AuditLogsView';
import FraudDetectionView from './views/megadashboard/security/FraudDetectionView';
import ThreatIntelligenceView from './views/megadashboard/security/ThreatIntelligenceView';
import CardManagementView from './views/megadashboard/finance/CardManagementView';
import LoanApplicationsView from './views/megadashboard/finance/LoanApplicationsView';
import MortgagesView from './views/megadashboard/finance/MortgagesView';
import InsuranceHubView from './views/megadashboard/finance/InsuranceHubView';
import TaxCenterView from './views/megadashboard/finance/TaxCenterView';
import PredictiveModelsView from './views/megadashboard/analytics/PredictiveModelsView';
import RiskScoringView from './views/megadashboard/analytics/RiskScoringView';
import SentimentAnalysisView from './views/megadashboard/analytics/SentimentAnalysisView';
import DataLakesView from './views/megadashboard/analytics/DataLakesView';
import DataCatalogView from './views/megadashboard/analytics/DataCatalogView';
import ClientOnboardingView from './views/megadashboard/userclient/ClientOnboardingView';
import KycAmlView from './views/megadashboard/userclient/KycAmlView';
import UserInsightsView from './views/megadashboard/userclient/UserInsightsView';
import FeedbackHubView from './views/megadashboard/userclient/FeedbackHubView';
import SupportDeskView from './views/megadashboard/userclient/SupportDeskView';
import SandboxView from './views/megadashboard/developer/SandboxView';
import SdkDownloadsView from './views/megadashboard/developer/SdkDownloadsView';
import WebhooksView from './views/megadashboard/developer/WebhooksView';
import CliToolsView from './views/megadashboard/developer/CliToolsView';
import ExtensionsView from './views/megadashboard/developer/ExtensionsView';
import PartnerHubView from './views/megadashboard/ecosystem/PartnerHubView';
import AffiliatesView from './views/megadashboard/ecosystem/AffiliatesView';
import IntegrationsMarketplaceView from './views/megadashboard/ecosystem/IntegrationsMarketplaceView';
import CrossBorderPaymentsView from './views/megadashboard/ecosystem/CrossBorderPaymentsView';
import MultiCurrencyView from './views/megadashboard/ecosystem/MultiCurrencyView';
import NftVaultView from './views/megadashboard/digitalassets/NftVaultView';
import TokenIssuanceView from './views/megadashboard/digitalassets/TokenIssuanceView';
import SmartContractsView from './views/megadashboard/digitalassets/SmartContractsView';
import DaoGovernanceView from './views/megadashboard/digitalassets/DaoGovernanceView';
import OnChainAnalyticsView from './views/megadashboard/digitalassets/OnChainAnalyticsView';
import SalesPipelineView from './views/megadashboard/business/SalesPipelineView';
import MarketingAutomationView from './views/megadashboard/business/MarketingAutomationView';
import GrowthInsightsView from './views/megadashboard/business/GrowthInsightsView';
import CompetitiveIntelligenceView from './views/megadashboard/business/CompetitiveIntelligenceView';
import BenchmarkingView from './views/megadashboard/business/BenchmarkingView';
import LicensingView from './views/megadashboard/regulation/LicensingView';
import DisclosuresView from './views/megadashboard/regulation/DisclosuresView';
import LegalDocsView from './views/megadashboard/regulation/LegalDocsView';
import RegulatorySandboxView from './views/megadashboard/regulation/RegulatorySandboxView';
import ConsentManagementView from './views/megadashboard/regulation/ConsentManagementView';
import ContainerRegistryView from './views/megadashboard/infra/ContainerRegistryView';
import ApiThrottlingView from './views/megadashboard/infra/ApiThrottlingView';
import ObservabilityView from './views/megadashboard/infra/ObservabilityView';
import IncidentResponseView from './views/megadashboard/infra/IncidentResponseView';
import BackupRecoveryView from './views/megadashboard/infra/BackupRecoveryView';

// Blueprint imports
import CrisisAIManagerView from './views/blueprints/CrisisAIManagerView';
import CognitiveLoadBalancerView from './views/blueprints/CognitiveLoadBalancerView';
import HolographicMeetingScribeView from './views/blueprints/HolographicMeetingScribeView';
import QuantumProofEncryptorView from './views/blueprints/QuantumProofEncryptorView';
import EtherealMarketplaceView from './views/blueprints/EtherealMarketplaceView';
import AdaptiveUITailorView from './views/blueprints/AdaptiveUITailorView';
import UrbanSymphonyPlannerView from './views/blueprints/UrbanSymphonyPlannerView';
import PersonalHistorianAIView from './views/blueprints/PersonalHistorianAIView';
import DebateAdversaryView from './views/blueprints/DebateAdversaryView';
import CulturalAssimilationAdvisorView from './views/blueprints/CulturalAssimilationAdvisorView';
import DynamicSoundscapeGeneratorView from './views/blueprints/DynamicSoundscapeGeneratorView';
import EmergentStrategyWargamerView from './views/blueprints/EmergentStrategyWargamerView';
import EthicalGovernorView from './views/blueprints/EthicalGovernorView';
import QuantumEntanglementDebuggerView from './views/blueprints/QuantumEntanglementDebuggerView';
import LinguisticFossilFinderView from './views/blueprints/LinguisticFossilFinderView';
import ChaosTheoristView from './views/blueprints/ChaosTheoristView';
import SelfRewritingCodebaseView from './views/blueprints/SelfRewritingCodebaseView';


// Global Components
import VoiceControl from './VoiceControl';
import GlobalChatbot from './GlobalChatbot';

/**
 * @description The root component of the application.
 * It acts as a controller or router, managing the active view and rendering the
 * appropriate child component. It also orchestrates the main layout, including
 * the Sidebar, Header, and main content area.
 */
const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const dataContext = useContext(DataContext);

    if (!dataContext) {
        throw new Error("App must be used within a DataProvider");
    }

    const { customBackgroundUrl, activeIllusion } = dataContext;

    /**
     * @description A custom view setter that keeps track of the previous view.
     * This is useful for providing context to views like the AI Advisor.
     */
    const handleSetView = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
            setActiveView(view);
            // Close sidebar on navigation in mobile
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        }
    };
    
    /**
     * @description A helper function to wrap components with the FeatureGuard and AIWrapper.
     * This keeps the renderView function cleaner and implements the core of the AI integration request.
     */
    const withAI = (view: View, component: React.ReactNode) => (
      <FeatureGuard view={view}>
        <AIWrapper view={view.toString()}>{component}</AIWrapper>
      </FeatureGuard>
    );

    /**
     * @description The main view renderer. It uses a switch statement to determine
     * which page component to render based on the `activeView` state. This acts as
     * a simple and effective client-side router.
     * @returns {React.ReactElement} The component for the currently active view.
     */
    const renderView = () => {
        if (activeView.startsWith('article-')) {
            const articleNumber = parseInt(activeView.replace('article-', ''), 10);
            return withAI(activeView, <ConstitutionalArticleView articleNumber={articleNumber} />);
        }

        switch (activeView) {
            // Personal Finance
            case View.Dashboard: return withAI(View.Dashboard, <DashboardView setActiveView={handleSetView} />);
            case View.Transactions: return withAI(View.Transactions, <TransactionsView />);
            case View.SendMoney: return withAI(View.SendMoney, <SendMoneyView setActiveView={handleSetView} />);
            case View.Budgets: return withAI(View.Budgets, <BudgetsView />);
            case View.Investments: return withAI(View.Investments, <InvestmentsView />);
            case View.Crypto: return withAI(View.Crypto, <CryptoView />);
            case View.FinancialGoals: return withAI(View.FinancialGoals, <FinancialGoalsView />);
            case View.Marketplace: return withAI(View.Marketplace, <MarketplaceView />);
            case View.Personalization: return withAI(View.Personalization, <PersonalizationView />);
            case View.CardCustomization: return withAI(View.CardCustomization, <CardCustomizationView />);
            case View.RewardsHub: return withAI(View.RewardsHub, <RewardsHubView />);
            case View.CreditHealth: return withAI(View.CreditHealth, <CreditHealthView />);
            case View.Security: return withAI(View.Security, <SecurityView />);
            case View.OpenBanking: return withAI(View.OpenBanking, <OpenBankingView />);
            case View.Settings: return withAI(View.Settings, <SettingsView />);
            
            // AI & Platform
            case View.TheNexus: return withAI(View.TheNexus, <TheNexusView />);
            case View.AIAdvisor: return withAI(View.AIAdvisor, <AIAdvisorView previousView={previousView} />);
            case View.QuantumWeaver: return withAI(View.QuantumWeaver, <QuantumWeaverView />);
            case View.QuantumOracle: return withAI(View.QuantumOracle, <QuantumOracleView />);
            case View.AIAdStudio: return withAI(View.AIAdStudio, <AIAdStudioView />);
            case View.TheWinningVision: return withAI(View.TheWinningVision, <TheVisionView />);
            case View.APIStatus: return withAI(View.APIStatus, <APIStatusView />);
            
            // Corporate Finance
            case View.CorporateDashboard: return withAI(View.CorporateDashboard, <CorporateDashboardView setActiveView={handleSetView} />);
            case View.PaymentOrders: return withAI(View.PaymentOrders, <PaymentOrdersView />);
            case View.Counterparties: return withAI(View.Counterparties, <CounterpartiesView />);
            case View.Invoices: return withAI(View.Invoices, <InvoicesView />);
            case View.Compliance: return withAI(View.Compliance, <ComplianceView />);
            case View.AnomalyDetection: return withAI(View.AnomalyDetection, <AnomalyDetectionView />);

            // Demo Bank Platform
            case View.DemoBankSocial: return withAI(View.DemoBankSocial, <DemoBankSocialView />);
            case View.DemoBankERP: return withAI(View.DemoBankERP, <DemoBankERPView />);
            case View.DemoBankCRM: return withAI(View.DemoBankCRM, <DemoBankCRMView />);
            case View.DemoBankAPIGateway: return withAI(View.DemoBankAPIGateway, <DemoBankAPIGatewayView />);
            case View.DemoBankGraphExplorer: return withAI(View.DemoBankGraphExplorer, <DemoBankGraphExplorerView />);
            case View.DemoBankDBQL: return withAI(View.DemoBankDBQL, <DemoBankDBQLView />);
            case View.DemoBankCloud: return withAI(View.DemoBankCloud, <DemoBankCloudView />);
            case View.DemoBankIdentity: return withAI(View.DemoBankIdentity, <DemoBankIdentityView />);
            case View.DemoBankStorage: return withAI(View.DemoBankStorage, <DemoBankStorageView />);
            case View.DemoBankCompute: return withAI(View.DemoBankCompute, <DemoBankComputerView />);
            case View.DemoBankAIPlatform: return withAI(View.DemoBankAIPlatform, <DemoBankAIPlatformView />);
            case View.DemoBankMachineLearning: return withAI(View.DemoBankMachineLearning, <DemoBankMachineLearningView />);
            case View.DemoBankDevOps: return withAI(View.DemoBankDevOps, <DemoBankDevOpsView />);
            case View.DemoBankSecurityCenter: return withAI(View.DemoBankSecurityCenter, <DemoBankSecurityCenterView />);
            case View.DemoBankComplianceHub: return withAI(View.DemoBankComplianceHub, <DemoBankComplianceHubView />);
            case View.DemoBankAppMarketplace: return withAI(View.DemoBankAppMarketplace, <DemoBankAppMarketplaceView />);
            case View.DemoBankConnect: return withAI(View.DemoBankConnect, <DemoBankConnectView />);
            case View.DemoBankEvents: return withAI(View.DemoBankEvents, <DemoBankEventsView />);
            case View.DemoBankLogicApps: return withAI(View.DemoBankLogicApps, <DemoBankLogicAppsView />);
            case View.DemoBankFunctions: return withAI(View.DemoBankFunctions, <DemoBankFunctionsView />);
            case View.DemoBankDataFactory: return withAI(View.DemoBankDataFactory, <DemoBankDataFactoryView />);
            case View.DemoBankAnalytics: return withAI(View.DemoBankAnalytics, <DemoBankAnalyticsView />);
            case View.DemoBankBI: return withAI(View.DemoBankBI, <DemoBankBIView />);
            case View.DemoBankIoTHub: return withAI(View.DemoBankIoTHub, <DemoBankIoTHubView />);
            case View.DemoBankMaps: return withAI(View.DemoBankMaps, <DemoBankMapsView />);
            case View.DemoBankCommunications: return withAI(View.DemoBankCommunications, <DemoBankCommunicationsView />);
            case View.DemoBankCommerce: return withAI(View.DemoBankCommerce, <DemoBankCommerceView />);
            case View.DemoBankTeams: return withAI(View.DemoBankTeams, <DemoBankTeamsView />);
            case View.DemoBankCMS: return withAI(View.DemoBankCMS, <DemoBankCMSView />);
            case View.DemoBankLMS: return withAI(View.DemoBankLMS, <DemoBankLMSView />);
            case View.DemoBankHRIS: return withAI(View.DemoBankHRIS, <DemoBankHRISView />);
            case View.DemoBankProjects: return withAI(View.DemoBankProjects, <DemoBankProjectsView />);
            case View.DemoBankLegalSuite: return withAI(View.DemoBankLegalSuite, <DemoBankLegalSuiteView />);
            case View.DemoBankSupplyChain: return withAI(View.DemoBankSupplyChain, <DemoBankSupplyChainView />);
            case View.DemoBankPropTech: return withAI(View.DemoBankPropTech, <DemoBankPropTechView />);
            case View.DemoBankGamingServices: return withAI(View.DemoBankGamingServices, <DemoBankGamingServicesView />);
            case View.DemoBankBookings: return withAI(View.DemoBankBookings, <DemoBankBookingsView />);
            case View.DemoBankCDP: return withAI(View.DemoBankCDP, <DemoBankCDPView />);
            case View.DemoBankQuantumServices: return withAI(View.DemoBankQuantumServices, <DemoBankQuantumServicesView />);
            case View.DemoBankBlockchain: return withAI(View.DemoBankBlockchain, <DemoBankBlockchainView />);
            case View.DemoBankGIS: return withAI(View.DemoBankGIS, <DemoBankGISView />);
            case View.DemoBankRobotics: return withAI(View.DemoBankRobotics, <DemoBankRoboticsView />);
            case View.DemoBankSimulations: return withAI(View.DemoBankSimulations, <DemoBankSimulationsView />);
            case View.DemoBankVoiceServices: return withAI(View.DemoBankVoiceServices, <DemoBankVoiceServicesView />);
            case View.DemoBankSearchSuite: return withAI(View.DemoBankSearchSuite, <DemoBankSearchSuiteView />);
            case View.DemoBankDigitalTwin: return withAI(View.DemoBankDigitalTwin, <DemoBankDigitalTwinView />);
            case View.DemoBankWorkflowEngine: return withAI(View.DemoBankWorkflowEngine, <DemoBankWorkflowEngineView />);
            case View.DemoBankObservabilityPlatform: return withAI(View.DemoBankObservabilityPlatform, <DemoBankObservabilityPlatformView />);
            case View.DemoBankFeatureManagement: return withAI(View.DemoBankFeatureManagement, <DemoBankFeatureManagementView />);
            case View.DemoBankExperimentationPlatform: return withAI(View.DemoBankExperimentationPlatform, <DemoBankExperimentationPlatformView />);
            case View.DemoBankLocalizationPlatform: return withAI(View.DemoBankLocalizationPlatform, <DemoBankLocalizationPlatformView />);
            case View.DemoBankFleetManagement: return withAI(View.DemoBankFleetManagement, <DemoBankFleetManagementView />);
            case View.DemoBankKnowledgeBase: return withAI(View.DemoBankKnowledgeBase, <DemoBankKnowledgeBaseView />);
            case View.DemoBankMediaServices: return withAI(View.DemoBankMediaServices, <DemoBankMediaServicesView />);
            case View.DemoBankEventGrid: return withAI(View.DemoBankEventGrid, <DemoBankEventGridView />);
            case View.DemoBankApiManagement: return withAI(View.DemoBankApiManagement, <DemoBankApiManagementView />);

            // Mega Dashboard - Security & Identity
            case View.SecurityAccessControls: return withAI(View.SecurityAccessControls, <AccessControlsView />);
            case View.SecurityRoleManagement: return withAI(View.SecurityRoleManagement, <RoleManagementView />);
            case View.SecurityAuditLogs: return withAI(View.SecurityAuditLogs, <AuditLogsView />);
            case View.SecurityFraudDetection: return withAI(View.SecurityFraudDetection, <FraudDetectionView />);
            case View.SecurityThreatIntelligence: return withAI(View.SecurityThreatIntelligence, <ThreatIntelligenceView />);
            // Mega Dashboard - Finance & Banking
            case View.FinanceCardManagement: return withAI(View.FinanceCardManagement, <CardManagementView />);
            case View.FinanceLoanApplications: return withAI(View.FinanceLoanApplications, <LoanApplicationsView />);
            case View.FinanceMortgages: return withAI(View.FinanceMortgages, <MortgagesView />);
            case View.FinanceInsuranceHub: return withAI(View.FinanceInsuranceHub, <InsuranceHubView />);
            case View.FinanceTaxCenter: return withAI(View.FinanceTaxCenter, <TaxCenterView />);
            // Mega Dashboard - Advanced Analytics
            case View.AnalyticsPredictiveModels: return withAI(View.AnalyticsPredictiveModels, <PredictiveModelsView />);
            case View.AnalyticsRiskScoring: return withAI(View.AnalyticsRiskScoring, <RiskScoringView />);
            case View.AnalyticsSentimentAnalysis: return withAI(View.AnalyticsSentimentAnalysis, <SentimentAnalysisView />);
            case View.AnalyticsDataLakes: return withAI(View.AnalyticsDataLakes, <DataLakesView />);
            case View.AnalyticsDataCatalog: return withAI(View.AnalyticsDataCatalog, <DataCatalogView />);
            // Mega Dashboard - User & Client Tools
            case View.UserClientOnboarding: return withAI(View.UserClientOnboarding, <ClientOnboardingView />);
            case View.UserClientKycAml: return withAI(View.UserClientKycAml, <KycAmlView />);
            case View.UserClientUserInsights: return withAI(View.UserClientUserInsights, <UserInsightsView />);
            case View.UserClientFeedbackHub: return withAI(View.UserClientFeedbackHub, <FeedbackHubView />);
            case View.UserClientSupportDesk: return withAI(View.UserClientSupportDesk, <SupportDeskView />);
            // Mega Dashboard - Developer & Integration
            case View.DeveloperSandbox: return withAI(View.DeveloperSandbox, <SandboxView />);
            case View.DeveloperSdkDownloads: return withAI(View.DeveloperSdkDownloads, <SdkDownloadsView />);
            case View.DeveloperWebhooks: return withAI(View.DeveloperWebhooks, <WebhooksView />);
            case View.DeveloperCliTools: return withAI(View.DeveloperCliTools, <CliToolsView />);
            case View.DeveloperExtensions: return withAI(View.DeveloperExtensions, <ExtensionsView />);
            // Mega Dashboard - Ecosystem & Connectivity
            case View.EcosystemPartnerHub: return withAI(View.EcosystemPartnerHub, <PartnerHubView />);
            case View.EcosystemAffiliates: return withAI(View.EcosystemAffiliates, <AffiliatesView />);
            case View.EcosystemIntegrationsMarketplace: return withAI(View.EcosystemIntegrationsMarketplace, <IntegrationsMarketplaceView />);
            case View.EcosystemCrossBorderPayments: return withAI(View.EcosystemCrossBorderPayments, <CrossBorderPaymentsView />);
            case View.EcosystemMultiCurrency: return withAI(View.EcosystemMultiCurrency, <MultiCurrencyView />);
            // Mega Dashboard - Digital Assets & Web3
            case View.DigitalAssetsNftVault: return withAI(View.DigitalAssetsNftVault, <NftVaultView />);
            case View.DigitalAssetsTokenIssuance: return withAI(View.DigitalAssetsTokenIssuance, <TokenIssuanceView />);
            case View.DigitalAssetsSmartContracts: return withAI(View.DigitalAssetsSmartContracts, <SmartContractsView />);
            case View.DigitalAssetsDaoGovernance: return withAI(View.DigitalAssetsDaoGovernance, <DaoGovernanceView />);
            case View.DigitalAssetsOnChainAnalytics: return withAI(View.DigitalAssetsOnChainAnalytics, <OnChainAnalyticsView />);
            // Mega Dashboard - Business & Growth
            case View.BusinessSalesPipeline: return withAI(View.BusinessSalesPipeline, <SalesPipelineView />);
            case View.BusinessMarketingAutomation: return withAI(View.BusinessMarketingAutomation, <MarketingAutomationView />);
            case View.BusinessGrowthInsights: return withAI(View.BusinessGrowthInsights, <GrowthInsightsView />);
            case View.BusinessCompetitiveIntelligence: return withAI(View.BusinessCompetitiveIntelligence, <CompetitiveIntelligenceView />);
            case View.BusinessBenchmarking: return withAI(View.BusinessBenchmarking, <BenchmarkingView />);
            // Mega Dashboard - Regulation & Legal
            case View.RegulationLicensing: return withAI(View.RegulationLicensing, <LicensingView />);
            case View.RegulationDisclosures: return withAI(View.RegulationDisclosures, <DisclosuresView />);
            case View.RegulationLegalDocs: return withAI(View.RegulationLegalDocs, <LegalDocsView />);
            case View.RegulationRegulatorySandbox: return withAI(View.RegulationRegulatorySandbox, <RegulatorySandboxView />);
            case View.RegulationConsentManagement: return withAI(View.RegulationConsentManagement, <ConsentManagementView />);
            // Mega Dashboard - Infra & Ops
            case View.InfraContainerRegistry: return withAI(View.InfraContainerRegistry, <ContainerRegistryView />);
            case View.InfraApiThrottling: return withAI(View.InfraApiThrottling, <ApiThrottlingView />);
            case View.InfraObservability: return withAI(View.InfraObservability, <ObservabilityView />);
            case View.InfraIncidentResponse: return withAI(View.InfraIncidentResponse, <IncidentResponseView />);
            case View.InfraBackupRecovery: return withAI(View.InfraBackupRecovery, <BackupRecoveryView />);

            // Blueprints
            case View.CrisisAIManager: return withAI(View.CrisisAIManager, <CrisisAIManagerView />);
            case View.CognitiveLoadBalancer: return withAI(View.CognitiveLoadBalancer, <CognitiveLoadBalancerView />);
            case View.HolographicMeetingScribe: return withAI(View.HolographicMeetingScribe, <HolographicMeetingScribeView />);
            case View.QuantumProofEncryptor: return withAI(View.QuantumProofEncryptor, <QuantumProofEncryptorView />);
            case View.EtherealMarketplace: return withAI(View.EtherealMarketplace, <EtherealMarketplaceView />);
            case View.AdaptiveUITailor: return withAI(View.AdaptiveUITailor, <AdaptiveUITailorView />);
            case View.UrbanSymphonyPlanner: return withAI(View.UrbanSymphonyPlanner, <UrbanSymphonyPlannerView />);
            case View.PersonalHistorianAI: return withAI(View.PersonalHistorianAI, <PersonalHistorianAIView />);
            case View.DebateAdversary: return withAI(View.DebateAdversary, <DebateAdversaryView />);
            case View.CulturalAssimilationAdvisor: return withAI(View.CulturalAssimilationAdvisor, <CulturalAssimilationAdvisorView />);
            case View.DynamicSoundscapeGenerator: return withAI(View.DynamicSoundscapeGenerator, <DynamicSoundscapeGeneratorView />);
            case View.EmergentStrategyWargamer: return withAI(View.EmergentStrategyWargamer, <EmergentStrategyWargamerView />);
            case View.EthicalGovernor: return withAI(View.EthicalGovernor, <EthicalGovernorView />);
            case View.QuantumEntanglementDebugger: return withAI(View.QuantumEntanglementDebugger, <QuantumEntanglementDebuggerView />);
            case View.LinguisticFossilFinder: return withAI(View.LinguisticFossilFinder, <LinguisticFossilFinderView />);
            case View.ChaosTheorist: return withAI(View.ChaosTheorist, <ChaosTheoristView />);
            case View.SelfRewritingCodebase: return withAI(View.SelfRewritingCodebase, <SelfRewritingCodebaseView />);
            
            // Constitutional
            case View.TheCharter: return withAI(View.TheCharter, <TheCharterView />);
            case View.FractionalReserve: return withAI(View.FractionalReserve, <FractionalReserveView />);
            case View.FinancialInstrumentForge: return withAI(View.FinancialInstrumentForge, <FinancialInstrumentForgeView />);

            default: return withAI(View.Dashboard, <DashboardView setActiveView={handleSetView} />);
        }
    };

    const backgroundStyle = {
        backgroundImage: customBackgroundUrl ? `url(${customBackgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    const IllusionLayer = () => {
        if (!activeIllusion || activeIllusion === 'none') return null;
        
        // The actual CSS for the illusion effect is defined in index.html
        // to keep it global and avoid style tag injection on re-renders.
        return <div className={`absolute inset-0 z-0 ${activeIllusion}-illusion`}></div>
    };

    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-300 font-sans" style={backgroundStyle}>
            <IllusionLayer />
             <div className="relative z-10 flex h-screen bg-transparent">
                 <AIWrapper view="Sidebar">
                    <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                 </AIWrapper>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AIWrapper view="Header">
                        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} setActiveView={handleSetView} />
                    </AIWrapper>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                <AIWrapper view="VoiceControl">
                    <VoiceControl setActiveView={handleSetView} />
                </AIWrapper>
                <AIWrapper view="GlobalChatbot">
                    <GlobalChatbot />
                </AIWrapper>
            </div>
        </div>
    );
};

export default App;
