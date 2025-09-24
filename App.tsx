import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { View } from './types';
import { DataContext } from './context/DataContext';

// Personal Finance Views
import DashboardView from './components/views/personal/DashboardView';
// FIX: Updated component imports to point to their new locations after refactoring.
import TransactionsView from './components/views/personal/TransactionsView';
import SendMoneyView from './components/views/personal/SendMoneyView';
import BudgetsView from './components/views/personal/BudgetsView';
import InvestmentsView from './components/views/personal/InvestmentsView';
import CryptoView from './components/views/personal/CryptoView';
import FinancialGoalsView from './components/views/personal/FinancialGoalsView';
import MarketplaceView from './components/views/personal/MarketplaceView';
import PersonalizationView from './components/views/personal/PersonalizationView';
import CardCustomizationView from './components/views/personal/CardCustomizationView';
import RewardsHubView from './components/views/personal/RewardsHubView';
import CreditHealthView from './components/views/personal/CreditHealthView';
import SecurityView from './components/views/personal/SecurityView';
import OpenBankingView from './components/views/personal/OpenBankingView';
import SettingsView from './components/views/personal/SettingsView';

// AI & Platform Views
import AIAdvisorView from './components/views/platform/AIAdvisorView';
import QuantumWeaverView from './components/views/platform/QuantumWeaverView';
import AIAdStudioView from './components/views/platform/AIAdStudioView';
import TheVisionView from './components/views/platform/TheVisionView';
import APIStatusView from './components/views/platform/APIStatusView';
import TheNexusView from './components/views/platform/TheNexusView'; // The 27th Module
import TheCharterView from './components/views/platform/TheCharterView';
import FractionalReserveView from './components/views/platform/FractionalReserveView';
import FinancialInstrumentForgeView from './components/views/platform/TheAssemblyView';

// Corporate Finance Views
import CorporateDashboardView from './components/views/corporate/CorporateDashboardView';
import PaymentOrdersView from './components/views/corporate/PaymentOrdersView';
import CounterpartiesView from './components/views/corporate/CounterpartiesView';
import InvoicesView from './components/views/corporate/InvoicesView';
import ComplianceView from './components/views/corporate/ComplianceView';
import AnomalyDetectionView from './components/views/corporate/AnomalyDetectionView';

// Demo Bank Platform Views
import DemoBankSocialView from './components/views/platform/DemoBankSocialView';
import DemoBankERPView from './components/views/platform/DemoBankERPView';
import DemoBankCRMView from './components/views/platform/DemoBankCRMView';
import DemoBankAPIGatewayView from './components/views/platform/DemoBankAPIGatewayView';
import DemoBankGraphExplorerView from './components/views/platform/DemoBankGraphExplorerView';
import DemoBankDBQLView from './components/views/platform/DemoBankDBQLView';
import DemoBankCloudView from './components/views/platform/DemoBankCloudView';
import DemoBankIdentityView from './components/views/platform/DemoBankIdentityView';
import DemoBankStorageView from './components/views/platform/DemoBankStorageView';
import DemoBankComputerView from './components/views/platform/DemoBankComputerView';
import DemoBankAIPlatformView from './components/views/platform/DemoBankAIPlatformView';
import DemoBankMachineLearningView from './components/views/platform/DemoBankMachineLearningView';
import DemoBankDevOpsView from './components/views/platform/DemoBankDevOpsView';
import DemoBankSecurityCenterView from './components/views/platform/DemoBankSecurityCenterView';
import DemoBankComplianceHubView from './components/views/platform/DemoBankComplianceHubView';
import DemoBankAppMarketplaceView from './components/views/platform/DemoBankAppMarketplaceView';
import DemoBankConnectView from './components/views/platform/DemoBankConnectView';
import DemoBankEventsView from './components/views/platform/DemoBankEventsView';
import DemoBankLogicAppsView from './components/views/platform/DemoBankLogicAppsView';
import DemoBankFunctionsView from './components/views/platform/DemoBankFunctionsView';
import DemoBankDataFactoryView from './components/views/platform/DemoBankDataFactoryView';
import DemoBankAnalyticsView from './components/views/platform/DemoBankAnalyticsView';
import DemoBankBIView from './components/views/platform/DemoBankBIView';
import DemoBankIoTHubView from './components/views/platform/DemoBankIoTHubView';
import DemoBankMapsView from './components/views/platform/DemoBankMapsView';
import DemoBankCommunicationsView from './components/views/platform/DemoBankCommunicationsView';
import DemoBankCommerceView from './components/views/platform/DemoBankCommerceView';
import DemoBankTeamsView from './components/views/platform/DemoBankTeamsView';

// Mega Dashboard Views
import AccessControlsView from './components/views/megadashboard/security/AccessControlsView';
import RoleManagementView from './components/views/megadashboard/security/RoleManagementView';
import AuditLogsView from './components/views/megadashboard/security/AuditLogsView';
import FraudDetectionView from './components/views/megadashboard/security/FraudDetectionView';
import ThreatIntelligenceView from './components/views/megadashboard/security/ThreatIntelligenceView';
import CardManagementView from './components/views/megadashboard/finance/CardManagementView';
import LoanApplicationsView from './components/views/megadashboard/finance/LoanApplicationsView';
import MortgagesView from './components/views/megadashboard/finance/MortgagesView';
import InsuranceHubView from './components/views/megadashboard/finance/InsuranceHubView';
import TaxCenterView from './components/views/megadashboard/finance/TaxCenterView';
import PredictiveModelsView from './components/views/megadashboard/analytics/PredictiveModelsView';
import RiskScoringView from './components/views/megadashboard/analytics/RiskScoringView';
import SentimentAnalysisView from './components/views/megadashboard/analytics/SentimentAnalysisView';
import DataLakesView from './components/views/megadashboard/analytics/DataLakesView';
import DataCatalogView from './components/views/megadashboard/analytics/DataCatalogView';
import ClientOnboardingView from './components/views/megadashboard/userclient/ClientOnboardingView';
import KycAmlView from './components/views/megadashboard/userclient/KycAmlView';
import UserInsightsView from './components/views/megadashboard/userclient/UserInsightsView';
import FeedbackHubView from './components/views/megadashboard/userclient/FeedbackHubView';
import SupportDeskView from './components/views/megadashboard/userclient/SupportDeskView';
import SandboxView from './components/views/megadashboard/developer/SandboxView';
import SdkDownloadsView from './components/views/megadashboard/developer/SdkDownloadsView';
import WebhooksView from './components/views/megadashboard/developer/WebhooksView';
import CliToolsView from './components/views/megadashboard/developer/CliToolsView';
import ExtensionsView from './components/views/megadashboard/developer/ExtensionsView';
import PartnerHubView from './components/views/megadashboard/ecosystem/PartnerHubView';
import AffiliatesView from './components/views/megadashboard/ecosystem/AffiliatesView';
import IntegrationsMarketplaceView from './components/views/megadashboard/ecosystem/IntegrationsMarketplaceView';
import CrossBorderPaymentsView from './components/views/megadashboard/ecosystem/CrossBorderPaymentsView';
import MultiCurrencyView from './components/views/megadashboard/ecosystem/MultiCurrencyView';
import NftVaultView from './components/views/megadashboard/digitalassets/NftVaultView';
import TokenIssuanceView from './components/views/megadashboard/digitalassets/TokenIssuanceView';
import SmartContractsView from './components/views/megadashboard/digitalassets/SmartContractsView';
import DaoGovernanceView from './components/views/megadashboard/digitalassets/DaoGovernanceView';
import OnChainAnalyticsView from './components/views/megadashboard/digitalassets/OnChainAnalyticsView';
import SalesPipelineView from './components/views/megadashboard/business/SalesPipelineView';
import MarketingAutomationView from './components/views/megadashboard/business/MarketingAutomationView';
import GrowthInsightsView from './components/views/megadashboard/business/GrowthInsightsView';
import CompetitiveIntelligenceView from './components/views/megadashboard/business/CompetitiveIntelligenceView';
import BenchmarkingView from './components/views/megadashboard/business/BenchmarkingView';
import LicensingView from './components/views/megadashboard/regulation/LicensingView';
import DisclosuresView from './components/views/megadashboard/regulation/DisclosuresView';
import LegalDocsView from './components/views/megadashboard/regulation/LegalDocsView';
import RegulatorySandboxView from './components/views/megadashboard/regulation/RegulatorySandboxView';
import ConsentManagementView from './components/views/megadashboard/regulation/ConsentManagementView';
import ContainerRegistryView from './components/views/megadashboard/infra/ContainerRegistryView';
import ApiThrottlingView from './components/views/megadashboard/infra/ApiThrottlingView';
import ObservabilityView from './components/views/megadashboard/infra/ObservabilityView';
import IncidentResponseView from './components/views/megadashboard/infra/IncidentResponseView';
import BackupRecoveryView from './components/views/megadashboard/infra/BackupRecoveryView';


// Global Components
import VoiceControl from './components/VoiceControl';

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
        }
    };

    /**
     * @description The main view renderer. It uses a switch statement to determine
     * which page component to render based on the `activeView` state. This acts as
     * a simple and effective client-side router.
     * @returns {React.ReactElement} The component for the currently active view.
     */
    const renderView = () => {
        switch (activeView) {
            // Personal Finance
            case View.Dashboard: return <DashboardView setActiveView={handleSetView} />;
            case View.Transactions: return <TransactionsView />;
            case View.SendMoney: return <SendMoneyView setActiveView={handleSetView} />;
            case View.Budgets: return <BudgetsView />;
            case View.Investments: return <InvestmentsView />;
            case View.Crypto: return <CryptoView />;
            case View.FinancialGoals: return <FinancialGoalsView />;
            case View.Marketplace: return <MarketplaceView />;
            case View.Personalization: return <PersonalizationView />;
            case View.CardCustomization: return <CardCustomizationView />;
            case View.RewardsHub: return <RewardsHubView />;
            case View.CreditHealth: return <CreditHealthView />;
            case View.Security: return <SecurityView />;
            case View.OpenBanking: return <OpenBankingView />;
            case View.Settings: return <SettingsView />;
            
            // AI & Platform
            case View.TheNexus: return <TheNexusView />;
            case View.AIAdvisor: return <AIAdvisorView previousView={previousView} />;
            case View.QuantumWeaver: return <QuantumWeaverView />;
            case View.AIAdStudio: return <AIAdStudioView />;
            case View.TheWinningVision: return <TheVisionView />;
            case View.APIStatus: return <APIStatusView />;
            
            // Constitutional Modules
            case View.TheCharter: return <TheCharterView />;
            case View.FractionalReserve: return <FractionalReserveView />;
            case View.FinancialInstrumentForge: return <FinancialInstrumentForgeView />;

            // Corporate Finance
            case View.CorporateDashboard: return <CorporateDashboardView setActiveView={handleSetView} />;
            case View.PaymentOrders: return <PaymentOrdersView />;
            case View.Counterparties: return <CounterpartiesView />;
            case View.Invoices: return <InvoicesView />;
            case View.Compliance: return <ComplianceView />;
            case View.AnomalyDetection: return <AnomalyDetectionView />;

            // Demo Bank Platform
            case View.DemoBankSocial: return <DemoBankSocialView />;
            case View.DemoBankERP: return <DemoBankERPView />;
            case View.DemoBankCRM: return <DemoBankCRMView />;
            case View.DemoBankAPIGateway: return <DemoBankAPIGatewayView />;
            case View.DemoBankGraphExplorer: return <DemoBankGraphExplorerView />;
            case View.DemoBankDBQL: return <DemoBankDBQLView />;
            case View.DemoBankCloud: return <DemoBankCloudView />;
            case View.DemoBankIdentity: return <DemoBankIdentityView />;
            case View.DemoBankStorage: return <DemoBankStorageView />;
            case View.DemoBankCompute: return <DemoBankComputerView />;
            case View.DemoBankAIPlatform: return <DemoBankAIPlatformView />;
            case View.DemoBankMachineLearning: return <DemoBankMachineLearningView />;
            case View.DemoBankDevOps: return <DemoBankDevOpsView />;
            case View.DemoBankSecurityCenter: return <DemoBankSecurityCenterView />;
            case View.DemoBankComplianceHub: return <DemoBankComplianceHubView />;
            case View.DemoBankAppMarketplace: return <DemoBankAppMarketplaceView />;
            case View.DemoBankConnect: return <DemoBankConnectView />;
            case View.DemoBankEvents: return <DemoBankEventsView />;
            case View.DemoBankLogicApps: return <DemoBankLogicAppsView />;
            case View.DemoBankFunctions: return <DemoBankFunctionsView />;
            case View.DemoBankDataFactory: return <DemoBankDataFactoryView />;
            case View.DemoBankAnalytics: return <DemoBankAnalyticsView />;
            case View.DemoBankBI: return <DemoBankBIView />;
            case View.DemoBankIoTHub: return <DemoBankIoTHubView />;
            case View.DemoBankMaps: return <DemoBankMapsView />;
            case View.DemoBankCommunications: return <DemoBankCommunicationsView />;
            case View.DemoBankCommerce: return <DemoBankCommerceView />;
            case View.DemoBankTeams: return <DemoBankTeamsView />;
            
            // Mega Dashboard - Security & Identity
            case View.SecurityAccessControls: return <AccessControlsView />;
            case View.SecurityRoleManagement: return <RoleManagementView />;
            case View.SecurityAuditLogs: return <AuditLogsView />;
            case View.SecurityFraudDetection: return <FraudDetectionView />;
            case View.SecurityThreatIntelligence: return <ThreatIntelligenceView />;
            // Mega Dashboard - Finance & Banking
            case View.FinanceCardManagement: return <CardManagementView />;
            case View.FinanceLoanApplications: return <LoanApplicationsView />;
            case View.FinanceMortgages: return <MortgagesView />;
            case View.FinanceInsuranceHub: return <InsuranceHubView />;
            case View.FinanceTaxCenter: return <TaxCenterView />;
            // Mega Dashboard - Advanced Analytics
            case View.AnalyticsPredictiveModels: return <PredictiveModelsView />;
            case View.AnalyticsRiskScoring: return <RiskScoringView />;
            case View.AnalyticsSentimentAnalysis: return <SentimentAnalysisView />;
            case View.AnalyticsDataLakes: return <DataLakesView />;
            case View.AnalyticsDataCatalog: return <DataCatalogView />;
            // Mega Dashboard - User & Client Tools
            case View.UserClientOnboarding: return <ClientOnboardingView />;
            case View.UserClientKycAml: return <KycAmlView />;
            case View.UserClientUserInsights: return <UserInsightsView />;
            case View.UserClientFeedbackHub: return <FeedbackHubView />;
            case View.UserClientSupportDesk: return <SupportDeskView />;
            // Mega Dashboard - Developer & Integration
            case View.DeveloperSandbox: return <SandboxView />;
            case View.DeveloperSdkDownloads: return <SdkDownloadsView />;
            case View.DeveloperWebhooks: return <WebhooksView />;
            case View.DeveloperCliTools: return <CliToolsView />;
            case View.DeveloperExtensions: return <ExtensionsView />;
            // Mega Dashboard - Ecosystem & Connectivity
            case View.EcosystemPartnerHub: return <PartnerHubView />;
            case View.EcosystemAffiliates: return <AffiliatesView />;
            case View.EcosystemIntegrationsMarketplace: return <IntegrationsMarketplaceView />;
            case View.EcosystemCrossBorderPayments: return <CrossBorderPaymentsView />;
            case View.EcosystemMultiCurrency: return <MultiCurrencyView />;
            // Mega Dashboard - Digital Assets & Web3
            case View.DigitalAssetsNftVault: return <NftVaultView />;
            case View.DigitalAssetsTokenIssuance: return <TokenIssuanceView />;
            case View.DigitalAssetsSmartContracts: return <SmartContractsView />;
            case View.DigitalAssetsDaoGovernance: return <DaoGovernanceView />;
            case View.DigitalAssetsOnChainAnalytics: return <OnChainAnalyticsView />;
            // Mega Dashboard - Business & Growth
            case View.BusinessSalesPipeline: return <SalesPipelineView />;
            case View.BusinessMarketingAutomation: return <MarketingAutomationView />;
            case View.BusinessGrowthInsights: return <GrowthInsightsView />;
            case View.BusinessCompetitiveIntelligence: return <CompetitiveIntelligenceView />;
            case View.BusinessBenchmarking: return <BenchmarkingView />;
            // Mega Dashboard - Regulation & Legal
            case View.RegulationLicensing: return <LicensingView />;
            case View.RegulationDisclosures: return <DisclosuresView />;
            case View.RegulationLegalDocs: return <LegalDocsView />;
            case View.RegulationRegulatorySandbox: return <RegulatorySandboxView />;
            case View.RegulationConsentManagement: return <ConsentManagementView />;
            // Mega Dashboard - Infra & Ops
            case View.InfraContainerRegistry: return <ContainerRegistryView />;
            case View.InfraApiThrottling: return <ApiThrottlingView />;
            case View.InfraObservability: return <ObservabilityView />;
            case View.InfraIncidentResponse: return <IncidentResponseView />;
            case View.InfraBackupRecovery: return <BackupRecoveryView />;

            default: return <DashboardView setActiveView={handleSetView} />;
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
                 <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} setActiveView={handleSetView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                <VoiceControl setActiveView={handleSetView} />
            </div>
        </div>
    );
};

export default App;