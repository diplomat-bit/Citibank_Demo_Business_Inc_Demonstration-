// data/platform/paywallData.ts
import { View } from '../../types';
import { FeatureDetails } from '../../types';

export const PAYWALL_DATA: Partial<Record<View, FeatureDetails>> = {
  [View.AIAdStudio]: {
    appName: "AdAstra Studio™",
    price: 5,
    valuationLogic: "Cuts $500 wasted ad spend per campaign",
    implementationEssentials: "Gemini creative pipeline, ad API connectors, ROI forecaster",
    scalability: "Agencies x100"
  },
  [View.AIAdvisor]: {
    appName: "Oraculum AI™",
    price: 20,
    valuationLogic: "Human advisors = $200–400/hr",
    implementationEssentials: "Financial planning AI, compliance guardrails, tax/treaty reasoning",
    scalability: "Wealth firms x500"
  },
  [View.Budgets]: {
    appName: "Allocatra™",
    price: 5,
    valuationLogic: "Helps households save 5–10% income",
    implementationEssentials: "Adaptive budgets, elastic envelopes, predictive alerts",
    scalability: "Families x3"
  },
  [View.CardCustomization]: {
    appName: "PlastIQ™",
    price: 10,
    valuationLogic: "BIN sponsor replacements charge $50–100",
    implementationEssentials: "Card APIs, spend controls, dynamic CVV",
    scalability: "SMB x100"
  },
  [View.CorporateDashboard]: {
    appName: "Imperium Ops™",
    price: 25,
    valuationLogic: "Lawyers bill $500/hr for governance",
    implementationEssentials: "Resolution generator, compliance calendar, e-sign workflow",
    scalability: "Enterprise exponential"
  },
  [View.Dashboard]: {
    appName: "Panopticon™",
    price: 8,
    valuationLogic: "Saves 1 hr/day ($1k/mo value)",
    implementationEssentials: "Cross-SaaS sync, Gemini intent parsing, universal search",
    scalability: "CIO x100"
  },
  [View.FinancialGoals]: {
    appName: "Horizon Engine™",
    price: 7,
    valuationLogic: "Turns life goals → financial plans",
    implementationEssentials: "Goal-to-plan AI, milestone alerts, probability scoring",
    scalability: "Wealth mgmt x20"
  },
  [View.Investments]: {
    appName: "CapitalVista™",
    price: 6,
    valuationLogic: "Improves investment decision quality",
    implementationEssentials: "Portfolio graphs, scenario tools, insights",
    scalability: "Investor networks x10"
  },
  [View.Marketplace]: {
    appName: "Agora AI™",
    price: 12,
    valuationLogic: "Curated fintech upsell hub",
    implementationEssentials: "Vendor ranking AI, API contracts, one-click onboarding",
    scalability: "Network exponential"
  },
  [View.OpenBanking]: {
    appName: "NexusBank™",
    price: 10,
    valuationLogic: "PSD2/open banking compliance",
    implementationEssentials: "API aggregators, consent flows, real-time sync",
    scalability: "EU + US multiplier"
  },
  [View.Personalization]: {
    appName: "PersonaMorph™",
    price: 5,
    valuationLogic: "Adaptive UX lifts engagement 30%",
    implementationEssentials: "User clustering AI, UX transformers, nudges",
    scalability: "Consumer scale huge"
  },
  [View.QuantumWeaver]: {
    appName: "Loomis Quantum™",
    price: 25,
    valuationLogic: "Infra orchestration of APIs",
    implementationEssentials: "Multi-API orchestration, AI auto-wiring, resilience layer",
    scalability: "Infra exponential"
  },
  [View.RewardsHub]: {
    appName: "Incentivus™",
    price: 6,
    valuationLogic: "Rewards lift retention 20%",
    implementationEssentials: "Reward optimization AI, loyalty tracking, gamification",
    scalability: "Consumer SaaS massive"
  },
  [View.Security]: {
    appName: "AegisVault™",
    price: 15,
    valuationLogic: "Stops fraud loss ($1k per breach)",
    implementationEssentials: "Biometric auth, AI anomaly defense, compliance engine",
    scalability: "Enterprise x100"
  },
  [View.SendMoney]: {
    appName: "Remitrax™",
    price: 7,
    valuationLogic: "Cuts FX fees, instant remittance",
    implementationEssentials: "Cross-border rails, KYC/AML, AI routing",
    scalability: "Global migrant huge"
  },
  [View.TheWinningVision]: {
    appName: "Futurum™",
    price: 10,
    valuationLogic: "Future-state simulation = strategy gold",
    implementationEssentials: "Scenario AI, trend forecast, narrative builder",
    scalability: "Exec adoption high"
  },
  [View.Transactions]: {
    appName: "FlowMatrix™",
    price: 8,
    valuationLogic: "AI reconciles 100x faster",
    implementationEssentials: "Categorization AI, double-entry, predictive flows",
    scalability: "Banks + fintech infinite"
  },
};