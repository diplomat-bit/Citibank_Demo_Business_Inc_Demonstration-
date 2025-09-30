import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { View } from '../types';
import { DataContext } from '../context/DataContext';
import FeatureGuard from './FeatureGuard';

// Personal Finance Views
import DashboardView from './views/personal/DashboardView';
import TransactionsView from './views/personal/TransactionsView';
import SendMoneyView from './views/personal/SendMoneyView';
import BudgetsView from './views/personal/BudgetsView';
import InvestmentsView from './InvestmentsView';
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
import PayrollView from './views/corporate/PayrollView';


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
import ApiKeysView from './views/megadashboard/developer/ApiKeysView';
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
import ModalView from './ModalView';
import ApiKeyPrompt from './ApiKeyPrompt';

/**
 * @description The root component of the application.
 * It acts as a controller or router, managing the active view and rendering the
 * appropriate child component. It also orchestrates the main layout, including
 * the Sidebar, Header, and main content area.
 */
const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [modalView, setModalView] = useState<View | null>(null);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const dataContext = useContext(DataContext);

    if (!dataContext) {
        throw new Error("App must be used within a DataProvider");
    }

    const { customBackgroundUrl, activeIllusion, isLoading, apiKey, error } = dataContext;

    const openModalView = (view: View) => {
        if (view !== modalView) {
            setPreviousView(activeView);
            setModalView(view);
        }
    };

    const closeModalView = () => {
        setModalView(null);
    };

    // Handle authentication and loading states before rendering the main app
    if (!apiKey) {
        return <ApiKeyPrompt />;
    }

    if (error) {
        return (
           <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center p-4">
               <div className="bg-gray-900 border border-red-700 rounded-xl p-8 max-w-lg text-center">
                   <h1 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h1>
                   <p className="text-gray-400 mb-6">{error}</p>
                   <p className="text-xs text-gray-500">Please ensure the backend server is running. You may need to refresh the page after starting the server.</p>
               </div>
           </div>
       );
   }
    
    /**
     * @description The main view renderer. It uses a switch statement to determine
     * which page component to render based on the `activeView` state. This acts as
     * a simple and effective client-side router.
     * @returns {React.ReactElement} The component for the currently active view.
     */
    const renderView = () => {
        // Show a loading spinner for the initial data fetch, but not during subsequent background fetches.
        // FIX: The `context` variable was not defined; it should be `dataContext`.
        if (isLoading && !modalView && dataContext.transactions.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-dashed rounded-full animate-spin"></div>
                </div>
            );
        }
        
        // The main view is now always the Dashboard
        return <DashboardView openModalView={openModalView} />;
    };

    const backgroundStyle = {
        backgroundImage: customBackgroundUrl ? `url(${customBackgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    const IllusionLayer = () => {
        if (!activeIllusion || activeIllusion === 'none') return null;
        return <div className={`absolute inset-0 z-0 ${activeIllusion}-illusion`}></div>
    };

    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-300 font-sans" style={backgroundStyle}>
            <IllusionLayer />
             <div className="relative z-10 flex min-h-screen bg-transparent">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header onMenuClick={() => {}} setActiveView={() => {}} />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                <VoiceControl setActiveView={openModalView} />
                {/* GlobalChatbot is now inside the Sidebar */}
            </div>
            {modalView && (
                <ModalView 
                    activeView={modalView}
                    previousView={previousView}
                    closeModal={closeModalView}
                    openModal={openModalView}
                />
            )}
        </div>
    );
};

export default App;
