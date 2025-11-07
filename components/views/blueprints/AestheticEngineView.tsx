/**
 * AestheticEngineView.tsx - AI-Powered Fashion Design Platform
 *
 * This module implements the core user interface and interaction logic for the Aesthetic Engine,
 * a revolutionary AI-driven platform that empowers fashion designers to rapidly ideate,
 * visualize, and refine garment concepts.
 *
 * Business Value: This component delivers multi-million dollar value by dramatically accelerating
 * the fashion design lifecycle, reducing time-to-market for new collections, and unlocking
 * unprecedented creative freedom. By leveraging agentic AI for design generation, materialization,
 * and intelligent refinement, it enables brands to achieve significant cost arbitrage in sampling
 * and prototyping, respond to market trends with unparalleled agility, and personalize design at scale.
 * Integrated with token rails for transparent resource management and digital identity for secure
 * collaboration, this platform establishes a competitive advantage through innovation, efficiency,
 * and robust governance. It transforms speculative design into a data-informed, highly efficient,
 * and commercially viable process, opening new revenue streams through faster product launches
 * and superior design quality.
 */
import React from 'react';
import Card from '../../Card';

/**
 * Interface for a user's profile, extending beyond basic authentication to include
 * commercial-grade attributes like subscription tier, token balance, and security status.
 */
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    tokenBalance: number; // Represents available design tokens/credits
    avatarUrl: string;
    settings: UserSettings;
    securityStatus: 'verified' | 'unverified' | 'pending'; // Reflects digital identity verification
    lastLogin: Date;
    publicIdentityKey?: string; // Simulated public key for digital identity
}

/**
 * Interface for user-specific application settings.
 */
export interface UserSettings {
    theme: 'dark' | 'light';
    defaultPromptLanguage: 'en' | 'es' | 'fr' | 'de';
    autoSaveEnabled: boolean;
    notificationPreferences: {
        email: boolean;
        inApp: boolean;
        sms: boolean;
    };
    preferredUnits: 'cm' | 'inch';
    mfaEnabled: boolean; // Multi-factor authentication setting
}

/**
 * Interface for a generated or refined design concept, representing a digital asset
 * in the fashion collection.
 */
export interface DesignConcept {
    id: string;
    projectId: string;
    name: string;
    prompt: string;
    imageUrl: string; // URL to the generated photorealistic mockup
    sketchUrl?: string; // URL to the generated technical sketch
    materials: DesignMaterial[];
    colors: string[]; // Hex codes or common names
    styleTags: string[];
    themeTags: string[];
    creationDate: Date;
    lastModifiedDate: Date;
    versionHistory: DesignVersion[];
    metadata: {
        aiModelVersion: string;
        generationParameters: GenerationParameters;
        resolution: string;
        renderStyle: 'photorealistic' | 'technical-sketch' | 'concept-art';
        agentReviewStatus?: 'pending' | 'reviewed' | 'actioned'; // Status of AI agent review
    };
    feedback?: UserFeedback;
    isFavorite: boolean;
    notes?: string;
    collaborators?: string[]; // User IDs of collaborators
    auditLogReferences?: string[]; // References to audit log entries for this design
}

/**
 * Interface for a specific version in a design concept's history, enabling
 * granular change tracking and rollback.
 */
export interface DesignVersion {
    versionId: string;
    timestamp: Date;
    changesSummary: string;
    imageUrl: string;
    sketchUrl?: string;
    materials: DesignMaterial[];
    colors: string[];
    actorId: string; // User or Agent ID who made the change
    actorType: 'user' | 'agent';
}

/**
 * Interface for a design material, including its properties and color variants.
 */
export interface DesignMaterial {
    id: string;
    name: string;
    type: 'fabric' | 'leather' | 'metal' | 'plastic' | 'other';
    textureUrl: string; // URL to a texture map for rendering
    properties: {
        weight: string; // e.g., "heavy", "light", "200gsm"
        composition: string; // e.g., "100% cotton", "polyester blend"
        stretch: 'none' | 'low' | 'medium' | 'high';
        finish: 'matte' | 'glossy' | 'satin';
        breathability: 'low' | 'medium' | 'high';
    };
    colorVariants: MaterialColorVariant[];
}

/**
 * Interface for a specific color variant of a design material.
 */
export interface MaterialColorVariant {
    colorName: string;
    hexCode: string;
    textureUrlModifier?: string; // e.g., a tinted version of the base texture
}

/**
 * Interface for a color palette, which can be custom or predefined.
 */
export interface ColorPalette {
    id: string;
    name: string;
    colors: string[]; // Array of hex codes
    moodTags: string[]; // e.g., "vibrant", "calm", "elegant"
    isCustom: boolean;
    userId?: string; // If custom, who created it
}

/**
 * Interface for parameters used in AI design generation, providing granular control
 * over the creative process.
 */
export interface GenerationParameters {
    styleInfluence: string[]; // e.g., ["Streetwear", "Minimalist"]
    materialPreferences: string[]; // e.g., ["Cotton", "Denim"]
    colorSchemePreference: 'warm' | 'cool' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'custom';
    detailLevel: 'low' | 'medium' | 'high' | 'ultra-fine';
    renderResolution: 'sd' | 'hd' | 'fhd' | '4k';
    lightingPreset: 'studio' | 'outdoor-day' | 'outdoor-night' | 'runway' | 'custom';
    cameraAngle: 'front' | 'back' | 'side' | '3/4' | 'top' | 'bottom';
    modelPose: 'standing' | 'walking' | 'sitting' | 'custom';
    targetGender?: 'male' | 'female' | 'unisex';
    targetAgeGroup?: 'child' | 'teen' | 'adult' | 'elderly';
    designConstraints?: string[]; // e.g., ["no zippers", "long sleeves only"]
}

/**
 * Interface for a project, serving as a container for design concepts and mood board images.
 */
export interface Project {
    id: string;
    userId: string;
    name: string;
    description: string;
    creationDate: Date;
    lastModifiedDate: Date;
    designConceptIds: string[]; // IDs of designs belonging to this project
    moodBoardImages: MoodBoardImage[];
    tags: string[];
    status: 'draft' | 'in-progress' | 'completed' | 'archived';
    auditLogReferences?: string[]; // References to audit log entries for this project
}

/**
 * Interface for an image on a mood board, used for inspiration.
 */
export interface MoodBoardImage {
    id: string;
    url: string;
    caption?: string;
    source?: string; // e.g., Pinterest, Unsplash, user upload
    uploadDate: Date;
}

/**
 * Interface for user feedback on a design, including AI-analyzed sentiment.
 */
export interface UserFeedback {
    rating: number; // 1-5 stars
    comment: string;
    timestamp: Date;
    sentiment: 'positive' | 'neutral' | 'negative'; // AI-analyzed sentiment
}

/**
 * Interface for an in-app notification, keeping users informed of key events.
 */
export interface Notification {
    id: string;
    userId: string;
    type: 'design_generated' | 'project_shared' | 'token_low' | 'update_available' | 'feedback_received' | 'agent_review_completed' | 'material_added' | 'token_purchase_success';
    message: string;
    timestamp: Date;
    isRead: boolean;
    link?: string;
}

/**
 * Interface for a payment rail, simulating real-time payment infrastructure.
 */
export interface PaymentRail {
    id: string;
    name: string;
    feeRate: number; // e.g., 0.01 for 1%
    speed: 'instant' | 'fast' | 'standard' | 'batch';
    isEnabled: boolean;
    description: string;
}

/**
 * Interface for an audit log entry, ensuring tamper-evident governance and traceability
 * of all significant actions.
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    userId: string; // User or Agent ID
    actorType: 'user' | 'agent';
    action: string; // e.g., 'DESIGN_GENERATED', 'PROJECT_CREATED', 'TOKENS_PURCHASED'
    details: Record<string, any>; // Contextual data about the action
    entityType?: 'project' | 'design' | 'material' | 'user' | 'payment_transaction';
    entityId?: string; // ID of the entity affected
    securityContext?: {
        ipAddress: string;
        userAgent: string;
        signature?: string; // Simulated cryptographic signature
    };
}

/**
 * Interface for an AI agent's review or suggestion for a design,
 * demonstrating autonomous workflow and skill integration.
 */
export interface DesignReview {
    id: string;
    designId: string;
    agentId: string;
    agentName: string;
    suggestion: string; // Natural language suggestion
    status: 'pending' | 'applied' | 'dismissed';
    timestamp: Date;
    riskScore: number; // Simulated risk score (e.g., for compliance, market viability)
    associatedChanges?: Partial<DesignConcept>; // Suggested changes to the design
}


/**
 * Global application state management for the Aesthetic Engine.
 * This state includes user data, project and design collections,
 * operational flags, and core libraries, forming the foundation
 * for a dynamic and responsive user experience.
 */
export type AppState = {
    currentUser: UserProfile | null;
    projects: Project[];
    designConcepts: DesignConcept[];
    currentProjectId: string | null;
    selectedDesignId: string | null;
    isLoading: boolean;
    error: string | null;
    notifications: Notification[];
    materialLibrary: DesignMaterial[];
    colorPalettes: ColorPalette[];
    generationHistory: { prompt: string; date: Date; success: boolean; designIds: string[] }[];
    recentPrompts: string[];
    appSettings: {
        darkMode: boolean;
        showTips: boolean;
    };
    paymentRails: PaymentRail[]; // Available payment rails for token purchases
    auditLogs: AuditLogEntry[]; // Comprehensive audit trail of system activities
    designReviews: DesignReview[]; // AI agent design reviews
    isPaymentProcessing: boolean; // Flag for ongoing token purchases
};

/**
 * Union type for all possible actions that can modify the `AppState`.
 * This robust action set allows for clear, traceable state transitions
 * across a complex application, crucial for maintainability and debugging.
 */
export type AppAction =
    | { type: 'SET_USER_PROFILE'; payload: UserProfile }
    | { type: 'LOGOUT' }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_DESIGN_CONCEPT'; payload: DesignConcept[] }
    | { type: 'UPDATE_DESIGN_CONCEPT'; payload: DesignConcept }
    | { type: 'DELETE_DESIGN_CONCEPT'; payload: string }
    | { type: 'SELECT_DESIGN_CONCEPT'; payload: string | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'UPDATE_MATERIAL_LIBRARY'; payload: DesignMaterial[] }
    | { type: 'ADD_CUSTOM_MATERIAL'; payload: DesignMaterial }
    | { type: 'UPDATE_COLOR_PALETTES'; payload: ColorPalette[] }
    | { type: 'ADD_GENERATION_HISTORY_ENTRY'; payload: AppState['generationHistory'][0] }
    | { type: 'ADD_RECENT_PROMPT'; payload: string }
    | { type: 'TOGGLE_DARK_MODE' }
    | { type: 'UPDATE_USER_SETTINGS'; payload: Partial<UserSettings> }
    | { type: 'SET_PAYMENT_RAILS'; payload: PaymentRail[] }
    | { type: 'ADD_AUDIT_LOG_ENTRY'; payload: AuditLogEntry }
    | { type: 'SET_AUDIT_LOGS'; payload: AuditLogEntry[] }
    | { type: 'ADD_DESIGN_REVIEW'; payload: DesignReview }
    | { type: 'UPDATE_DESIGN_REVIEW_STATUS'; payload: { reviewId: string; status: DesignReview['status'] } }
    | { type: 'SET_PAYMENT_PROCESSING'; payload: boolean }
    | { type: 'TOP_UP_TOKEN_BALANCE'; payload: number; }; // New action for token purchase

/**
 * Reducer function for managing the application state, ensuring predictable
 * state transformations based on dispatched actions. This centralizes state logic
 * and enhances the auditability of application behavior.
 * @param state The current application state.
 * @param action The action to be performed.
 * @returns The new application state.
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_USER_PROFILE':
            return { ...state, currentUser: action.payload };
        case 'LOGOUT':
            return { ...state, currentUser: null, projects: [], designConcepts: [], currentProjectId: null, selectedDesignId: null, notifications: [], auditLogs: [] };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
                designConcepts: state.designConcepts.map(d =>
                    action.payload.designConceptIds.includes(d.id) && d.projectId !== action.payload.id
                        ? { ...d, projectId: action.payload.id }
                        : d
                ),
            };
        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter(p => p.id !== action.payload),
                designConcepts: state.designConcepts.filter(d => d.projectId !== action.payload),
                currentProjectId: state.currentProjectId === action.payload ? null : state.currentProjectId,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_DESIGN_CONCEPT':
            return { ...state, designConcepts: [...state.designConcepts, ...action.payload] };
        case 'UPDATE_DESIGN_CONCEPT':
            return {
                ...state,
                designConcepts: state.designConcepts.map(d => (d.id === action.payload.id ? action.payload : d)),
            };
        case 'DELETE_DESIGN_CONCEPT':
            return {
                ...state,
                designConcepts: state.designConcepts.filter(d => d.id !== action.payload),
                selectedDesignId: state.selectedDesignId === action.payload ? null : state.selectedDesignId,
                projects: state.projects.map(p => ({
                    ...p,
                    designConceptIds: p.designConceptIds.filter(id => id !== action.payload),
                })),
            };
        case 'SELECT_DESIGN_CONCEPT':
            return { ...state, selectedDesignId: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [...state.notifications, action.payload] };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, isRead: true } : n
                ),
            };
        case 'UPDATE_MATERIAL_LIBRARY':
            return { ...state, materialLibrary: action.payload };
        case 'ADD_CUSTOM_MATERIAL':
            return { ...state, materialLibrary: [...state.materialLibrary, action.payload] };
        case 'UPDATE_COLOR_PALETTES':
            return { ...state, colorPalettes: action.payload };
        case 'ADD_GENERATION_HISTORY_ENTRY':
            return { ...state, generationHistory: [...state.generationHistory, action.payload] };
        case 'ADD_RECENT_PROMPT':
            // Ensure uniqueness and limit recent prompts for efficiency
            const newRecentPrompts = [action.payload, ...state.recentPrompts.filter(p => p !== action.payload)];
            return { ...state, recentPrompts: newRecentPrompts.slice(0, 10) }; // Keep last 10
        case 'TOGGLE_DARK_MODE':
            return { ...state, appSettings: { ...state.appSettings, darkMode: !state.appSettings.darkMode } };
        case 'UPDATE_USER_SETTINGS':
            if (!state.currentUser) return state;
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    settings: {
                        ...state.currentUser.settings,
                        ...action.payload,
                    },
                },
            };
        case 'SET_PAYMENT_RAILS':
            return { ...state, paymentRails: action.payload };
        case 'ADD_AUDIT_LOG_ENTRY':
            return { ...state, auditLogs: [...state.auditLogs, action.payload] };
        case 'SET_AUDIT_LOGS':
            return { ...state, auditLogs: action.payload };
        case 'ADD_DESIGN_REVIEW':
            return { ...state, designReviews: [...state.designReviews, action.payload] };
        case 'UPDATE_DESIGN_REVIEW_STATUS':
            return {
                ...state,
                designReviews: state.designReviews.map(dr =>
                    dr.id === action.payload.reviewId ? { ...dr, status: action.payload.status } : dr
                ),
            };
        case 'SET_PAYMENT_PROCESSING':
            return { ...state, isPaymentProcessing: action.payload };
        case 'TOP_UP_TOKEN_BALANCE':
            if (!state.currentUser) return state;
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    tokenBalance: state.currentUser.tokenBalance + action.payload,
                },
            };
        default:
            return state;
    }
};

/**
 * Generates a cryptographically weak but locally unique ID.
 * Suitable for in-app object keys and mock data generation.
 * In a production environment, UUID v4 or similar would be used.
 * @returns A unique string identifier.
 */
export const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Performs a deep clone of an object using JSON serialization/deserialization.
 * This is efficient for plain data objects and ensures immutability for state management.
 * @param obj The object to clone.
 * @returns A deep copy of the object.
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Formats a Date object into a readable string for user display.
 * @param date The Date object to format.
 * @returns A localized and readable date/time string.
 */
export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Calculates the token cost for design generation based on specified parameters.
 * This simulates the economic model of the token rail layer, where more complex
 * or higher-resolution generations consume more tokens, driving platform value.
 * @param params Generation parameters.
 * @returns The token cost.
 */
export const calculateGenerationCost = (params: GenerationParameters): number => {
    let cost = 5; // Base cost for basic generation (e.g., SD, low detail)
    if (params.renderResolution === 'hd') cost += 2;
    if (params.renderResolution === 'fhd') cost += 5;
    if (params.renderResolution === '4k') cost += 10;
    if (params.detailLevel === 'high') cost += 3;
    if (params.detailLevel === 'ultra-fine') cost += 7;
    if (params.renderStyle === 'technical-sketch') cost += 2; // Additional for sketch rendering
    if (params.styleInfluence.length > 2) cost += 1; // More complex prompts
    if (params.materialPreferences.length > 2) cost += 1;
    return cost;
};

/**
 * Simulates a cryptographic signature for an audit log entry.
 * In a real system, this would involve actual private key signing.
 * @param userId The ID of the user/agent performing the action.
 * @param action The action string.
 * @param timestamp The timestamp of the action.
 * @returns A simulated cryptographic signature string.
 */
export const simulateCryptographicSignature = (userId: string, action: string, timestamp: Date): string => {
    // For demonstration, a simple hash-like string based on inputs
    const data = `${userId}-${action}-${timestamp.toISOString()}-${Math.random()}`;
    return btoa(data).substring(0, 32); // Base64 encode and truncate for simplicity
};

/**
 * Simulates a delay for API calls, mimicking network latency and backend processing.
 * This enhances the realism of the mock API interactions.
 * @param min The minimum delay in milliseconds.
 * @param max The maximum delay in milliseconds.
 * @returns A Promise that resolves after the simulated delay.
 */
export const simulateApiDelay = (min = 500, max = 1500): Promise<void> => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Mock Data Definitions. These structures simulate a backend database or external
 * services, providing a consistent and testable environment for frontend development.
 * This robust mock layer is critical for rapid iteration during the build phase.
 */
export const MOCK_MATERIALS: DesignMaterial[] = [
    {
        id: 'mat_001', name: 'Cotton Jersey', type: 'fabric', textureUrl: 'https://via.placeholder.com/150/A0522D/FFFFFF?text=Cotton+Jersey',
        properties: { weight: 'medium', composition: '100% cotton', stretch: 'medium', finish: 'matte', breathability: 'high' },
        colorVariants: [
            { colorName: 'White', hexCode: '#FFFFFF' }, { colorName: 'Black', hexCode: '#000000' },
            { colorName: 'Heather Grey', hexCode: '#C0C0C0' }, { colorName: 'Navy Blue', hexCode: '#000080' }
        ]
    },
    {
        id: 'mat_002', name: 'Denim', type: 'fabric', textureUrl: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Denim',
        properties: { weight: 'heavy', composition: '98% cotton, 2% elastane', stretch: 'low', finish: 'matte', breathability: 'medium' },
        colorVariants: [
            { colorName: 'Indigo', hexCode: '#4B0082' }, { colorName: 'Light Wash', hexCode: '#ADD8E6' },
            { colorName: 'Black Denim', hexCode: '#2F4F4F' }
        ]
    },
    {
        id: 'mat_003', name: 'Vegan Leather', type: 'leather', textureUrl: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Vegan+Leather',
        properties: { weight: 'medium', composition: 'Polyurethane', stretch: 'none', finish: 'glossy', breathability: 'low' },
        colorVariants: [
            { colorName: 'Black', hexCode: '#000000' }, { colorName: 'Brown', hexCode: '#A52A2A' },
            { colorName: 'Burgundy', hexCode: '#800020' }
        ]
    },
    {
        id: 'mat_004', name: 'Technical Mesh', type: 'fabric', textureUrl: 'https://via.placeholder.com/150/696969/FFFFFF?text=Technical+Mesh',
        properties: { weight: 'light', composition: '100% polyester', stretch: 'high', finish: 'matte', breathability: 'high' },
        colorVariants: [
            { colorName: 'Black', hexCode: '#000000' }, { colorName: 'White', hexCode: '#FFFFFF' },
            { colorName: 'Fluorescent Green', hexCode: '#39FF14' }
        ]
    }
];

export const MOCK_COLOR_PALETTES: ColorPalette[] = [
    { id: 'pal_001', name: 'Urban Chic', colors: ['#2E4057', '#6A8EAE', '#C6D7EB', '#F5E6CC', '#A06D4F'], moodTags: ['modern', 'sophisticated', 'muted'], isCustom: false },
    { id: 'pal_002', name: 'Vibrant Pop', colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C738BD'], moodTags: ['energetic', 'playful', 'bold'], isCustom: false },
    { id: 'pal_003', name: 'Forest Greens', colors: ['#0A2612', '#2B543D', '#5E8F6F', '#A3C4BC', '#E0F0E8'], moodTags: ['natural', 'calm', 'earthy'], isCustom: false }
];

export const MOCK_USER_PROFILE: UserProfile = {
    id: 'user_001',
    username: 'FashionistaAI',
    email: 'designer@example.com',
    subscriptionTier: 'pro',
    tokenBalance: 1500, // Explicitly tokenBalance now
    avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FashionistaAI',
    settings: {
        theme: 'dark',
        defaultPromptLanguage: 'en',
        autoSaveEnabled: true,
        notificationPreferences: {
            email: true,
            inApp: true,
            sms: false,
        },
        preferredUnits: 'cm',
        mfaEnabled: false,
    },
    securityStatus: 'verified', // Simulate identity verification
    lastLogin: new Date(),
    publicIdentityKey: '0xabc123def456...', // Simulated public key
};

export const MOCK_PAYMENT_RAILS: PaymentRail[] = [
    { id: 'rail_fast', name: 'InstantPay Rail', feeRate: 0.01, speed: 'instant', isEnabled: true, description: 'Fastest settlement, minimal fees.' },
    { id: 'rail_batch', name: 'EcoTransfer Rail', feeRate: 0.005, speed: 'batch', isEnabled: true, description: 'Economical, settle within 24 hours.' },
    { id: 'rail_crypto', name: 'SecureChain Rail', feeRate: 0.008, speed: 'fast', isEnabled: false, description: 'Blockchain-backed transfers, higher security. Currently disabled.' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
    {
        id: generateUniqueId(), timestamp: new Date(Date.now() - 3600000 * 24 * 7), userId: MOCK_USER_PROFILE.id, actorType: 'user',
        action: 'USER_LOGIN', details: { method: 'password' }, entityType: 'user', entityId: MOCK_USER_PROFILE.id,
        securityContext: { ipAddress: '192.168.1.1', userAgent: 'Chrome/Mock' }
    },
    {
        id: generateUniqueId(), timestamp: new Date(Date.now() - 3600000 * 24 * 5), userId: MOCK_USER_PROFILE.id, actorType: 'user',
        action: 'TOKENS_PURCHASED', details: { amount: 500, rail: 'InstantPay Rail', transactionId: 'txn_mock_001' }, entityType: 'payment_transaction', entityId: 'txn_mock_001',
        securityContext: { ipAddress: '192.168.1.1', userAgent: 'Chrome/Mock', signature: simulateCryptographicSignature(MOCK_USER_PROFILE.id, 'TOKENS_PURCHASED', new Date(Date.now() - 3600000 * 24 * 5)) }
    },
    {
        id: generateUniqueId(), timestamp: new Date(Date.now() - 3600000 * 24 * 3), userId: 'agent_stylebot', actorType: 'agent',
        action: 'AI_AGENT_STARTED', details: { agentName: 'StyleBot', version: '1.2' },
        securityContext: { ipAddress: 'internal_agent_ip', userAgent: 'AestheticEngine/Agent' }
    }
];

export const MOCK_DESIGN_REVIEWS: DesignReview[] = [];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj_001',
        userId: 'user_001',
        name: 'Spring/Summer 2024 Collection',
        description: 'Casual wear designs for the upcoming spring/summer season, focusing on sustainable materials.',
        creationDate: new Date(Date.now() - 86400000 * 30), // 30 days ago
        lastModifiedDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
        designConceptIds: [], // Will be filled dynamically
        moodBoardImages: [
            { id: 'mb_img_001', url: 'https://via.placeholder.com/300x200/FFC0CB/000000?text=Floral+Pattern', uploadDate: new Date() },
            { id: 'mb_img_002', url: 'https://via.placeholder.com/300x200/B0E0E6/000000?text=Ocean+Vibes', uploadDate: new Date() },
        ],
        tags: ['spring', 'summer', 'casual', 'sustainable'],
        status: 'in-progress',
        auditLogReferences: [],
    },
    {
        id: 'proj_002',
        userId: 'user_001',
        name: 'Techwear Capsule',
        description: 'Experimental techwear designs, urban exploration theme.',
        creationDate: new Date(Date.now() - 86400000 * 10), // 10 days ago
        lastModifiedDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
        designConceptIds: [],
        moodBoardImages: [
            { id: 'mb_img_003', url: 'https://via.placeholder.com/300x200/778899/FFFFFF?text=Urban+Architecture', uploadDate: new Date() },
            { id: 'mb_img_004', url: 'https://via.placeholder.com/300x200/5F9EA0/FFFFFF?text=Waterproof+Fabric', uploadDate: new Date() },
        ],
        tags: ['techwear', 'urban', 'experimental'],
        status: 'draft',
        auditLogReferences: [],
    },
];

export const MOCK_DESIGN_CONCEPTS: DesignConcept[] = [
    {
        id: 'des_001',
        projectId: 'proj_001',
        name: 'Brutalist Hoodie - Concept 1',
        prompt: 'A streetwear hoodie inspired by brutalist architecture, oversized fit, heavy cotton, dark grey.',
        imageUrl: 'https://via.placeholder.com/600x800/696969/FFFFFF?text=Brutalist+Hoodie+Concept+1',
        sketchUrl: 'https://via.placeholder.com/600x800/FFFFFF/000000?text=Sketch+Brutalist+Hoodie+1',
        materials: [{ ...MOCK_MATERIALS[0], colorVariants: [{ colorName: 'Dark Grey', hexCode: '#36454F' }] }],
        colors: ['#36454F', '#A9A9A9'],
        styleTags: ['streetwear', 'brutalist', 'oversized'],
        themeTags: ['urban', 'architecture'],
        creationDate: new Date(Date.now() - 86400000 * 4),
        lastModifiedDate: new Date(Date.now() - 86400000 * 2),
        versionHistory: [],
        metadata: {
            aiModelVersion: 'V3.1-alpha',
            generationParameters: {
                styleInfluence: ['Streetwear', 'Brutalist'],
                materialPreferences: ['Heavy Cotton'],
                colorSchemePreference: 'monochromatic',
                detailLevel: 'high',
                renderResolution: 'hd',
                lightingPreset: 'studio',
                cameraAngle: 'front',
                modelPose: 'standing',
            },
            resolution: 'HD',
            renderStyle: 'photorealistic',
            agentReviewStatus: 'pending',
        },
        isFavorite: true,
        notes: 'Initial concept, very strong brutalist influence. Consider adding subtle distressing.',
        auditLogReferences: [],
    },
    {
        id: 'des_002',
        projectId: 'proj_001',
        name: 'Minimalist T-Shirt Dress - Concept 2',
        prompt: 'A minimalist t-shirt dress, loose fit, soft organic cotton, pastel pink.',
        imageUrl: 'https://via.placeholder.com/600x800/FFB6C1/000000?text=Minimal+Dress+Concept+2',
        sketchUrl: 'https://via.placeholder.com/600x800/FFFFFF/000000?text=Sketch+Minimal+Dress+2',
        materials: [{ ...MOCK_MATERIALS[0], colorVariants: [{ colorName: 'Pastel Pink', hexCode: '#FFD1DC' }] }],
        colors: ['#FFD1DC'],
        styleTags: ['minimalist', 'casual'],
        themeTags: ['comfort', 'soft'],
        creationDate: new Date(Date.now() - 86400000 * 3),
        lastModifiedDate: new Date(Date.now() - 86400000 * 1),
        versionHistory: [],
        metadata: {
            aiModelVersion: 'V3.1-alpha',
            generationParameters: {
                styleInfluence: ['Minimalist'],
                materialPreferences: ['Organic Cotton'],
                colorSchemePreference: 'analogous',
                detailLevel: 'medium',
                renderResolution: 'hd',
                lightingPreset: 'outdoor-day',
                cameraAngle: 'front',
                modelPose: 'walking',
            },
            resolution: 'HD',
            renderStyle: 'photorealistic',
            agentReviewStatus: 'reviewed',
        },
        isFavorite: false,
        notes: 'Good drape, but could explore more unique silhouette options.',
        auditLogReferences: [],
    },
    {
        id: 'des_003',
        projectId: 'proj_002',
        name: 'Utility Cargo Pants - Concept 1',
        prompt: 'Techwear cargo pants, ripstop nylon, multiple functional pockets, olive green, slightly baggy fit.',
        imageUrl: 'https://via.placeholder.com/600x800/6B8E23/FFFFFF?text=Utility+Pants+Concept+1',
        sketchUrl: 'https://via.placeholder.com/600x800/FFFFFF/000000?text=Sketch+Utility+Pants+1',
        materials: [{ ...MOCK_MATERIALS[3], name: 'Ripstop Nylon', colorVariants: [{ colorName: 'Olive Green', hexCode: '#6B8E23' }] }],
        colors: ['#6B8E23', '#2F4F4F'],
        styleTags: ['techwear', 'cargo', 'utility'],
        themeTags: ['outdoor', 'urban exploration'],
        creationDate: new Date(Date.now() - 86400000 * 9),
        lastModifiedDate: new Date(Date.now() - 86400000 * 7),
        versionHistory: [],
        metadata: {
            aiModelVersion: 'V3.2-beta',
            generationParameters: {
                styleInfluence: ['Techwear'],
                materialPreferences: ['Ripstop Nylon'],
                colorSchemePreference: 'monochromatic',
                detailLevel: 'high',
                renderResolution: 'fhd',
                lightingPreset: 'outdoor-night',
                cameraAngle: '3/4',
                modelPose: 'standing',
            },
            resolution: 'FHD',
            renderStyle: 'photorealistic',
            agentReviewStatus: 'actioned',
        },
        isFavorite: false,
        notes: 'Excellent pocket design. Consider integrating reflective elements.',
        auditLogReferences: [],
    },
];

// Link designs to projects
MOCK_PROJECTS[0].designConceptIds.push(MOCK_DESIGN_CONCEPTS[0].id, MOCK_DESIGN_CONCEPTS[1].id);
MOCK_PROJECTS[1].designConceptIds.push(MOCK_DESIGN_CONCEPTS[2].id);

// Example audit log entries for existing designs/projects
MOCK_DESIGN_CONCEPTS[0].auditLogReferences?.push(MOCK_AUDIT_LOGS[0].id); // Example link
MOCK_PROJECTS[0].auditLogReferences?.push(MOCK_AUDIT_LOGS[1].id); // Example link

/**
 * API Simulation Functions: These functions mimic backend API calls, providing
 * realistic asynchronous interactions without requiring a live server.
 * They manage mock data and simulate network delays, ensuring robust frontend testing.
 */

/**
 * Logs an audit activity, capturing critical system events for governance and security.
 * This function simulates cryptographic signing to ensure tamper-evident logging.
 * @param userId The ID of the user or agent initiating the action.
 * @param actorType The type of actor ('user' or 'agent').
 * @param action The specific action performed (e.g., 'DESIGN_GENERATED').
 * @param details Additional context for the action.
 * @param entityType The type of entity affected by the action.
 * @param entityId The ID of the entity affected.
 * @returns A Promise resolving to the created AuditLogEntry.
 */
export const logAuditActivity = async (
    userId: string,
    actorType: 'user' | 'agent',
    action: string,
    details: Record<string, any>,
    entityType?: 'project' | 'design' | 'material' | 'user' | 'payment_transaction',
    entityId?: string,
): Promise<AuditLogEntry> => {
    await simulateApiDelay(100, 300);
    const id = generateUniqueId();
    const timestamp = new Date();
    const entry: AuditLogEntry = {
        id,
        timestamp,
        userId,
        actorType,
        action,
        details,
        entityType,
        entityId,
        securityContext: {
            ipAddress: '127.0.0.1', // Simulate local IP
            userAgent: navigator.userAgent,
            signature: simulateCryptographicSignature(userId, action, timestamp),
        },
    };
    MOCK_AUDIT_LOGS.push(entry);
    return deepClone(entry);
};

/**
 * Fetches the user's identity profile, including their token balance and security status.
 * @param userId The ID of the user to fetch.
 * @returns A Promise resolving to the UserProfile.
 * @throws Error if user is not found.
 */
export const fetchIdentityProfile = async (userId: string): Promise<UserProfile> => {
    await simulateApiDelay();
    const user = MOCK_USER_PROFILE; // Assuming single user for mock
    if (user.id === userId) {
        return deepClone(user);
    }
    throw new Error('User not found.');
};

/**
 * Updates the user's identity profile.
 * @param profile The updated UserProfile object.
 * @returns A Promise resolving to the updated UserProfile.
 * @throws Error if user is not found for update.
 */
export const updateIdentityProfile = async (profile: UserProfile): Promise<UserProfile> => {
    await simulateApiDelay();
    if (profile.id === MOCK_USER_PROFILE.id) {
        Object.assign(MOCK_USER_PROFILE, profile); // Update mock data
        await logAuditActivity(profile.id, 'user', 'USER_PROFILE_UPDATED', { changedFields: Object.keys(profile) }, 'user', profile.id);
        return deepClone(MOCK_USER_PROFILE);
    }
    throw new Error('User not found for update.');
};

/**
 * Simulates the purchase of tokens via a selected payment rail.
 * This showcases the token rail layer and real-time payment infrastructure.
 * @param userId The ID of the user making the purchase.
 * @param amount The amount of tokens to purchase.
 * @param paymentRailId The ID of the payment rail to use.
 * @returns A Promise resolving to the updated UserProfile.
 * @throws Error for insufficient funds (simulated) or payment rail issues.
 */
export const buyTokens = async (userId: string, amount: number, paymentRailId: string): Promise<UserProfile> => {
    await simulateApiDelay(3000, 7000); // Longer delay for payment simulation

    const rail = MOCK_PAYMENT_RAILS.find(r => r.id === paymentRailId);
    if (!rail || !rail.isEnabled) {
        throw new Error(`Payment rail '${paymentRailId}' is unavailable or not enabled.`);
    }

    // Simulate payment processing / risk scoring
    const transactionId = `txn_AE_${generateUniqueId()}`;
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    const finalAmount = amount * (1 - rail.feeRate); // Deduct fees

    if (!paymentSuccess) {
        await logAuditActivity(userId, 'user', 'TOKENS_PURCHASE_FAILED', { amount, paymentRailId, transactionId, reason: 'Simulated failure' }, 'payment_transaction', transactionId);
        throw new Error('Simulated payment failed. Please try again or use a different rail.');
    }

    if (userId === MOCK_USER_PROFILE.id) {
        MOCK_USER_PROFILE.tokenBalance += finalAmount;
        await logAuditActivity(userId, 'user', 'TOKENS_PURCHASED', { amount: finalAmount, originalAmount: amount, paymentRail: rail.name, transactionId, fee: amount * rail.feeRate }, 'payment_transaction', transactionId);
        return deepClone(MOCK_USER_PROFILE);
    }
    throw new Error('User not found for token purchase.');
};

/**
 * Fetches all available payment rails.
 * @returns A Promise resolving to an array of PaymentRail.
 */
export const fetchPaymentRails = async (): Promise<PaymentRail[]> => {
    await simulateApiDelay();
    return MOCK_PAYMENT_RAILS.map(deepClone);
};

/**
 * Fetches all projects for a given user.
 * @param userId The ID of the user.
 * @returns A Promise resolving to an array of Project.
 */
export const fetchProjects = async (userId: string): Promise<Project[]> => {
    await simulateApiDelay();
    return MOCK_PROJECTS.filter(p => p.userId === userId).map(deepClone);
};

/**
 * Fetches a single project by its ID.
 * @param projectId The ID of the project.
 * @returns A Promise resolving to the Project or undefined if not found.
 */
export const fetchProjectById = async (projectId: string): Promise<Project | undefined> => {
    await simulateApiDelay();
    return deepClone(MOCK_PROJECTS.find(p => p.id === projectId));
};

/**
 * Creates a new project.
 * @param project The project data to create.
 * @param userId The ID of the user creating the project.
 * @returns A Promise resolving to the newly created Project.
 */
export const createProject = async (project: Omit<Project, 'id' | 'creationDate' | 'lastModifiedDate' | 'designConceptIds' | 'auditLogReferences'>, userId: string): Promise<Project> => {
    await simulateApiDelay();
    const newProject: Project = {
        ...project,
        id: generateUniqueId(),
        userId,
        creationDate: new Date(),
        lastModifiedDate: new Date(),
        designConceptIds: [],
        auditLogReferences: [],
    };
    MOCK_PROJECTS.push(newProject);
    const auditLog = await logAuditActivity(userId, 'user', 'PROJECT_CREATED', { projectName: newProject.name }, 'project', newProject.id);
    newProject.auditLogReferences?.push(auditLog.id);
    return deepClone(newProject);
};

/**
 * Updates an existing project.
 * @param project The updated Project object.
 * @returns A Promise resolving to the updated Project.
 * @throws Error if project is not found.
 */
export const updateProject = async (project: Project): Promise<Project> => {
    await simulateApiDelay();
    const index = MOCK_PROJECTS.findIndex(p => p.id === project.id);
    if (index > -1) {
        MOCK_PROJECTS[index] = { ...deepClone(project), lastModifiedDate: new Date() };
        await logAuditActivity(project.userId, 'user', 'PROJECT_UPDATED', { projectId: project.id, projectName: project.name }, 'project', project.id);
        return deepClone(MOCK_PROJECTS[index]);
    }
    throw new Error('Project not found for update.');
};

/**
 * Deletes a project and its associated designs.
 * @param projectId The ID of the project to delete.
 * @returns A Promise that resolves upon successful deletion.
 * @throws Error if project is not found.
 */
export const deleteProject = async (projectId: string, userId: string): Promise<void> => {
    await simulateApiDelay();
    const initialLength = MOCK_PROJECTS.length;
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        throw new Error('Project not found for deletion.');
    }
    const deletedProjectName = MOCK_PROJECTS[projectIndex].name;
    MOCK_PROJECTS.splice(projectIndex, 1);

    // Also delete associated designs
    const deletedDesignIds = MOCK_DESIGN_CONCEPTS.filter(d => d.projectId === projectId).map(d => d.id);
    MOCK_DESIGN_CONCEPTS.splice(MOCK_DESIGN_CONCEPTS.findIndex(d => d.projectId === projectId), 1);

    if (MOCK_PROJECTS.length === initialLength) {
        throw new Error('Project not found for deletion.');
    }
    await logAuditActivity(userId, 'user', 'PROJECT_DELETED', { projectId, projectName: deletedProjectName, deletedDesignCount: deletedDesignIds.length }, 'project', projectId);
};

/**
 * Fetches design concepts, optionally filtered by project ID.
 * @param projectId Optional project ID to filter designs.
 * @returns A Promise resolving to an array of DesignConcept.
 */
export const fetchDesignConcepts = async (projectId?: string): Promise<DesignConcept[]> => {
    await simulateApiDelay();
    if (projectId) {
        return MOCK_DESIGN_CONCEPTS.filter(d => d.projectId === projectId).map(deepClone);
    }
    return MOCK_DESIGN_CONCEPTS.map(deepClone); // Fetch all if no project specified
};

/**
 * Fetches a single design concept by its ID.
 * @param designId The ID of the design concept.
 * @returns A Promise resolving to the DesignConcept or undefined if not found.
 */
export const fetchDesignConceptById = async (designId: string): Promise<DesignConcept | undefined> => {
    await simulateApiDelay();
    return deepClone(MOCK_DESIGN_CONCEPTS.find(d => d.id === designId));
};

/**
 * Simulates an AI agent performing a review and offering suggestions for a design.
 * This demonstrates the agentic AI capabilities for design refinement.
 * @param designId The ID of the design to review.
 * @param userId The ID of the user requesting the review.
 * @returns A Promise resolving to the created DesignReview.
 * @throws Error if design is not found.
 */
export const simulateAgentDesignReview = async (designId: string, userId: string): Promise<DesignReview> => {
    await simulateApiDelay(2000, 4000); // Longer delay for AI processing
    const design = MOCK_DESIGN_CONCEPTS.find(d => d.id === designId);
    if (!design) {
        throw new Error('Design not found for review.');
    }

    const reviewId = generateUniqueId();
    const agentName = 'AestheticBot_v2.1';
    const suggestions = [
        `Consider a darker shade of ${design.colors[0]} for better contrast against the current material.`,
        `The current style tags could be expanded with 'Urban Techwear' for better market positioning.`,
        `Explore using a water-resistant finish for the ${design.materials[0].name} material to enhance durability.`,
        `Suggest incorporating subtle reflective piping along the seams for improved visibility and aesthetic.`,
        `The current silhouette could benefit from a more tailored fit around the waist for a modern update.`,
    ];
    const newReview: DesignReview = {
        id: reviewId,
        designId,
        agentId: 'agent_stylebot_id',
        agentName,
        suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
        status: 'pending',
        timestamp: new Date(),
        riskScore: Math.floor(Math.random() * 5) + 1, // 1-5 score
        associatedChanges: Math.random() > 0.6 ? {
            colors: ['#2C3E50', '#7F8C8D'], // Example suggested change
            styleTags: [...design.styleTags, 'Functional'],
        } : undefined,
    };
    MOCK_DESIGN_REVIEWS.push(newReview);
    design.metadata.agentReviewStatus = 'reviewed';
    await logAuditActivity(newReview.agentId, 'agent', 'AI_DESIGN_REVIEW_COMPLETED', { designId, reviewId, suggestion: newReview.suggestion.substring(0, 50) + '...' }, 'design', designId);
    return deepClone(newReview);
};

/**
 * Generates new design concepts using AI, deducting tokens from the user's balance.
 * This function integrates agentic AI (generation) and token rail (cost deduction) concepts.
 * @param prompt The natural language prompt for generation.
 * @param params The generation parameters.
 * @param userId The ID of the user requesting generation.
 * @param projectId Optional project ID to associate designs with.
 * @param numConcepts The number of design concepts to generate.
 * @returns A Promise resolving to an array of newly generated DesignConcept.
 * @throws Error for insufficient tokens.
 */
export const generateDesignConcepts = async (
    prompt: string,
    params: GenerationParameters,
    userId: string,
    projectId: string | null = null,
    numConcepts: number = 3
): Promise<DesignConcept[]> => {
    await simulateApiDelay(2000, 5000); // Longer delay for generation

    const costPerConcept = calculateGenerationCost(params);
    const totalCost = costPerConcept * numConcepts;

    if (!MOCK_USER_PROFILE || MOCK_USER_PROFILE.tokenBalance < totalCost) {
        await logAuditActivity(userId, 'user', 'DESIGN_GENERATION_FAILED', { prompt, params, numConcepts, reason: 'Insufficient Tokens' });
        throw new Error('Insufficient tokens to generate designs. Please top up your balance.');
    }

    const generatedDesigns: DesignConcept[] = [];
    for (let i = 0; i < numConcepts; i++) {
        const newDesign: DesignConcept = {
            id: generateUniqueId(),
            projectId: projectId || (MOCK_PROJECTS.length > 0 ? MOCK_PROJECTS[0].id : generateUniqueId()), // Assign to first project or new dummy if none
            name: `${prompt.substring(0, 30)}... Concept ${i + 1}`,
            prompt: prompt,
            imageUrl: `https://via.placeholder.com/600x800/${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 15))}...C${i + 1}`,
            sketchUrl: `https://via.placeholder.com/600x800/FFFFFF/000000?text=Sketch+${encodeURIComponent(prompt.substring(0, 15))}...C${i + 1}`,
            materials: [MOCK_MATERIALS[Math.floor(Math.random() * MOCK_MATERIALS.length)]],
            colors: [MOCK_COLOR_PALETTES[0].colors[Math.floor(Math.random() * MOCK_COLOR_PALETTES[0].colors.length)]],
            styleTags: params.styleInfluence,
            themeTags: [],
            creationDate: new Date(),
            lastModifiedDate: new Date(),
            versionHistory: [],
            metadata: {
                aiModelVersion: 'V3.2-stable',
                generationParameters: deepClone(params),
                resolution: params.renderResolution.toUpperCase(),
                renderStyle: Math.random() > 0.5 ? 'photorealistic' : 'technical-sketch',
                agentReviewStatus: 'pending',
            },
            isFavorite: false,
            auditLogReferences: [],
        };
        MOCK_DESIGN_CONCEPTS.push(newDesign);
        generatedDesigns.push(newDesign);

        // Update project designConceptIds
        const targetProject = MOCK_PROJECTS.find(p => p.id === newDesign.projectId);
        if (targetProject && !targetProject.designConceptIds.includes(newDesign.id)) {
            targetProject.designConceptIds.push(newDesign.id);
        }
        const auditLog = await logAuditActivity(userId, 'user', 'DESIGN_GENERATED', { designName: newDesign.name, prompt: newDesign.prompt.substring(0, 50) + '...' }, 'design', newDesign.id);
        newDesign.auditLogReferences?.push(auditLog.id);
    }

    // Deduct tokens
    MOCK_USER_PROFILE.tokenBalance -= totalCost;

    return generatedDesigns.map(deepClone);
};

/**
 * Updates an existing design concept.
 * @param design The updated DesignConcept object.
 * @returns A Promise resolving to the updated DesignConcept.
 * @throws Error if design concept is not found.
 */
export const updateDesignConcept = async (design: DesignConcept): Promise<DesignConcept> => {
    await simulateApiDelay();
    const index = MOCK_DESIGN_CONCEPTS.findIndex(d => d.id === design.id);
    if (index > -1) {
        MOCK_DESIGN_CONCEPTS[index] = { ...deepClone(design), lastModifiedDate: new Date() };
        await logAuditActivity(MOCK_USER_PROFILE.id, 'user', 'DESIGN_UPDATED', { designId: design.id, designName: design.name }, 'design', design.id);
        return deepClone(MOCK_DESIGN_CONCEPTS[index]);
    }
    throw new Error('Design concept not found for update.');
};

/**
 * Deletes a design concept.
 * @param designId The ID of the design concept to delete.
 * @returns A Promise that resolves upon successful deletion.
 * @throws Error if design concept is not found.
 */
export const deleteDesignConcept = async (designId: string, userId: string): Promise<void> => {
    await simulateApiDelay();
    const initialLength = MOCK_DESIGN_CONCEPTS.length;
    const designIndex = MOCK_DESIGN_CONCEPTS.findIndex(d => d.id === designId);
    if (designIndex === -1) {
        throw new Error('Design concept not found for deletion.');
    }
    const deletedDesignName = MOCK_DESIGN_CONCEPTS[designIndex].name;
    const deletedProjectId = MOCK_DESIGN_CONCEPTS[designIndex].projectId;

    MOCK_DESIGN_CONCEPTS.splice(designIndex, 1);
    if (MOCK_DESIGN_CONCEPTS.length === initialLength) {
        throw new Error('Design concept not found for deletion.');
    }
    // Remove from projects
    MOCK_PROJECTS.forEach(p => {
        p.designConceptIds = p.designConceptIds.filter(id => id !== designId);
    });
    await logAuditActivity(userId, 'user', 'DESIGN_DELETED', { designId, designName: deletedDesignName, projectId: deletedProjectId }, 'design', designId);
};

/**
 * Fetches the entire material library.
 * @returns A Promise resolving to an array of DesignMaterial.
 */
export const fetchMaterialLibrary = async (): Promise<DesignMaterial[]> => {
    await simulateApiDelay();
    return MOCK_MATERIALS.map(deepClone);
};

/**
 * Adds a new custom material to the library.
 * @param material The material data to add.
 * @param userId The ID of the user adding the material.
 * @returns A Promise resolving to the newly added DesignMaterial.
 */
export const addCustomMaterial = async (material: Omit<DesignMaterial, 'id'>, userId: string): Promise<DesignMaterial> => {
    await simulateApiDelay();
    const newMaterial: DesignMaterial = {
        ...material,
        id: generateUniqueId(),
    };
    MOCK_MATERIALS.push(newMaterial);
    await logAuditActivity(userId, 'user', 'MATERIAL_ADDED', { materialName: newMaterial.name, materialType: newMaterial.type }, 'material', newMaterial.id);
    return deepClone(newMaterial);
};

/**
 * Fetches all available color palettes.
 * @returns A Promise resolving to an array of ColorPalette.
 */
export const fetchColorPalettes = async (): Promise<ColorPalette[]> => {
    await simulateApiDelay();
    return MOCK_COLOR_PALETTES.map(deepClone);
};

/**
 * Adds a new custom color palette.
 * @param palette The palette data to add.
 * @param userId The ID of the user adding the palette.
 * @returns A Promise resolving to the newly added ColorPalette.
 */
export const addCustomColorPalette = async (palette: Omit<ColorPalette, 'id'>, userId: string): Promise<ColorPalette> => {
    await simulateApiDelay();
    const newPalette: ColorPalette = {
        ...palette,
        id: generateUniqueId(),
        isCustom: true,
        userId: userId,
    };
    MOCK_COLOR_PALETTES.push(newPalette);
    await logAuditActivity(userId, 'user', 'COLOR_PALETTE_ADDED', { paletteName: newPalette.name }, 'material'); // Reusing entity type
    return deepClone(newPalette);
};

/**
 * Fetches notifications for a user.
 * @param userId The ID of the user.
 * @returns A Promise resolving to an array of Notification.
 */
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
    await simulateApiDelay();
    // Simulate some notifications, including agent review notifications
    return [
        { id: 'not_001', userId, type: 'design_generated', message: 'Your latest designs are ready!', timestamp: new Date(Date.now() - 60000 * 5), isRead: false, link: '/app/designs/latest' },
        { id: 'not_002', userId, type: 'token_low', message: 'You have 100 tokens remaining. Consider topping up!', timestamp: new Date(Date.now() - 60000 * 60 * 24), isRead: true },
        { id: 'not_003', userId, type: 'agent_review_completed', message: 'AI Agent "StyleBot" completed a review for design "Brutalist Hoodie - Concept 1".', timestamp: new Date(Date.now() - 60000 * 30), isRead: false, link: `/app/designs/${MOCK_DESIGN_CONCEPTS[0].id}` },
    ];
};

/**
 * Marks a notification as read.
 * @param notificationId The ID of the notification to mark as read.
 * @returns A Promise that resolves upon successful update.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await simulateApiDelay();
    // In a real app, this would update the backend
    console.log(`Notification ${notificationId} marked as read.`);
};

/**
 * Fetches all audit logs. (Simulated, in production this would be paginated and permissioned).
 * @returns A Promise resolving to an array of AuditLogEntry.
 */
export const fetchAuditLogs = async (): Promise<AuditLogEntry[]> => {
    await simulateApiDelay();
    return MOCK_AUDIT_LOGS.map(deepClone);
};

/**
 * Fetches all design reviews. (Simulated)
 * @returns A Promise resolving to an array of DesignReview.
 */
export const fetchDesignReviews = async (): Promise<DesignReview[]> => {
    await simulateApiDelay();
    return MOCK_DESIGN_REVIEWS.map(deepClone);
};

/**
 * Custom React Hook for managing global application state.
 * This hook centralizes data fetching and state interactions, providing
 * a robust and consistent data layer for the entire application.
 * Business value: Enables rapid feature development and ensures data integrity
 * across complex UIs, reducing development costs and increasing system reliability.
 */
export const useAestheticEngineApp = () => {
    const [state, dispatch] = React.useReducer(appReducer, {
        currentUser: null,
        projects: [],
        designConcepts: [],
        currentProjectId: null,
        selectedDesignId: null,
        isLoading: false,
        error: null,
        notifications: [],
        materialLibrary: [],
        colorPalettes: [],
        generationHistory: [],
        recentPrompts: [],
        appSettings: {
            darkMode: true,
            showTips: true,
        },
        paymentRails: [],
        auditLogs: [],
        designReviews: [],
        isPaymentProcessing: false,
    });

    /**
     * Effect hook for initial application data load.
     * This ensures that core data (user profile, projects, designs, libraries)
     * is available upon component mount, providing a seamless user experience.
     */
    React.useEffect(() => {
        const initializeAppData = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                // Load user profile and apply settings
                const user = await fetchIdentityProfile(MOCK_USER_PROFILE.id);
                dispatch({ type: 'SET_USER_PROFILE', payload: user });
                dispatch({ type: 'TOGGLE_DARK_MODE' }); // Reducer handles this to flip based on initial state, then useEffect below applies user setting
                if (user.settings.theme === 'light') {
                     document.documentElement.classList.remove('dark');
                } else {
                     document.documentElement.classList.add('dark');
                }

                // Load core data: projects, designs, materials, palettes
                const projects = await fetchProjects(user.id);
                dispatch({ type: 'ADD_PROJECT', payload: projects[0] }); // Simulate adding existing projects
                dispatch({ type: 'ADD_PROJECT', payload: projects[1] });
                if (projects.length > 0) {
                    dispatch({ type: 'SET_CURRENT_PROJECT', payload: projects[0].id });
                }

                const allDesigns = await fetchDesignConcepts();
                dispatch({ type: 'ADD_DESIGN_CONCEPT', payload: allDesigns });

                const materials = await fetchMaterialLibrary();
                dispatch({ type: 'UPDATE_MATERIAL_LIBRARY', payload: materials });
                const palettes = await fetchColorPalettes();
                dispatch({ type: 'UPDATE_COLOR_PALETTES', payload: palettes });

                // Load dynamic/system data: notifications, payment rails, audit logs, design reviews
                const notifications = await fetchNotifications(user.id);
                notifications.forEach(notif => dispatch({ type: 'ADD_NOTIFICATION', payload: notif }));

                const rails = await fetchPaymentRails();
                dispatch({ type: 'SET_PAYMENT_RAILS', payload: rails });

                const logs = await fetchAuditLogs();
                dispatch({ type: 'SET_AUDIT_LOGS', payload: logs });

                const reviews = await fetchDesignReviews();
                reviews.forEach(review => dispatch({ type: 'ADD_DESIGN_REVIEW', payload: review }));

            } catch (err: any) {
                dispatch({ type: 'SET_ERROR', payload: err.message });
                console.error("Failed to initialize app data:", err);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        initializeAppData();
    }, []);

    /**
     * Effect hook to apply the dark mode setting to the document's root element.
     * This ensures the UI's theme is synchronized with the user's preference.
     */
    React.useEffect(() => {
        if (state.appSettings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.appSettings.darkMode]);

    /**
     * Derived state selectors provide optimized access to frequently used computed state values.
     * This improves performance by preventing redundant calculations and simplifies component logic.
     */
    const currentProject = state.projects.find(p => p.id === state.currentProjectId);
    const designsInCurrentProject = state.designConcepts.filter(d => d.projectId === state.currentProjectId);
    const selectedDesign = state.designConcepts.find(d => d.id === state.selectedDesignId);
    const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

    return {
        state,
        dispatch,
        currentProject,
        designsInCurrentProject,
        selectedDesign,
        unreadNotifications,
    };
};

/**
 * Custom React Hook for managing prompt input and suggestions in the design generation interface.
 * This hook encapsulates logic for text input, parameter selection, and suggestion filtering,
 * making the prompt interaction component clean and reusable.
 * Business value: Streamlines the core design generation workflow, improving user efficiency
 * and satisfaction, which directly impacts the platform's utility and adoption.
 */
export const usePromptInput = (
    recentPrompts: string[],
    onGenerate: (prompt: string, params: GenerationParameters, num: number) => Promise<void>
) => {
    const [prompt, setPrompt] = React.useState<string>('');
    const [generationParams, setGenerationParams] = React.useState<GenerationParameters>({
        styleInfluence: [], materialPreferences: [], colorSchemePreference: 'custom',
        detailLevel: 'medium', renderResolution: 'hd', lightingPreset: 'studio',
        cameraAngle: 'front', modelPose: 'standing'
    });
    const [numConcepts, setNumConcepts] = React.useState<number>(1);
    const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);

    const availableStyles = ['Streetwear', 'Minimalist', 'Bohemian', 'Gothic', 'Sporty', 'Formal', 'Vintage', 'Cyberpunk', 'Avant-Garde'];
    const availableMaterials = MOCK_MATERIALS.map(m => m.name);

    /**
     * Handles changes to the prompt text area, filtering and displaying suggestions.
     * @param e The React change event from the textarea.
     */
    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setPrompt(value);
        if (value.length > 2) {
            const suggestions = recentPrompts.filter(p => p.toLowerCase().includes(value.toLowerCase()));
            setFilteredSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    /**
     * Handles changes to individual generation parameters.
     * @param key The key of the GenerationParameters to update.
     * @param value The new value for the parameter.
     */
    const handleParamChange = (key: keyof GenerationParameters, value: any) => {
        setGenerationParams(prev => ({ ...prev, [key]: value }));
    };

    /**
     * Submits the prompt and generation parameters to initiate design generation.
     */
    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        await onGenerate(prompt, generationParams, numConcepts);
        setPrompt('');
        setShowSuggestions(false);
    };

    return {
        prompt, setPrompt,
        generationParams, handleParamChange,
        numConcepts, setNumConcepts,
        showSuggestions, setShowSuggestions,
        filteredSuggestions,
        availableStyles, availableMaterials,
        handlePromptChange, handleSubmit,
    };
};

/**
 * Custom React Hook for managing material selection and application within the design editor.
 * This hook centralizes the logic for interacting with the material library and updating a design,
 * making the material editing interface modular and efficient.
 * Business value: Enables designers to quickly iterate on material choices, accelerating
 * the design process and reducing costly physical prototyping.
 */
export const useMaterialEditor = (
    currentDesign: DesignConcept | undefined,
    materialLibrary: DesignMaterial[],
    onUpdateDesign: (design: DesignConcept) => Promise<void>
) => {
    const [selectedMaterialId, setSelectedMaterialId] = React.useState<string | null>(null);
    const [selectedColorHex, setSelectedColorHex] = React.useState<string | null>(null);

    /**
     * Effect hook to initialize selected material/color based on the current design.
     */
    React.useEffect(() => {
        if (currentDesign && currentDesign.materials.length > 0) {
            setSelectedMaterialId(currentDesign.materials[0].id);
            if (currentDesign.materials[0].colorVariants.length > 0) {
                setSelectedColorHex(currentDesign.materials[0].colorVariants[0].hexCode);
            }
        } else {
            setSelectedMaterialId(null);
            setSelectedColorHex(null);
        }
    }, [currentDesign]);

    const availableMaterials = React.useMemo(() => materialLibrary, [materialLibrary]);

    /**
     * Applies the currently selected material and color to the design.
     */
    const applyMaterialToDesign = async () => {
        if (!currentDesign || !selectedMaterialId || !selectedColorHex) return;

        const material = availableMaterials.find(m => m.id === selectedMaterialId);
        const colorVariant = material?.colorVariants.find(cv => cv.hexCode === selectedColorHex);

        if (material && colorVariant) {
            const updatedDesign: DesignConcept = deepClone(currentDesign);
            const newMaterialInstance: DesignMaterial = {
                ...deepClone(material),
                colorVariants: [deepClone(colorVariant)]
            };
            // For simplicity, replace the first material. In a complex editor, this would target specific garment parts.
            updatedDesign.materials = [newMaterialInstance];
            updatedDesign.colors = [selectedColorHex];
            updatedDesign.lastModifiedDate = new Date();
            updatedDesign.versionHistory.push({
                versionId: generateUniqueId(),
                timestamp: new Date(),
                changesSummary: `Material changed to ${newMaterialInstance.name} (${colorVariant.colorName})`,
                imageUrl: updatedDesign.imageUrl, // In real scenario, this would be a new render
                sketchUrl: updatedDesign.sketchUrl,
                materials: [deepClone(newMaterialInstance)],
                colors: updatedDesign.colors,
                actorId: MOCK_USER_PROFILE.id,
                actorType: 'user',
            });
            await onUpdateDesign(updatedDesign);
        }
    };

    return {
        selectedMaterialId,
        setSelectedMaterialId,
        selectedColorHex,
        setSelectedColorHex,
        availableMaterials,
        applyMaterialToDesign,
    };
};

/**
 * Reusable UI Components: These components serve as the building blocks for the
 * Aesthetic Engine's user interface. Designed for flexibility and reusability,
 * they ensure a consistent look and feel across the application and accelerate
 * frontend development.
 */

/**
 * A versatile Button component with predefined styling variants.
 * Business value: Ensures consistent UI/UX, accelerates development with pre-built components,
 * and improves user interaction clarity through distinct action visual cues.
 */
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' }> = ({
    children, className = '', variant = 'primary', ...props
}) => {
    const baseStyle = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        ghost: 'bg-transparent hover:bg-gray-700 text-gray-200 focus:ring-gray-500',
    };
    return (
        <button className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

/**
 * A styled Input component for text entry.
 * Business value: Provides a consistent and accessible input field, simplifying form creation
 * and enhancing data collection reliability.
 */
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
    return (
        <input
            className={`w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${className}`}
            {...props}
        />
    );
};

/**
 * A styled TextArea component for multi-line text input.
 * Business value: Offers an extensible input area for detailed descriptions and notes,
 * supporting richer data capture for design specifications.
 */
export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
    return (
        <textarea
            className={`w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${className}`}
            {...props}
        />
    );
};

/**
 * A styled Select component for dropdown menus.
 * Business value: Provides a standardized mechanism for users to choose from predefined options,
 * improving data consistency and simplifying input validation.
 */
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => {
    return (
        <select
            className={`w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

/**
 * A styled Checkbox component with an optional label.
 * Business value: Facilitates binary choices in settings and forms, enhancing user control
 * over application behavior and preferences.
 */
export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => {
    return (
        <label className={`inline-flex items-center cursor-pointer ${className}`}>
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" {...props} />
            {label && <span className="ml-2 text-gray-300">{label}</span>}
        </label>
    );
};

/**
 * A button component for tab navigation.
 * Business value: Organizes complex information into manageable sections, improving navigation
 * and user comprehension within detailed views.
 */
export const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                active
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {children}
        </button>
    );
};

/**
 * A generic Modal component for displaying content in an overlay.
 * Business value: Provides a focused interaction space for critical tasks or information,
 * preventing users from getting distracted and guiding them through workflows.
 */
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full p-6 relative`}>
                <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div className="max-h-[80vh] overflow-y-auto pr-2">{children}</div>
            </div>
        </div>
    );
};

/**
 * A LoadingSpinner component to indicate ongoing processes.
 * Business value: Improves user experience by providing visual feedback during asynchronous operations,
 * reducing perceived wait times and increasing user retention.
 */
export const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
    return (
        <div
            className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
            style={{ width: size, height: size }}
            role="status"
        >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
    );
};

/**
 * A NotificationBadge component to display unread counts.
 * Business value: Highlights important alerts, ensuring users are aware of critical updates
 * or actions required, enhancing engagement and response times.
 */
export const NotificationBadge: React.FC<{ count: number; className?: string }> = ({ count, className = '' }) => {
    if (count === 0) return null;
    return (
        <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ${className}`}>
            {count > 99 ? '99+' : count}
        </span>
    );
};

/**
 * A ProgressBar component to visualize progress of long-running operations.
 * Business value: Provides transparent feedback on task completion, managing user expectations
 * during resource-intensive operations like AI generation.
 */
export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    return (
        <div className={`w-full bg-gray-700 rounded-full h-2.5 ${className}`}>
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${clampedProgress}%` }}
            ></div>
        </div>
    );
};

/**
 * A Tag component for displaying categorized labels.
 * Business value: Organizes information visually, making it easier for users to filter,
 * categorize, and understand design attributes quickly.
 */
export const Tag: React.FC<{ children: React.ReactNode; onDelete?: () => void; className?: string }> = ({ children, onDelete, className = '' }) => {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ${className}`}>
            {children}
            {onDelete && (
                <button onClick={onDelete} className="ml-1 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500">
                    <span className="sr-only">Remove tag</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                </button>
            )}
        </span>
    );
};

/**
 * A Tooltip component for displaying contextual information on hover.
 * Business value: Provides on-demand explanations and details without cluttering the interface,
 * enhancing learnability and ease of use.
 */
export const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode; className?: string; position?: 'top' | 'bottom' | 'left' | 'right' }> = ({ content, children, className = '', position = 'top' }) => {
    const [show, setShow] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>
            {show && (
                <div className={`absolute z-10 p-2 text-sm bg-gray-700 text-white rounded-md shadow-lg whitespace-nowrap ${positionClasses[position]} ${className}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

/**
 * Displays simulated AI agent messages or suggestions.
 * Business value: Provides an intuitive way to present AI-driven insights directly within the UI,
 * enhancing user engagement with agentic capabilities.
 */
export const AgentChatBubble: React.FC<{ agentName: string; message: string; timestamp: Date; riskScore?: number; className?: string }> = ({ agentName, message, timestamp, riskScore, className = '' }) => {
    return (
        <div className={`bg-blue-800 bg-opacity-30 p-3 rounded-lg flex items-start space-x-3 text-white ${className}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AI</div>
            <div className="flex-grow">
                <p className="font-semibold text-blue-200">{agentName}</p>
                <p className="text-sm mt-1">{message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(timestamp)}</p>
                {riskScore !== undefined && (
                    <p className="text-xs mt-1">
                        Risk Score: <span className={`${riskScore > 3 ? 'text-red-400' : 'text-green-400'}`}>{riskScore}/5</span>
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * Core Application Layout Components: These components define the overall structure
 * and navigation of the Aesthetic Engine, ensuring a cohesive and intuitive user experience.
 */

/**
 * The main application Header, providing navigation, user information, and key actions.
 * Business value: Serves as the primary control center, offering quick access to user profile,
 * notifications, and global settings, essential for productivity and platform governance.
 */
export const Header: React.FC<{
    username: string;
    tokenBalance: number;
    avatarUrl: string;
    unreadNotifications: number;
    onLogout: () => void;
    onViewProfile: () => void;
    onViewNotifications: () => void;
    onToggleDarkMode: () => void;
    darkMode: boolean;
    onBuyTokens: () => void;
    onViewAuditLogs: () => void;
}> = ({ username, tokenBalance, avatarUrl, unreadNotifications, onLogout, onViewProfile, onViewNotifications, onToggleDarkMode, darkMode, onBuyTokens, onViewAuditLogs }) => (
    <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white mr-4">Aesthetic Engine</h1>
            <span className="px-3 py-1 bg-blue-700 text-white text-sm rounded-full">Tokens: {tokenBalance}</span>
            <Button variant="ghost" className="ml-2 text-sm text-blue-300 hover:text-blue-100" onClick={onBuyTokens}>Buy Tokens</Button>
        </div>
        <nav className="flex items-center space-x-4">
            <Tooltip content="Toggle Dark/Light Mode">
                <Button variant="ghost" onClick={onToggleDarkMode}>
                    {darkMode ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 4a1 1 0 01.293.707l.5 1a1 1 0 11-1.707.836L13 7.414V6a1 1 0 011-1zm-4 8a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4-4a1 1 0 01-.293-.707l-.5-1a1 1 0 111.707-.836L7 6.586V8a1 1 0 01-1 1zm0 4a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm8-8a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-4 4a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 0V2a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    )}
                </Button>
            </Tooltip>
            <Tooltip content="Notifications">
                <Button variant="ghost" onClick={onViewNotifications} className="relative">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    <NotificationBadge count={unreadNotifications} />
                </Button>
            </Tooltip>
            <Tooltip content="System Audit Logs">
                 <Button variant="ghost" onClick={onViewAuditLogs}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6zm1 6a1 1 0 110 2H7a1 1 0 110-2h.001zm0 4a1 1 0 110 2H7a1 1 0 110-2h.001zm5-4a1 1 0 110 2h-2a1 1 0 110-2h2zm0 4a1 1 0 110 2h-2a1 1 0 110-2h2z" clipRule="evenodd"></path></svg>
                 </Button>
            </Tooltip>
            <Tooltip content="Profile & Settings">
                <img src={avatarUrl} alt={username} className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-blue-500" onClick={onViewProfile} />
            </Tooltip>
            <Button variant="secondary" onClick={onLogout}>Logout</Button>
        </nav>
    </header>
);

/**
 * The application Sidebar, managing project selection and creation.
 * Business value: Organizes project-based workflows, enabling designers to manage multiple
 * collections efficiently, fostering project growth and client satisfaction.
 */
export const Sidebar: React.FC<{
    projects: Project[];
    currentProjectId: string | null;
    onSelectProject: (id: string | null) => void;
    onNewProject: (project: Omit<Project, 'id' | 'creationDate' | 'lastModifiedDate' | 'designConceptIds' | 'auditLogReferences'>) => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: string) => void;
    userId: string;
}> = ({ projects, currentProjectId, onSelectProject, onNewProject, onEditProject, onDeleteProject, userId }) => {
    const [showProjectModal, setShowProjectModal] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const [projectName, setProjectName] = React.useState('');
    const [projectDesc, setProjectDesc] = React.useState('');

    /**
     * Effect hook to synchronize modal input fields with the `editingProject` state.
     */
    React.useEffect(() => {
        if (editingProject) {
            setProjectName(editingProject.name);
            setProjectDesc(editingProject.description);
        } else {
            setProjectName('');
            setProjectDesc('');
        }
    }, [editingProject]);

    /**
     * Opens the project creation modal.
     */
    const handleOpenCreateProject = () => {
        setEditingProject(null);
        setShowProjectModal(true);
    };

    /**
     * Opens the project editing modal for a specific project.
     * @param project The project to edit.
     */
    const handleOpenEditProject = (project: Project) => {
        setEditingProject(project);
        setShowProjectModal(true);
    };

    /**
     * Handles saving a new or updated project.
     */
    const handleSaveProject = async () => {
        if (!projectName.trim()) return;
        const projectData = { name: projectName, description: projectDesc, tags: [], moodBoardImages: [], status: 'draft' as Project['status'] };
        if (editingProject) {
            await onEditProject({ ...editingProject, ...projectData, lastModifiedDate: new Date() });
        } else {
            await onNewProject(projectData);
        }
        setShowProjectModal(false);
    };

    return (
        <aside className="w-64 bg-gray-900 p-4 border-r border-gray-700 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
            <Button onClick={handleOpenCreateProject} className="mb-4 w-full">
                + New Project
            </Button>
            <ul className="flex-grow space-y-2 overflow-y-auto">
                {projects.map(project => (
                    <li key={project.id} className="group flex items-center justify-between">
                        <Button
                            variant={currentProjectId === project.id ? 'primary' : 'ghost'}
                            onClick={() => onSelectProject(project.id)}
                            className="w-full text-left justify-start"
                        >
                            {project.name}
                        </Button>
                        <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip content="Edit Project">
                                <Button variant="ghost" className="p-1 h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleOpenEditProject(project)}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-9.586 2.828L10 12l-2 2-6 2 2-6 2-2z"></path></svg>
                                </Button>
                            </Tooltip>
                            <Tooltip content="Delete Project">
                                <Button variant="danger" className="p-1 h-8 w-8 text-gray-400 hover:text-white" onClick={() => onDeleteProject(project.id)}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm.002 6.5A1 1 0 108 14h.001a1 1 0 000-2H8a1 1 0 00-1 1zm4 0a1 1 0 101-1h.001a1 1 0 000-2H12a1 1 0 00-1 1z" clipRule="evenodd"></path></svg>
                                </Button>
                            </Tooltip>
                        </div>
                    </li>
                ))}
            </ul>
            <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title={editingProject ? 'Edit Project' : 'Create New Project'}>
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-300">Project Name</span>
                        <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Summer Collection 2024" />
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Description</span>
                        <TextArea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} rows={3} placeholder="A brief description of your project" />
                    </label>
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                        <Button onClick={handleSaveProject}>Save Project</Button>
                    </div>
                </div>
            </Modal>
        </aside>
    );
};

/**
 * Section for inputting AI generation prompts and parameters.
 * Business value: This is the core interface for interacting with the agentic AI design system.
 * It provides intuitive controls for generating designs, managing costs (token expenditure),
 * and accessing advanced AI capabilities, directly contributing to design velocity and innovation.
 */
export const PromptInputSection: React.FC<{
    prompt: string;
    handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    showSuggestions: boolean;
    filteredSuggestions: string[];
    setPrompt: (p: string) => void;
    setShowSuggestions: (show: boolean) => void;
    generationParams: GenerationParameters;
    handleParamChange: (key: keyof GenerationParameters, value: any) => void;
    numConcepts: number;
    setNumConcepts: (num: number) => void;
    availableStyles: string[];
    availableMaterials: string[];
    handleSubmit: () => void;
    isLoading: boolean;
    currentTokenBalance: number;
    estimatedCost: number;
}> = ({
    prompt, handlePromptChange, showSuggestions, filteredSuggestions, setPrompt, setShowSuggestions,
    generationParams, handleParamChange, numConcepts, setNumConcepts, availableStyles, availableMaterials,
    handleSubmit, isLoading, currentTokenBalance, estimatedCost
}) => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const promptInputRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (showSuggestions && promptInputRef.current) {
            // Logic to position suggestions could be added here if needed for more complex UI
        }
    }, [showSuggestions]);

    return (
        <Card title="Generate New Design Concepts" className="mb-6">
            <div className="relative mb-4">
                <TextArea
                    ref={promptInputRef}
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Describe your garment (e.g., 'a cyberpunk jacket with LED accents, dark matte fabric')"
                    rows={3}
                    disabled={isLoading}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredSuggestions.map((s, i) => (
                            <div
                                key={i}
                                className="p-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                                onClick={() => {
                                    setPrompt(s);
                                    setShowSuggestions(false);
                                    promptInputRef.current?.focus();
                                }}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Number of Concepts:</span>
                    <Input
                        type="number"
                        value={numConcepts}
                        onChange={(e) => setNumConcepts(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))} // Limit to 1-5
                        min="1"
                        max="5"
                        className="w-20"
                        disabled={isLoading}
                    />
                </div>
                <Button variant="ghost" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </Button>
            </div>

            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-700 rounded-md">
                    <label className="block">
                        <span className="text-gray-300">Style Influence</span>
                        <Select
                            multiple
                            value={generationParams.styleInfluence}
                            onChange={(e) => handleParamChange('styleInfluence', Array.from(e.target.selectedOptions, option => option.value))}
                            className="h-24"
                            disabled={isLoading}
                        >
                            {availableStyles.map(style => <option key={style} value={style}>{style}</option>)}
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Material Preferences</span>
                        <Select
                            multiple
                            value={generationParams.materialPreferences}
                            onChange={(e) => handleParamChange('materialPreferences', Array.from(e.target.selectedOptions, option => option.value))}
                            className="h-24"
                            disabled={isLoading}
                        >
                            {availableMaterials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Color Scheme</span>
                        <Select
                            value={generationParams.colorSchemePreference}
                            onChange={(e) => handleParamChange('colorSchemePreference', e.target.value as GenerationParameters['colorSchemePreference'])}
                            disabled={isLoading}
                        >
                            <option value="custom">Custom (from prompt)</option>
                            <option value="warm">Warm</option>
                            <option value="cool">Cool</option>
                            <option value="monochromatic">Monochromatic</option>
                            <option value="analogous">Analogous</option>
                            <option value="complementary">Complementary</option>
                            <option value="triadic">Triadic</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Detail Level</span>
                        <Select
                            value={generationParams.detailLevel}
                            onChange={(e) => handleParamChange('detailLevel', e.target.value as GenerationParameters['detailLevel'])}
                            disabled={isLoading}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="ultra-fine">Ultra-fine</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Render Resolution</span>
                        <Select
                            value={generationParams.renderResolution}
                            onChange={(e) => handleParamChange('renderResolution', e.target.value as GenerationParameters['renderResolution'])}
                            disabled={isLoading}
                        >
                            <option value="sd">SD (512x512)</option>
                            <option value="hd">HD (768x1024)</option>
                            <option value="fhd">FHD (1024x1536)</option>
                            <option value="4k">4K (1536x2048)</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Lighting Preset</span>
                        <Select
                            value={generationParams.lightingPreset}
                            onChange={(e) => handleParamChange('lightingPreset', e.target.value as GenerationParameters['lightingPreset'])}
                            disabled={isLoading}
                        >
                            <option value="studio">Studio</option>
                            <option value="outdoor-day">Outdoor Day</option>
                            <option value="outdoor-night">Outdoor Night</option>
                            <option value="runway">Runway</option>
                            <option value="custom">Custom</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Camera Angle</span>
                        <Select
                            value={generationParams.cameraAngle}
                            onChange={(e) => handleParamChange('cameraAngle', e.target.value as GenerationParameters['cameraAngle'])}
                            disabled={isLoading}
                        >
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                            <option value="side">Side</option>
                            <option value="3/4">3/4 View</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Model Pose</span>
                        <Select
                            value={generationParams.modelPose}
                            onChange={(e) => handleParamChange('modelPose', e.target.value as GenerationParameters['modelPose'])}
                            disabled={isLoading}
                        >
                            <option value="standing">Standing</option>
                            <option value="walking">Walking</option>
                            <option value="sitting">Sitting</option>
                            <option value="custom">Custom</option>
                        </Select>
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Target Gender</span>
                        <Select
                            value={generationParams.targetGender || ''}
                            onChange={(e) => handleParamChange('targetGender', e.target.value || undefined)}
                            disabled={isLoading}
                        >
                            <option value="">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                        </Select>
                    </label>
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-400">
                    Estimated Cost: <span className="font-semibold text-blue-400">{estimatedCost} Tokens</span> (Available: {currentTokenBalance})
                </p>
                <Button onClick={handleSubmit} disabled={isLoading || currentTokenBalance < estimatedCost}>
                    {isLoading ? <LoadingSpinner size={16} className="mr-2" /> : null}
                    {isLoading ? 'Generating...' : 'Generate Concepts'}
                </Button>
            </div>
            {isLoading && <ProgressBar progress={Math.random() * 100} className="mt-2" />}
            {currentTokenBalance < estimatedCost && (
                <p className="text-red-400 text-sm mt-2">Insufficient tokens. Please top up to generate designs.</p>
            )}
        </Card>
    );
};

/**
 * Displays a gallery of design concepts.
 * Business value: Provides an intuitive visual overview of all designs within a project,
 * enabling quick identification and selection of assets, streamlining the design review process.
 */
export const DesignGallery: React.FC<{
    designs: DesignConcept[];
    onSelectDesign: (designId: string) => void;
    onDeleteDesign: (designId: string) => void;
    onToggleFavorite: (design: DesignConcept) => Promise<void>;
}> = ({ designs, onSelectDesign, onDeleteDesign, onToggleFavorite }) => {
    if (designs.length === 0) {
        return (
            <div className="text-center p-8 text-gray-400">
                <p className="mb-2">No designs found for this project.</p>
                <p>Generate new concepts using the prompt box above!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map(design => (
                <div key={design.id} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
                    <div className="relative w-full h-64 bg-gray-600 flex items-center justify-center overflow-hidden">
                        <img
                            src={design.imageUrl}
                            alt={design.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => onSelectDesign(design.id)}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                             <Tooltip content={design.isFavorite ? "Unfavorite" : "Favorite"}>
                                <Button
                                    variant="ghost"
                                    className={`p-1 rounded-full ${design.isFavorite ? 'text-yellow-400 hover:bg-yellow-900' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    onClick={() => onToggleFavorite(design)}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.034a1 1 0 00-1.176 0l-2.817 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                                </Button>
                             </Tooltip>
                        </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-1">{design.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">{design.prompt}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {design.styleTags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-600">
                            <Button variant="primary" onClick={() => onSelectDesign(design.id)} className="text-sm px-3 py-1">View Details</Button>
                            <Button variant="danger" onClick={() => onDeleteDesign(design.id)} className="text-sm px-3 py-1">Delete</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Detailed view and editor for a single design concept.
 * Business value: This is the central hub for design refinement. It enables granular editing
 * of materials and colors, provides AI-driven insights, tracks version history, and exposes
 * comprehensive metadata, allowing designers to achieve unparalleled precision and quality.
 * The integration of agentic AI suggestions directly into the workflow provides a significant
 * competitive advantage.
 */
export const DesignDetailView: React.FC<{
    design: DesignConcept;
    onClose: () => void;
    onUpdateDesign: (design: DesignConcept) => Promise<void>;
    materialLibrary: DesignMaterial[];
    colorPalettes: ColorPalette[];
    onAddCustomMaterial: (material: Omit<DesignMaterial, 'id'>) => Promise<void>;
    onSimulateAgentReview: (designId: string) => Promise<void>;
    designReviewsForDesign: DesignReview[];
    designAuditLogs: AuditLogEntry[];
    userId: string;
}> = ({ design, onClose, onUpdateDesign, materialLibrary, colorPalettes, onAddCustomMaterial, onSimulateAgentReview, designReviewsForDesign, designAuditLogs, userId }) => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'materials' | 'colors' | 'metadata' | 'history' | 'ai_insights' | 'audit_log'>('overview');
    const [isEditingNotes, setIsEditingNotes] = React.useState(false);
    const [notes, setNotes] = React.useState(design.notes || '');

    const {
        selectedMaterialId, setSelectedMaterialId,
        selectedColorHex, setSelectedColorHex,
        availableMaterials, applyMaterialToDesign
    } = useMaterialEditor(design, materialLibrary, onUpdateDesign);

    /**
     * Effect hook to synchronize the local `notes` state with the `design.notes` prop.
     */
    React.useEffect(() => {
        setNotes(design.notes || '');
    }, [design.notes]);

    /**
     * Handles saving updated design notes.
     */
    const handleSaveNotes = async () => {
        const updatedDesign = { ...design, notes: notes };
        await onUpdateDesign(updatedDesign);
        setIsEditingNotes(false);
    };

    /**
     * Toggles the favorite status of the design.
     */
    const handleToggleFavorite = async () => {
        const updatedDesign = { ...design, isFavorite: !design.isFavorite };
        await onUpdateDesign(updatedDesign);
    };

    /**
     * Simulates creating a new version snapshot.
     */
    const handleCreateVersionSnapshot = async () => {
        const updatedDesign = deepClone(design);
        const newVersion: DesignVersion = {
            versionId: generateUniqueId(),
            timestamp: new Date(),
            changesSummary: 'Manual snapshot created.',
            imageUrl: design.imageUrl,
            sketchUrl: design.sketchUrl,
            materials: deepClone(design.materials),
            colors: deepClone(design.colors),
            actorId: userId,
            actorType: 'user',
        };
        updatedDesign.versionHistory.push(newVersion);
        await onUpdateDesign(updatedDesign);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Design: ${design.name}`} size="xl">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Left pane: Image & Actions */}
                <div className="flex-shrink-0 lg:w-1/2">
                    <div className="relative mb-4 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <img src={design.imageUrl} alt={design.name} className="w-full h-auto object-contain" />
                        {design.sketchUrl && (
                            <img src={design.sketchUrl} alt={`${design.name} Sketch`} className="w-full h-auto object-contain mt-2 border border-gray-600 rounded-md" />
                        )}
                        <div className="absolute top-2 right-2 flex space-x-2">
                             <Tooltip content={design.isFavorite ? "Unfavorite" : "Favorite"}>
                                <Button
                                    variant="ghost"
                                    onClick={handleToggleFavorite}
                                    className={`p-1 rounded-full ${design.isFavorite ? 'text-yellow-400 hover:bg-yellow-900' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.034a1 1 0 00-1.176 0l-2.817 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                                </Button>
                             </Tooltip>
                        </div>
                    </div>
                    <div className="flex space-x-2 mb-4">
                        <Button className="flex-1">Download Image</Button>
                        <Button variant="secondary" className="flex-1">Export CAD</Button>
                        <Button variant="ghost" className="flex-1">Share</Button>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Designer Notes</h4>
                    {isEditingNotes ? (
                        <>
                            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mb-2" />
                            <div className="flex space-x-2">
                                <Button onClick={handleSaveNotes} className="text-sm px-3 py-1">Save Notes</Button>
                                <Button variant="secondary" onClick={() => setIsEditingNotes(false)} className="text-sm px-3 py-1">Cancel</Button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-700 p-3 rounded-md text-gray-300 min-h-[80px]" onClick={() => setIsEditingNotes(true)}>
                            {design.notes || <span className="italic text-gray-500">Click to add notes...</span>}
                        </div>
                    )}
                </div>

                {/* Right pane: Details & Editor */}
                <div className="flex-grow lg:w-1/2">
                    <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                        <TabButton active={activeTab === 'materials'} onClick={() => setActiveTab('materials')}>Materials</TabButton>
                        <TabButton active={activeTab === 'colors'} onClick={() => setActiveTab('colors')}>Colors</TabButton>
                        <TabButton active={activeTab === 'ai_insights'} onClick={() => setActiveTab('ai_insights')}>AI Insights</TabButton>
                        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>History</TabButton>
                        <TabButton active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')}>Metadata</TabButton>
                        <TabButton active={activeTab === 'audit_log'} onClick={() => setActiveTab('audit_log')}>Audit Log</TabButton>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-3 text-gray-300">
                            <p><strong>Prompt:</strong> {design.prompt}</p>
                            <p><strong>Created:</strong> {formatDate(design.creationDate)}</p>
                            <p><strong>Last Modified:</strong> {formatDate(design.lastModifiedDate)}</p>
                            <p><strong>Style Tags:</strong> {design.styleTags.map((tag, i) => <Tag key={i} className="mr-1">{tag}</Tag>)}</p>
                            <p><strong>Theme Tags:</strong> {design.themeTags.map((tag, i) => <Tag key={i} className="mr-1">{tag}</Tag>)}</p>
                        </div>
                    )}

                    {activeTab === 'materials' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Current Material</h4>
                            {design.materials.length > 0 ? (
                                <div className="bg-gray-700 p-3 rounded-md flex items-center space-x-3">
                                    <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-600">
                                        <img src={design.materials[0].textureUrl} alt={design.materials[0].name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{design.materials[0].name}</p>
                                        <p className="text-sm text-gray-400">
                                            {design.materials[0].properties.composition} - {design.materials[0].properties.weight}
                                        </p>
                                        {design.materials[0].colorVariants.length > 0 && (
                                            <div className="flex items-center space-x-1 mt-1">
                                                <span className="w-4 h-4 rounded-full border border-gray-500" style={{ backgroundColor: design.materials[0].colorVariants[0].hexCode }}></span>
                                                <span className="text-sm text-gray-400">{design.materials[0].colorVariants[0].colorName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">No material defined.</p>
                            )}

                            <h4 className="text-lg font-semibold text-white mt-6">Apply New Material</h4>
                            <label className="block">
                                <span className="text-gray-300">Select Material Type:</span>
                                <Select value={selectedMaterialId || ''} onChange={(e) => setSelectedMaterialId(e.target.value)}>
                                    <option value="">-- Choose Material --</option>
                                    {availableMaterials.map(mat => (
                                        <option key={mat.id} value={mat.id}>{mat.name}</option>
                                    ))}
                                </Select>
                            </label>
                            {selectedMaterialId && (
                                <label className="block">
                                    <span className="text-gray-300">Select Color:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {availableMaterials.find(m => m.id === selectedMaterialId)?.colorVariants.map(cv => (
                                            <Tooltip key={cv.hexCode} content={cv.colorName}>
                                                <div
                                                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${selectedColorHex === cv.hexCode ? 'border-blue-500' : 'border-gray-600'}`}
                                                    style={{ backgroundColor: cv.hexCode }}
                                                    onClick={() => setSelectedColorHex(cv.hexCode)}
                                                ></div>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </label>
                            )}
                            <Button onClick={applyMaterialToDesign} disabled={!selectedMaterialId || !selectedColorHex} className="w-full mt-4">
                                Apply Material
                            </Button>

                            <h4 className="text-lg font-semibold text-white mt-6">Custom Material Upload (Simulated)</h4>
                            <p className="text-gray-400 text-sm">Upload a texture image and define properties for a new custom material.</p>
                            <Button onClick={() => onAddCustomMaterial({
                                name: 'Custom Fabric ' + generateUniqueId().substring(0,4),
                                type: 'fabric',
                                textureUrl: 'https://via.placeholder.com/150/FFDAB9/000000?text=Custom+Fabric',
                                properties: { weight: 'medium', composition: 'Custom blend', stretch: 'low', finish: 'matte', breathability: 'medium' },
                                colorVariants: [{ colorName: 'Default', hexCode: '#FFDAB9' }]
                            })} className="w-full" variant="secondary">Upload New Material</Button>
                        </div>
                    )}

                    {activeTab === 'colors' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Current Colors</h4>
                            <div className="flex gap-2">
                                {design.colors.map((color, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full border border-gray-600" style={{ backgroundColor: color }}></div>
                                        <span className="text-gray-300">{color}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 className="text-lg font-semibold text-white mt-6">Suggested Palettes</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {colorPalettes.map(palette => (
                                    <div key={palette.id} className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
                                        <p className="font-semibold text-white mb-2">{palette.name}</p>
                                        <div className="flex space-x-1">
                                            {palette.colors.map((color, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border border-gray-600" style={{ backgroundColor: color }}></div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="mt-2 text-sm text-blue-400 hover:text-blue-300">Apply Palette</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai_insights' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">AI Agent Review</h4>
                            <Button onClick={() => onSimulateAgentReview(design.id)} className="w-full mb-4" disabled={design.metadata.agentReviewStatus === 'pending'}>
                                {design.metadata.agentReviewStatus === 'pending' ? <LoadingSpinner size={16} className="mr-2" /> : null}
                                {design.metadata.agentReviewStatus === 'pending' ? 'Agent Reviewing...' : 'Request New AI Review'}
                            </Button>
                            {designReviewsForDesign.length === 0 ? (
                                <p className="text-gray-400">No AI agent reviews for this design yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {designReviewsForDesign.map(review => (
                                        <AgentChatBubble key={review.id} agentName={review.agentName} message={review.suggestion} timestamp={review.timestamp} riskScore={review.riskScore} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white mb-2">Design Version History</h4>
                            {design.versionHistory.length === 0 ? (
                                <p className="text-gray-400">No version history available for this design.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {design.versionHistory.map(version => (
                                        <li key={version.versionId} className="bg-gray-700 p-3 rounded-md">
                                            <p className="font-semibold text-white">{formatDate(version.timestamp)} by {version.actorType === 'user' ? 'User' : 'AI Agent'}</p>
                                            <p className="text-gray-400 text-sm">{version.changesSummary}</p>
                                            <img src={version.imageUrl} alt="Version" className="w-24 h-24 object-cover rounded-md mt-2" />
                                            <Button variant="secondary" className="mt-2 text-xs px-2 py-1">Revert to This</Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Button onClick={handleCreateVersionSnapshot} className="w-full mt-4" variant="secondary">Create New Version Snapshot</Button>
                        </div>
                    )}

                    {activeTab === 'metadata' && (
                        <div className="space-y-3 text-gray-300">
                            <p><strong>AI Model Version:</strong> {design.metadata.aiModelVersion}</p>
                            <p><strong>Render Style:</strong> {design.metadata.renderStyle}</p>
                            <p><strong>Resolution:</strong> {design.metadata.resolution}</p>
                            <p><strong>Agent Review Status:</strong> <Tag>{design.metadata.agentReviewStatus || 'N/A'}</Tag></p>
                            <h5 className="font-semibold text-white mt-4">Generation Parameters:</h5>
                            <ul className="list-disc list-inside text-gray-400 ml-4">
                                {Object.entries(design.metadata.generationParameters).map(([key, value]) => (
                                    <li key={key}><strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'audit_log' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white mb-2">Design-Specific Audit Log</h4>
                            {designAuditLogs.length === 0 ? (
                                <p className="text-gray-400">No audit log entries for this design.</p>
                            ) : (
                                <ul className="space-y-3 text-sm">
                                    {designAuditLogs.map(log => (
                                        <li key={log.id} className="bg-gray-700 p-3 rounded-md">
                                            <p className="font-semibold text-white">{log.action} <span className="text-gray-500">- {formatDate(log.timestamp)}</span></p>
                                            <p className="text-gray-400">Actor: {log.actorType} ({log.userId})</p>
                                            <p className="text-gray-500">Details: {JSON.stringify(log.details)}</p>
                                            {log.securityContext?.signature && (
                                                <Tooltip content="Cryptographic Signature (simulated)" position="bottom">
                                                    <span className="inline-block bg-green-900 bg-opacity-30 text-green-300 text-xs px-2 py-1 rounded mt-1">
                                                        Signed: {log.securityContext.signature.substring(0, 10)}...
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

/**
 * Modal for editing user profile and settings.
 * Business value: Centralizes user identity management and personalization, allowing
 * users to securely manage their profile, adjust preferences, and configure security
 * settings (like MFA), enhancing user control and adherence to digital identity principles.
 */
export const UserProfileModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => Promise<UserProfile>;
}> = ({ isOpen, onClose, user, onUpdateUser }) => {
    const [editedUser, setEditedUser] = React.useState(deepClone(user));

    /**
     * Effect hook to reset the `editedUser` state when the modal opens or `user` prop changes.
     */
    React.useEffect(() => {
        if (isOpen) {
            setEditedUser(deepClone(user));
        }
    }, [isOpen, user]);

    /**
     * Handles changes to input fields within the modal.
     * @param e The React change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.startsWith('setting.')) {
            const settingKey = name.split('.')[1] as keyof UserSettings;
            setEditedUser(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [settingKey]: type === 'checkbox' ? checked : value,
                },
            }));
        } else if (name.startsWith('notif_setting.')) {
            const notifKey = name.split('.')[1] as keyof UserSettings['notificationPreferences'];
            setEditedUser(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    notificationPreferences: {
                        ...prev.settings.notificationPreferences,
                        [notifKey]: checked,
                    },
                },
            }));
        } else {
            setEditedUser(prev => ({ ...prev, [name]: value }));
        }
    };

    /**
     * Handles saving the updated user profile.
     */
    const handleSave = async () => {
        try {
            await onUpdateUser(editedUser);
            onClose();
        } catch (error) {
            console.error('Failed to update user profile:', error);
            // Error handling could be dispatching an error state
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Profile & Settings">
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <img src={editedUser.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <h3 className="text-xl font-bold text-white">{editedUser.username}</h3>
                        <p className="text-gray-400">{editedUser.email}</p>
                        <p className="text-blue-400 font-semibold capitalize">{editedUser.subscriptionTier} Tier</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card title="Account Details" className="p-4">
                        <label className="block mb-2">
                            <span className="text-gray-300">Username</span>
                            <Input name="username" value={editedUser.username} onChange={handleChange} />
                        </label>
                        <label className="block mb-2">
                            <span className="text-gray-300">Email</span>
                            <Input name="email" value={editedUser.email} onChange={handleChange} type="email" />
                        </label>
                        <p className="text-gray-300"><strong>Tokens:</strong> {editedUser.tokenBalance}</p>
                    </Card>

                    <Card title="App Settings" className="p-4">
                        <label className="block mb-2">
                            <span className="text-gray-300">Theme</span>
                            <Select name="setting.theme" value={editedUser.settings.theme} onChange={handleChange}>
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </Select>
                        </label>
                        <label className="block mb-2">
                            <span className="text-gray-300">Default Prompt Language</span>
                            <Select name="setting.defaultPromptLanguage" value={editedUser.settings.defaultPromptLanguage} onChange={handleChange}>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </Select>
                        </label>
                        <Checkbox label="Enable Auto-Save" name="setting.autoSaveEnabled" checked={editedUser.settings.autoSaveEnabled} onChange={handleChange} className="mb-2" />
                        <label className="block mb-2">
                            <span className="text-gray-300">Preferred Units</span>
                            <Select name="setting.preferredUnits" value={editedUser.settings.preferredUnits} onChange={handleChange}>
                                <option value="cm">Centimeters (cm)</option>
                                <option value="inch">Inches (inch)</option>
                            </Select>
                        </label>
                    </Card>
                </div>

                <Card title="Notification Preferences" className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Checkbox label="Email Notifications" name="notif_setting.email" checked={editedUser.settings.notificationPreferences.email} onChange={handleChange} />
                        <Checkbox label="In-App Notifications" name="notif_setting.inApp" checked={editedUser.settings.notificationPreferences.inApp} onChange={handleChange} />
                        <Checkbox label="SMS Notifications" name="notif_setting.sms" checked={editedUser.settings.notificationPreferences.sms} onChange={handleChange} />
                    </div>
                </Card>

                <Card title="Security & Identity" className="p-4">
                    <p className="text-gray-300 mb-2"><strong>Identity Status:</strong> <Tag>{editedUser.securityStatus}</Tag></p>
                    <p className="text-gray-400 text-sm mb-4">Your digital identity is {editedUser.securityStatus}. Verified identities enable advanced features.</p>
                    <Checkbox label="Enable Multi-Factor Authentication (MFA)" name="setting.mfaEnabled" checked={editedUser.settings.mfaEnabled} onChange={handleChange} className="mb-2" />
                    <Button variant="secondary" className="mt-2 w-full" disabled>Manage Keypairs (Simulated)</Button>
                </Card>

                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};

/**
 * Modal for displaying and managing user notifications.
 * Business value: Ensures users are promptly informed of critical updates, agent actions,
 * and account status changes, improving response times and maintaining high engagement.
 */
export const NotificationsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkRead: (id: string) => void;
}> = ({ isOpen, onClose, notifications, onMarkRead }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notifications">
            {notifications.length === 0 ? (
                <p className="text-gray-400">No new notifications.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(notification => (
                        <li key={notification.id} className={`p-4 rounded-lg flex items-start space-x-3 ${notification.isRead ? 'bg-gray-700 text-gray-400' : 'bg-blue-900 bg-opacity-30 text-white'}`}>
                            <div className={`w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-500' : 'bg-blue-500'} mt-1`}></div>
                            <div className="flex-grow">
                                <p className="font-semibold">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(notification.timestamp)}</p>
                                {notification.link && (
                                    <a href={notification.link} className="text-blue-400 hover:underline text-sm mt-1 block">View Details</a>
                                )}
                            </div>
                            {!notification.isRead && (
                                <Button variant="ghost" onClick={() => onMarkRead(notification.id)} className="text-xs px-2 py-1 text-blue-300 hover:bg-blue-800">
                                    Mark as Read
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
};

/**
 * Modal for buying design tokens, simulating interaction with payment rails.
 * Business value: Directly integrates the token rail layer into the user experience,
 * providing a transparent and efficient mechanism for users to acquire resources
 * needed for AI generation, driving platform monetization.
 */
export const BuyTokensModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentTokens: number;
    paymentRails: PaymentRail[];
    onBuyTokens: (amount: number, railId: string) => Promise<void>;
    isPaymentProcessing: boolean;
}> = ({ isOpen, onClose, currentTokens, paymentRails, onBuyTokens, isPaymentProcessing }) => {
    const [amount, setAmount] = React.useState(100);
    const [selectedRail, setSelectedRail] = React.useState<string | null>(null);
    const [purchaseError, setPurchaseError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen && paymentRails.length > 0) {
            setSelectedRail(paymentRails.find(r => r.isEnabled)?.id || null);
            setPurchaseError(null);
        }
    }, [isOpen, paymentRails]);

    const handlePurchase = async () => {
        if (!selectedRail || amount <= 0) {
            setPurchaseError('Please select a payment rail and enter a valid amount.');
            return;
        }
        setPurchaseError(null);
        try {
            await onBuyTokens(amount, selectedRail);
            onClose();
        } catch (error: any) {
            setPurchaseError(error.message || 'Failed to complete token purchase.');
        }
    };

    const selectedPaymentRail = paymentRails.find(r => r.id === selectedRail);
    const finalAmount = selectedPaymentRail ? amount * (1 - selectedPaymentRail.feeRate) : amount;
    const fee = selectedPaymentRail ? amount * selectedPaymentRail.feeRate : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Purchase Design Tokens">
            <div className="space-y-4">
                <p className="text-gray-300">Current Tokens: <span className="font-semibold text-blue-400">{currentTokens}</span></p>

                <label className="block">
                    <span className="text-gray-300">Amount to Purchase</span>
                    <Input
                        type="number"
                        min="10"
                        step="10"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(10, parseInt(e.target.value) || 0))}
                        disabled={isPaymentProcessing}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-300">Select Payment Rail</span>
                    <Select value={selectedRail || ''} onChange={(e) => setSelectedRail(e.target.value)} disabled={isPaymentProcessing}>
                        <option value="">-- Select Rail --</option>
                        {paymentRails.map(rail => (
                            <option key={rail.id} value={rail.id} disabled={!rail.isEnabled}>
                                {rail.name} {rail.isEnabled ? '' : '(Disabled)'}
                            </option>
                        ))}
                    </Select>
                </label>

                {selectedPaymentRail && (
                    <div className="bg-gray-700 p-3 rounded-md text-sm text-gray-300">
                        <p><strong>Rail:</strong> {selectedPaymentRail.name} ({selectedPaymentRail.speed})</p>
                        <p><strong>Fee:</strong> {(selectedPaymentRail.feeRate * 100).toFixed(1)}% ({fee.toFixed(2)} tokens)</p>
                        <p><strong>You will receive:</strong> <span className="font-semibold text-green-400">{finalAmount.toFixed(2)} tokens</span></p>
                        <p className="text-gray-500 mt-1">{selectedPaymentRail.description}</p>
                    </div>
                )}

                {purchaseError && <p className="text-red-400 text-sm">{purchaseError}</p>}

                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="secondary" onClick={onClose} disabled={isPaymentProcessing}>Cancel</Button>
                    <Button onClick={handlePurchase} disabled={isPaymentProcessing || !selectedRail || amount <= 0}>
                        {isPaymentProcessing ? <LoadingSpinner size={16} className="mr-2" /> : null}
                        {isPaymentProcessing ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                </div>
                {isPaymentProcessing && <ProgressBar progress={Math.random() * 100} className="mt-2" />}
            </div>
        </Modal>
    );
};

/**
 * Mood Board Viewer component, allowing users to collect and manage inspirational images.
 * Business value: Fosters creativity and facilitates the initial phase of design, allowing
 * designers to visually articulate themes and styles, improving conceptual alignment.
 */
export const MoodBoardViewer: React.FC<{
    moodBoardImages: MoodBoardImage[];
    projectId: string; // Used for context to upload to a specific project
    onAddImage: (projectId: string, image: Omit<MoodBoardImage, 'id' | 'uploadDate'>) => void;
    onRemoveImage: (projectId: string, imageId: string) => void;
}> = ({ moodBoardImages, projectId, onAddImage, onRemoveImage }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState('');
    const [imageCaption, setImageCaption] = React.useState('');
    const [imageSource, setImageSource] = React.useState('');

    /**
     * Handles the simulated upload of a new mood board image.
     */
    const handleUpload = () => {
        if (imageUrl.trim()) {
            onAddImage(projectId, { url: imageUrl, caption: imageCaption, source: imageSource });
            setImageUrl('');
            setImageCaption('');
            setImageSource('');
            setIsUploadModalOpen(false);
        }
    };

    /**
     * Handles the removal of a mood board image.
     * @param imageId The ID of the image to remove.
     */
    const handleRemove = (imageId: string) => {
        if (window.confirm('Are you sure you want to remove this image from the mood board?')) {
            onRemoveImage(projectId, imageId);
        }
    };

    return (
        <Card title="Mood Board" className="mb-6">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsUploadModalOpen(true)}>Add Image</Button>
            </div>
            {moodBoardImages.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No images in this mood board yet. Add some inspiration!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {moodBoardImages.map(img => (
                        <div key={img.id} className="relative bg-gray-700 rounded-lg overflow-hidden group">
                            <img src={img.url} alt={img.caption || 'Mood board image'} className="w-full h-40 object-cover" />
                            <div className="p-2 text-sm text-gray-300">
                                {img.caption && <p className="font-medium truncate">{img.caption}</p>}
                                {img.source && <p className="text-xs text-gray-500">Source: {img.source}</p>}
                            </div>
                            <Button
                                variant="danger"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8 text-white"
                                onClick={() => handleRemove(img.id)}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm.002 6.5A1 1 0 108 14h.001a1 1 0 000-2H8a1 1 0 00-1 1zm4 0a1 1 0 101-1h.001a1 1 0 000-2H12a1 1 0 00-1 1z" clipRule="evenodd"></path></svg>
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Add Mood Board Image">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-300">Image URL</span>
                        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="e.g., https://unsplash.com/photos/..." />
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Caption (Optional)</span>
                        <Input value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-gray-300">Source (Optional)</span>
                        <Input value={imageSource} onChange={(e) => setImageSource(e.target.value)} placeholder="e.g., Unsplash, Pinterest" />
                    </label>
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpload}>Add Image</Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

/**
 * Displays a chronological log of design generation activities.
 * Business value: Provides an auditable history of AI interactions, allowing designers
 * to review past prompts and outcomes, fostering learning and iteration.
 */
export const ActivityLog: React.FC<{ generationHistory: AppState['generationHistory'] }> = ({ generationHistory }) => {
    return (
        <Card title="Generation Activity" className="mb-6">
            {generationHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No generation activity yet.</p>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {generationHistory.sort((a,b) => b.date.getTime() - a.date.getTime()).map((entry, index) => (
                        <div key={index} className="bg-gray-700 p-3 rounded-md">
                            <p className="text-gray-300">{entry.prompt}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatDate(entry.date)} -{' '}
                                <span className={entry.success ? 'text-green-400' : 'text-red-400'}>
                                    {entry.success ? 'Success' : 'Failed'}
                                </span>
                            </p>
                            {entry.designIds.length > 0 && (
                                <p className="text-xs text-blue-400 mt-1">{entry.designIds.length} concepts generated</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

/**
 * Modal for viewing global system audit logs.
 * Business value: Provides transparent and tamper-evident traceability of all critical
 * system actions, crucial for governance, compliance, and security in a commercial-grade
 * application. It ensures accountability and builds trust.
 */
export const GlobalAuditLogModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    auditLogs: AuditLogEntry[];
}> = ({ isOpen, onClose, auditLogs }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Global System Audit Logs" size="lg">
            {auditLogs.length === 0 ? (
                <p className="text-gray-400">No audit log entries found.</p>
            ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(log => (
                        <div key={log.id} className="bg-gray-700 p-4 rounded-lg text-sm">
                            <p className="font-semibold text-white mb-1">
                                {log.action} <span className="text-gray-500">- {formatDate(log.timestamp)}</span>
                            </p>
                            <p className="text-gray-300">
                                Actor: <span className="font-medium">{log.userId}</span> ({log.actorType})
                            </p>
                            {log.entityType && <p className="text-gray-300">Entity: <span className="font-medium">{log.entityType} ({log.entityId})</span></p>}
                            <p className="text-gray-400">Details: {JSON.stringify(log.details)}</p>
                            {log.securityContext?.signature && (
                                <Tooltip content="Cryptographic Signature (simulated) for tamper-evidence" position="bottom">
                                    <span className="inline-block bg-green-900 bg-opacity-30 text-green-300 text-xs px-2 py-1 rounded mt-2">
                                        Signed: {log.securityContext.signature.substring(0, 15)}...
                                    </span>
                                </Tooltip>
                            )}
                            <p className="text-gray-500 text-xs mt-2">IP: {log.securityContext?.ipAddress} | User Agent: {log.securityContext?.userAgent.substring(0, 50)}...</p>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

/**
 * The main application view component for the Aesthetic Engine.
 * This component orchestrates all sub-components, state management, and API interactions,
 * forming the complete user-facing application.
 * Business value: As the primary entry point for designers, this view is where creativity meets
 * cutting-edge AI. It facilitates rapid, intelligent design iteration, project management,
 * and seamless integration with token-based economies, directly translating to enhanced
 * designer productivity, faster market entry for products, and scalable commercial operations.
 */
const AestheticEngineView: React.FC = () => {
    const {
        state,
        dispatch,
        currentProject,
        designsInCurrentProject,
        selectedDesign,
        unreadNotifications,
    } = useAestheticEngineApp();

    const currentUser = state.currentUser;

    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = React.useState(false);
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const [showBuyTokensModal, setShowBuyTokensModal] = React.useState(false);
    const [showGlobalAuditLogModal, setShowGlobalAuditLogModal] = React.useState(false);

    /**
     * Hook for prompt input and generation.
     */
    const {
        prompt, setPrompt,
        generationParams, handleParamChange,
        numConcepts, setNumConcepts,
        showSuggestions, setShowSuggestions,
        filteredSuggestions,
        availableStyles, availableMaterials,
        handlePromptChange, handleSubmit,
    } = usePromptInput(state.recentPrompts, async (p, params, num) => {
        if (!currentUser) {
            dispatch({ type: 'SET_ERROR', payload: 'User not logged in.' });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const generatedDesigns = await generateDesignConcepts(p, params, currentUser.id, state.currentProjectId, num);
            dispatch({ type: 'ADD_DESIGN_CONCEPT', payload: generatedDesigns });
            dispatch({ type: 'ADD_GENERATION_HISTORY_ENTRY', payload: { prompt: p, date: new Date(), success: true, designIds: generatedDesigns.map(d => d.id) } });
            dispatch({ type: 'ADD_RECENT_PROMPT', payload: p });
            // Update user tokenBalance
            const updatedUser = await fetchIdentityProfile(currentUser.id); // Re-fetch for updated tokens
            dispatch({ type: 'SET_USER_PROFILE', payload: updatedUser });
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: generateUniqueId(),
                userId: currentUser.id,
                type: 'design_generated',
                message: `Successfully generated ${numConcepts} new design concepts!`,
                timestamp: new Date(),
                isRead: false,
                link: generatedDesigns[0] ? `/app/designs/${generatedDesigns[0].id}` : undefined
            }});
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            dispatch({ type: 'ADD_GENERATION_HISTORY_ENTRY', payload: { prompt: p, date: new Date(), success: false, designIds: [] } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    });

    /**
     * Handles updating the user profile.
     * @param updatedUser The UserProfile object with updated fields.
     * @returns A Promise resolving to the updated UserProfile.
     */
    const handleUpdateUserProfile = async (updatedUser: UserProfile) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const result = await updateIdentityProfile(updatedUser);
            dispatch({ type: 'SET_USER_PROFILE', payload: result });
            dispatch({ type: 'UPDATE_USER_SETTINGS', payload: result.settings }); // Apply new settings immediately
            return result;
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles purchasing tokens.
     * @param amount The amount of tokens to buy.
     * @param railId The ID of the selected payment rail.
     */
    const handleBuyTokens = async (amount: number, railId: string) => {
        if (!currentUser) {
            dispatch({ type: 'SET_ERROR', payload: 'User not logged in.' });
            return;
        }
        dispatch({ type: 'SET_PAYMENT_PROCESSING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const updatedUser = await buyTokens(currentUser.id, amount, railId);
            dispatch({ type: 'SET_USER_PROFILE', payload: updatedUser });
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: generateUniqueId(),
                userId: currentUser.id,
                type: 'token_purchase_success',
                message: `Successfully purchased ${amount} tokens!`,
                timestamp: new Date(),
                isRead: false,
            }});
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error; // Re-throw to be caught by modal's error state
        } finally {
            dispatch({ type: 'SET_PAYMENT_PROCESSING', payload: false });
        }
    };

    /**
     * Handles creating a new project.
     * @param projectData The data for the new project.
     */
    const handleCreateProject = async (projectData: Omit<Project, 'id' | 'creationDate' | 'lastModifiedDate' | 'designConceptIds' | 'auditLogReferences'>) => {
        if (!currentUser) {
            dispatch({ type: 'SET_ERROR', payload: 'User not logged in.' });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const newProject = await createProject(projectData, currentUser.id);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles editing an existing project.
     * @param project The updated Project object.
     */
    const handleEditProject = async (project: Project) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const updated = await updateProject(project);
            dispatch({ type: 'UPDATE_PROJECT', payload: updated });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles deleting a project.
     * @param projectId The ID of the project to delete.
     */
    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm('Are you sure you want to delete this project and all its designs? This action cannot be undone.')) {
            return;
        }
        if (!currentUser) return; // Should not happen if authenticated

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deleteProject(projectId, currentUser.id);
            dispatch({ type: 'DELETE_PROJECT', payload: projectId });
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: generateUniqueId(),
                userId: currentUser.id,
                type: 'update_available', // Using generic type, ideally 'project_deleted'
                message: `Project deleted successfully.`,
                timestamp: new Date(),
                isRead: false
            }});
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles updating a design concept.
     * @param design The updated DesignConcept object.
     */
    const handleUpdateDesignConcept = async (design: DesignConcept) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const updated = await updateDesignConcept(design);
            dispatch({ type: 'UPDATE_DESIGN_CONCEPT', payload: updated });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Toggles the favorite status of a design.
     * @param design The design concept to update.
     */
    const handleToggleDesignFavorite = async (design: DesignConcept) => {
        const updatedDesign = { ...design, isFavorite: !design.isFavorite };
        await handleUpdateDesignConcept(updatedDesign);
    };

    /**
     * Handles deleting a design concept.
     * @param designId The ID of the design concept to delete.
     */
    const handleDeleteDesignConcept = async (designId: string) => {
        if (!window.confirm('Are you sure you want to delete this design concept?')) {
            return;
        }
        if (!currentUser) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deleteDesignConcept(designId, currentUser.id);
            dispatch({ type: 'DELETE_DESIGN_CONCEPT', payload: designId });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles adding a new image to a project's mood board.
     * @param projectId The ID of the project.
     * @param image The mood board image data.
     */
    const handleAddMoodBoardImage = async (projectId: string, image: Omit<MoodBoardImage, 'id' | 'uploadDate'>) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const project = deepClone(state.projects.find(p => p.id === projectId));
            if (!project) throw new Error("Project not found.");
            const newImage: MoodBoardImage = { ...image, id: generateUniqueId(), uploadDate: new Date() };
            project.moodBoardImages.push(newImage);
            const updated = await updateProject(project);
            dispatch({ type: 'UPDATE_PROJECT', payload: updated });
            if (currentUser) {
                await logAuditActivity(currentUser.id, 'user', 'MOODBOARD_IMAGE_ADDED', { projectId, imageUrl: newImage.url }, 'project', projectId);
            }
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles removing an image from a project's mood board.
     * @param projectId The ID of the project.
     * @param imageId The ID of the image to remove.
     */
    const handleRemoveMoodBoardImage = async (projectId: string, imageId: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const project = deepClone(state.projects.find(p => p.id === projectId));
            if (!project) throw new Error("Project not found.");
            project.moodBoardImages = project.moodBoardImages.filter(img => img.id !== imageId);
            const updated = await updateProject(project);
            dispatch({ type: 'UPDATE_PROJECT', payload: updated });
            if (currentUser) {
                await logAuditActivity(currentUser.id, 'user', 'MOODBOARD_IMAGE_REMOVED', { projectId, imageId }, 'project', projectId);
            }
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles adding a new custom material.
     * @param material The material data to add.
     */
    const handleAddCustomMaterial = async (material: Omit<DesignMaterial, 'id'>) => {
        if (!currentUser) {
            dispatch({ type: 'SET_ERROR', payload: 'User not logged in.' });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const newMaterial = await addCustomMaterial(material, currentUser.id);
            dispatch({ type: 'ADD_CUSTOM_MATERIAL', payload: newMaterial });
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: generateUniqueId(),
                userId: currentUser.id,
                type: 'material_added',
                message: `New material '${newMaterial.name}' added to your library!`,
                timestamp: new Date(),
                isRead: false
            }});
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles marking a notification as read.
     * @param notificationId The ID of the notification to mark.
     */
    const handleMarkNotificationRead = async (notificationId: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await markNotificationAsRead(notificationId);
            dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * Handles simulating an AI agent review for a design.
     * @param designId The ID of the design to review.
     */
    const handleSimulateAgentReview = async (designId: string) => {
        if (!currentUser) {
            dispatch({ type: 'SET_ERROR', payload: 'User not logged in.' });
            return;
        }
        const design = state.designConcepts.find(d => d.id === designId);
        if (design && design.metadata.agentReviewStatus === 'pending') {
            return; // Already in review
        }
        if (design) {
            const updatedDesign = { ...design, metadata: { ...design.metadata, agentReviewStatus: 'pending' } };
            dispatch({ type: 'UPDATE_DESIGN_CONCEPT', payload: updatedDesign });
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const review = await simulateAgentDesignReview(designId, currentUser.id);
            dispatch({ type: 'ADD_DESIGN_REVIEW', payload: review });
            // Update the design's metadata to reflect review status
            const updatedDesign = { ...design, metadata: { ...design?.metadata, agentReviewStatus: 'reviewed' } } as DesignConcept;
            dispatch({ type: 'UPDATE_DESIGN_CONCEPT', payload: updatedDesign });
            dispatch({ type: 'ADD_NOTIFICATION', payload: {
                id: generateUniqueId(),
                userId: currentUser.id,
                type: 'agent_review_completed',
                message: `AI Agent "${review.agentName}" completed a review for design "${design?.name || 'Unknown Design'}".`,
                timestamp: new Date(),
                isRead: false,
                link: `/app/designs/${designId}`
            }});
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <LoadingSpinner size={48} />
                <p className="ml-4 text-xl">Loading application data...</p>
            </div>
        );
    }

    const estimatedCost = calculateGenerationCost(generationParams) * numConcepts;

    // Filter audit logs and design reviews for the selected design's detail view
    const selectedDesignAuditLogs = selectedDesign?.auditLogReferences
        ? state.auditLogs.filter(log => selectedDesign.auditLogReferences?.includes(log.id) || log.entityId === selectedDesign.id)
        : [];
    const selectedDesignReviews = state.designReviews.filter(review => review.designId === selectedDesign?.id);

    return (
        <div className={`flex flex-col min-h-screen ${state.appSettings.darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Header
                username={currentUser.username}
                tokenBalance={currentUser.tokenBalance}
                avatarUrl={currentUser.avatarUrl}
                unreadNotifications={unreadNotifications}
                onLogout={() => dispatch({ type: 'LOGOUT' })} // Simulated logout
                onViewProfile={() => setShowProfileModal(true)}
                onViewNotifications={() => setShowNotificationsModal(true)}
                onToggleDarkMode={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                darkMode={state.appSettings.darkMode}
                onBuyTokens={() => setShowBuyTokensModal(true)}
                onViewAuditLogs={() => setShowGlobalAuditLogModal(true)}
            />

            <div className="flex flex-grow overflow-hidden">
                <Sidebar
                    projects={state.projects}
                    currentProjectId={state.currentProjectId}
                    onSelectProject={(id) => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                    onNewProject={handleCreateProject}
                    onEditProject={handleEditProject}
                    onDeleteProject={handleDeleteProject}
                    userId={currentUser.id}
                />

                <main className="flex-grow p-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6">
                        {currentProject ? currentProject.name : "Aesthetic Engine Dashboard"}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {currentProject ? currentProject.description : "Select a project or create a new one to start designing."}
                    </p>

                    {state.error && (
                        <div className="bg-red-900 bg-opacity-30 text-red-300 p-4 rounded-md mb-6 flex justify-between items-center">
                            <span>Error: {state.error}</span>
                            <Button variant="ghost" onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </Button>
                        </div>
                    )}

                    {state.isLoading && (state.isPaymentProcessing === false) && (
                        <div className="flex items-center justify-center py-4 text-blue-400">
                            <LoadingSpinner className="mr-3" />
                            <p>Loading data or generating designs...</p>
                        </div>
                    )}

                    {currentProject ? (
                        <>
                            <PromptInputSection
                                prompt={prompt}
                                handlePromptChange={handlePromptChange}
                                showSuggestions={showSuggestions}
                                filteredSuggestions={filteredSuggestions}
                                setPrompt={setPrompt}
                                setShowSuggestions={setShowSuggestions}
                                generationParams={generationParams}
                                handleParamChange={handleParamChange}
                                numConcepts={numConcepts}
                                setNumConcepts={setNumConcepts}
                                availableStyles={availableStyles}
                                availableMaterials={availableMaterials}
                                handleSubmit={handleSubmit}
                                isLoading={state.isLoading}
                                currentTokenBalance={currentUser.tokenBalance}
                                estimatedCost={estimatedCost}
                            />

                            <DesignGallery
                                designs={designsInCurrentProject}
                                onSelectDesign={(id) => dispatch({ type: 'SELECT_DESIGN_CONCEPT', payload: id })}
                                onDeleteDesign={handleDeleteDesignConcept}
                                onToggleFavorite={handleToggleDesignFavorite}
                            />

                            <MoodBoardViewer
                                moodBoardImages={currentProject.moodBoardImages}
                                projectId={currentProject.id}
                                onAddImage={handleAddMoodBoardImage}
                                onRemoveImage={handleRemoveMoodBoardImage}
                            />

                            <ActivityLog generationHistory={state.generationHistory} />
                        </>
                    ) : (
                        <div className="text-center p-10 bg-gray-700 rounded-lg text-gray-300">
                            <p className="text-xl font-semibold mb-4">Welcome to Aesthetic Engine!</p>
                            <p className="mb-6">Start by creating a new project using the "New Project" button in the sidebar.</p>
                            <Button onClick={handleCreateProject}>Create Your First Project</Button>
                        </div>
                    )}

                </main>
            </div>

            {selectedDesign && (
                <DesignDetailView
                    design={selectedDesign}
                    onClose={() => dispatch({ type: 'SELECT_DESIGN_CONCEPT', payload: null })}
                    onUpdateDesign={handleUpdateDesignConcept}
                    materialLibrary={state.materialLibrary}
                    colorPalettes={state.colorPalettes}
                    onAddCustomMaterial={handleAddCustomMaterial}
                    onSimulateAgentReview={handleSimulateAgentReview}
                    designReviewsForDesign={selectedDesignReviews}
                    designAuditLogs={selectedDesignAuditLogs}
                    userId={currentUser.id}
                />
            )}

            {currentUser && (
                <UserProfileModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    user={currentUser}
                    onUpdateUser={handleUpdateUserProfile}
                />
            )}

            <NotificationsModal
                isOpen={showNotificationsModal}
                onClose={() => setShowNotificationsModal(false)}
                notifications={state.notifications}
                onMarkRead={handleMarkNotificationRead}
            />

            {currentUser && (
                <BuyTokensModal
                    isOpen={showBuyTokensModal}
                    onClose={() => setShowBuyTokensModal(false)}
                    currentTokens={currentUser.tokenBalance}
                    paymentRails={state.paymentRails}
                    onBuyTokens={handleBuyTokens}
                    isPaymentProcessing={state.isPaymentProcessing}
                />
            )}

            <GlobalAuditLogModal
                isOpen={showGlobalAuditLogModal}
                onClose={() => setShowGlobalAuditLogModal(false)}
                auditLogs={state.auditLogs}
            />

            <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} title="About Aesthetic Engine">
                <div className="text-gray-300 space-y-4">
                    <p>
                        Aesthetic Engine is an AI-powered platform designed to revolutionize fashion design.
                        It acts as a creative partner, allowing designers to generate novel garment concepts
                        from natural language prompts.
                    </p>
                    <p>
                        <strong>Key Features:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Natural language prompt-to-design generation.</li>
                            <li>Photorealistic mockups and technical sketches.</li>
                            <li>Extensive material and color libraries.</li>
                            <li>Project management for design collections.</li>
                            <li>Version history for design iterations.</li>
                            <li>Mood board creation for inspiration.</li>
                            <li>AI Agent Insights for design refinement.</li>
                            <li>Token-based economic model with multiple payment rails.</li>
                            <li>Secure digital identity and audit logging for governance.</li>
                        </ul>
                    </p>
                    <p>
                        This demonstration showcases a comprehensive set of features, simulating API interactions
                        and complex UI/UX within a single file for educational and demonstrative purposes,
                        reflecting a commercial-grade implementation of the Money20/20 "build phase" architecture.
                    </p>
                    <p className="text-sm text-gray-500">
                        Version: 1.0.0-build-phase | Built with React and Agentic AI 🚀
                    </p>
                </div>
            </Modal>
             <div className="sticky bottom-0 w-full bg-gray-900 p-3 text-center text-gray-400 text-sm border-t border-gray-700">
                Aesthetic Engine © 2024. All rights reserved.
                <Button variant="ghost" className="ml-4 text-blue-400 hover:text-blue-300" onClick={() => setShowAboutModal(true)}>About</Button>
            </div>
        </div>
    );
};

export default AestheticEngineView;