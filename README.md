# Demo Bank: A Next-Generation Banking Dashboard

Welcome to the repository for Demo Bank, a sophisticated, AI-powered financial dashboard designed to showcase a cutting-edge user experience and a robust, scalable frontend architecture. This application serves as a comprehensive demonstration of a modern financial platform, integrating personal and corporate banking features with advanced AI capabilities.

## Core Philosophy

This project is built on the belief that a financial platform should be more than a tool—it should be an intelligent co-pilot. Our key principles are:

*   **Hyper-Personalization**: Every aspect of the user experience is tailored to the individual's financial journey.
*   **Proactive & Predictive**: Leveraging the Gemini API, the platform anticipates user needs and provides predictive insights, rather than just reporting on past data.
*   **Platform for Growth**: The architecture is designed as a full-featured ecosystem for individuals, creators, and businesses, with tools for everything from ad creation to business incubation.

## Key Features

This demo is "fully decked-out" and includes a wide array of features simulating a complete financial ecosystem:

*   **Personal Finance Suite**: Includes a dynamic dashboard, transaction management, budgeting tools, investment tracking, and financial goal setting.
*   **Corporate Finance Suite**: Features a corporate command center, payment order management, compliance tools, and AI-powered anomaly detection.
*   **AI-Powered Modules**:
    *   **Oraculum AI (`AIAdvisorView`)**: A conversational AI financial advisor for personalized guidance.
    *   **AdAstra Studio (`AIAdStudioView`)**: An AI-powered tool to generate video advertisements from text prompts using the Veo model.
    *   **Loomis Quantum (`QuantumWeaverView`)**: A business incubator that analyzes business plans and generates coaching strategies.
*   **Enterprise-Grade Integrations**: High-fidelity simulations of key financial APIs, including Plaid for account linking, Stripe for payments, and Marqeta for card issuance.
*   **Advanced UI/UX**: Features include voice control, deep personalization with AI-generated themes, custom card design, and a comprehensive, searchable navigation system.
*   **"Mega Dashboard"**: A suite of over 80 additional views demonstrating the platform's full capabilities across Security, Finance, Analytics, User Tools, Developer Hubs, and more.

## Technical Architecture

*   **Framework**: React 19
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google Gemini API (`@google/genai`) for various models including `gemini-2.5-flash` (text), `imagen-4.0-generate-001` (images), and `veo-2.0-generate-001` (video).
*   **State Management**: React Context (`DataContext`) is used to provide a centralized "wellspring of knowledge" for the entire application.
*   **Component Library**: A robust, custom `Card` component serves as the primary building block for the UI, featuring states for loading, errors, and collapsible content.
*   **Visualization**: Recharts is used for dynamic and responsive financial data charting.
*   **Modularity**: The codebase is organized by feature and domain, with a clear separation of concerns between UI components, data context, and type definitions.

## Getting Started

The application is designed to run directly in the browser. The necessary dependencies are loaded via an `importmap` in `index.html`.

1.  Ensure the `API_KEY` environment variable is correctly set up for Gemini API access.
2.  Open `index.html` in a modern web browser.

This project aims to be a benchmark for what is possible in modern frontend development and AI integration in the fintech space.