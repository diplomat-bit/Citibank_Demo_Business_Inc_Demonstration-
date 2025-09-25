# Project Specification Codex: Demo Bank

This document outlines the technical and functional specifications for the components within the Demo Bank application.

## Core Architectural Principles

1.  **Component-Based Architecture**: The application is built using React, with a strong emphasis on reusable, state-aware components. The primary UI element is the `Card.tsx` component, which provides a consistent container with built-in states for loading, errors, and user interaction.
2.  **Centralized State Management**: A global `DataContext.tsx` provides state and actions to the entire application, acting as a single source of truth for financial data and user state.
3.  **AI-Driven Functionality**: The Google Gemini API is a core dependency. Components should encapsulate AI interactions, with prompts designed to return structured, predictable data where possible (`responseSchema`).
4.  **High-Fidelity Simulation**: The application simulates a complete financial ecosystem. This includes realistic data models (`/data/*.ts`) and high-fidelity mockups of third-party integrations (Plaid, Stripe, Marqeta) to demonstrate enterprise-readiness.
5.  **Modularity and Scalability**: The application is structured into distinct views and components, managed by a central `App.tsx` router. The navigation is data-driven via `constants.tsx`, allowing for easy expansion.

## Component Specification Summary

### 1. `Dashboard.tsx` (Panopticon)
*   **Purpose**: The central command center for the user. Aggregates key information from all other modules into a configurable grid of widgets.
*   **UI**: A tile-based grid layout. Widgets include `BalanceSummary`, `WealthTimeline`, `AIInsights`, `RecentTransactions`, etc.
*   **AI Integration**: Utilizes Gemini for an "Action Assistant" to parse user intent and suggest cross-module workflows.
*   **Complexity**: High. Involves complex state orchestration, dynamic component loading, and deep integration with `DataContext`.

### 2. `AIAdvisorView.tsx` (Oraculum AI)
*   **Purpose**: A conversational AI financial advisor.
*   **UI**: A persistent chat interface with contextual prompt suggestions based on user navigation history.
*   **AI Integration**: Maintains a continuous chat session with `gemini-2.5-flash`.
*   **Complexity**: High. Manages conversational state and streaming responses.

### 3. `AIAdStudioView.tsx` (AdAstra Studio)
*   **Purpose**: An AI-powered tool to generate video advertisements from text prompts.
*   **UI**: A studio layout with a prompt input, configuration options, and a video preview area.
*   **AI Integration**: Uses `veo-2.0-generate-001` for video generation, involving an asynchronous polling mechanism to handle long-running operations.
*   **Complexity**: High. Manages async operations and user feedback for a multi-minute generation process.

### 4. `CorporateCommandView.tsx` (Imperium Ops)
*   **Purpose**: A dashboard for managing corporate finance operations.
*   **UI**: KPI cards, data tables, and charts for tracking payment orders, compliance cases, card spending, and financial anomalies.
*   **AI Integration**: Gemini provides a high-level "AI Controller Summary" by analyzing key metrics.
*   **Complexity**: Medium. Aggregates and visualizes multiple corporate data sources.

### 5. `SecurityView.tsx` (AegisVault)
*   **Purpose**: A comprehensive security center for managing linked accounts, authentication methods, and access logs.
*   **UI**: Clean, clear settings toggles and lists. Features a high-fidelity simulation of the Plaid Link flow for connecting accounts.
*   **Complexity**: Medium. Focuses on user trust and clarity in security settings.

### 6. `SendMoneyView.tsx` (Remitrax)
*   **Purpose**: A multi-rail payment portal.
*   **UI**: A form supporting different payment methods (e.g., ISO20022, P2P). It is secured by a high-fidelity biometric verification modal that simulates facial scanning and secure ledger processing.
*   **Complexity**: Medium. Involves complex UI state for the multi-step, animated security modal.

---
*This document serves as a high-level summary. For detailed specifications, refer to the JSDoc and type definitions within each component file.*