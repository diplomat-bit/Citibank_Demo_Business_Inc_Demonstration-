# Project Specification Codex: Demo Bank

This document outlines the technical and functional specifications for the components within the Demo Bank application, a next-generation financial platform powered by the Google Gemini API.

## Core Architectural Principles

1.  **Component-Based & State-Aware**: The application is built using React, with a strong emphasis on reusable, state-aware components. The `Card.tsx` component serves as a versatile, foundational UI container with built-in states for loading, errors, and interaction.

2.  **Centralized State Management**: A global `DataContext.tsx` provides state and actions to the entire application, acting as a single source of truth. This "God-file" approach ensures data consistency and simplifies state management across complex views.

3.  **AI-Driven Functionality**: The Google Gemini API is a core dependency, deeply integrated throughout the platform. Components encapsulate AI interactions, with prompts designed to return structured JSON data (`responseSchema`) where possible to ensure predictable, reliable functionality.

4.  **Rich Data Visualization**: The application heavily utilizes `recharts` and `d3.js` to transform raw financial data into intuitive, interactive visualizations, making complex information accessible and actionable.

5.  **High-Fidelity Simulation**: The application simulates a complete financial ecosystem. This includes realistic data models (`/data/*.ts`) and high-fidelity mockups of third-party integrations (Plaid, Stripe, Marqeta) to demonstrate enterprise-readiness and a comprehensive feature set.

6.  **Feature Gating & Monetization Layer**: The `FeatureGuard.tsx` component implements a paywall system, demonstrating a clear path to monetization and feature tiering. This is a core architectural concept, not an afterthought.

7.  **GraphQL Data Layer**: The presence of `graphql.ts` indicates the use of a GraphQL API, allowing components to fetch precisely the data they need, improving performance and developer experience.

8.  **Modularity and Scalability**: The application is structured into distinct, themed views and components, managed by a central `App.tsx` router. Navigation is data-driven via `constants.tsx`, allowing for easy expansion.

---

## Component Specification Summary

### Personal Finance Suite

-   **`DashboardView` (Panopticon)**
    -   **Purpose**: The central command center. Aggregates key widgets like `BalanceSummary`, `WealthTimeline`, and `AIInsights`.
    -   **UI**: A tile-based grid layout of data visualization widgets.
    -   **AI Integration**: Features an `AIDynamicKpiButton` allowing users to generate custom analytics dashboards with natural language.
    -   **Complexity**: High.

-   **`TransactionsView` (FlowMatrix)**
    -   **Purpose**: A complete financial event history with advanced filtering and AI analysis.
    -   **UI**: A filterable, sortable data table, augmented by "Plato's Intelligence Suite"—a set of AI widgets.
    -   **AI Integration**: Gemini powers widgets that hunt for subscriptions, detect anomalies, and find tax deductions within transaction data.
    -   **Complexity**: High.

-   **`SendMoneyView` (Remitrax)**
    -   **Purpose**: A multi-rail payment portal demonstrating ISO20022 and P2P transfers.
    -   **UI**: A form secured by a high-fidelity biometric verification modal that simulates facial scanning and secure ledger processing.
    -   **Complexity**: Medium.

-   **`BudgetsView` (Allocatra)**
    -   **Purpose**: Chamber of financial discipline for creating and managing spending budgets.
    -   **UI**: Interactive radial charts for visualizing budget progress and an integrated AI Sage for advice.
    -   **AI Integration**: A streaming chat interface provides real-time, conversational budget analysis.
    -   **Complexity**: Medium.

-   **`InvestmentsView` (CapitalVista)**
    -   **Purpose**: A celestial observatory for wealth, combining portfolio analysis and growth simulation.
    -   **UI**: A comprehensive view featuring portfolio pie charts, performance bar charts, an AI growth simulator, and an ESG investing module.
    -   **Complexity**: Medium.

-   **`CryptoView` (Web3 Citadel)**
    -   **Purpose**: A hub for Web3 and cryptocurrency interactions.
    -   **UI**: High-fidelity simulations of Metamask, Stripe, and Marqeta for identity, on-ramping, and virtual card issuance.
    -   **Complexity**: High.

-   **`FinancialGoalsView` (Horizon Engine)**
    -   **Purpose**: A "cartography room" for defining and planning long-term financial goals.
    -   **UI**: A goal-setting interface where users can visualize progress and generate strategic plans.
    -   **AI Integration**: Gemini acts as an AI strategist, turning abstract dreams into actionable, step-by-step quests.
    -   **Complexity**: Medium.

### AI & Platform Suite

-   **`AIAdvisorView` (Oraculum AI)**
    -   **Purpose**: A persistent, conversational AI financial advisor.
    -   **UI**: A chat interface with contextual prompt suggestions based on user navigation history.
    -   **AI Integration**: Maintains a continuous chat session with `gemini-2.5-flash`.
    -   **Complexity**: High.

-   **`AIAdStudioView` (AdAstra Studio)**
    -   **Purpose**: Generate a complete video advertisement from a simple text prompt.
    -   **UI**: A studio layout with a prompt input and a video preview area.
    -   **AI Integration**: Uses `veo-2.0-generate-001` with an asynchronous polling mechanism for a realistic, long-running video generation experience.
    -   **Complexity**: High.

-   **`QuantumWeaverView` (Loomis Quantum)**
    -   **Purpose**: An AI-powered business incubator guiding users from idea to simulated seed funding.
    -   **UI**: A multi-stage wizard that takes a business plan and provides AI feedback, questions, and a coaching plan.
    -   **AI Integration**: Gemini analyzes business plans, provides feedback, and generates structured coaching plans.
    -   **Complexity**: High.

-   **`TheNexusView` (The Nexus)**
    -   **Purpose**: The 27th module; a living visualization of the emergent relationships between all financial entities.
    -   **UI**: An interactive D3.js force-directed graph connecting users, transactions, goals, and anomalies.
    -   **Complexity**: High.

### Corporate & Enterprise Suite

-   **`CorporateDashboardView` (Imperium Ops)**
    -   **Purpose**: A dashboard for managing corporate finance operations.
    -   **UI**: KPI cards, data tables, and charts for tracking payment orders, compliance cases, and financial anomalies.
    -   **AI Integration**: Gemini provides a high-level "AI Controller Summary" by analyzing key metrics.
    -   **Complexity**: Medium.

-   **`AnomalyDetectionView`**
    -   **Purpose**: To showcase AI-powered detection of behavioral oddities in financial data.
    -   **UI**: A list of anomalies, each with severity, risk score, and an AI-generated explanation.
    -   **AI Integration**: The core of the view is the AI's ability to explain *why* an event is suspicious.
    -   **Complexity**: Medium.

-   **The Citadel (Demo Bank Platform & Mega Dashboard)**
    -   **Purpose**: A suite of over 100 placeholder views representing a massive, scalable enterprise platform. It serves as a super-admin interface for managing every facet of the business, from cloud infrastructure and security to marketing automation and legal compliance.
    -   **UI**: Each view is a self-contained dashboard with KPIs and data visualizations.
    -   **AI Integration**: Many views feature a small, integrated AI tool (e.g., "AI Test Plan Generator", "AI Clause Explainer") to demonstrate how AI can be embedded into every business vertical.
    -   **Complexity**: Very High (as a whole system).
