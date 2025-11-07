/**
 * This module implements the core user interface and interaction logic for NarrativeForge Pro,
 * a revolutionary AI-powered narrative development platform. It provides a comprehensive
 * environment for storytellers to conceptualize, draft, and refine their projects with the
 * assistance of advanced generative AI capabilities.
 *
 * Business Value: NarrativeForge Pro dramatically accelerates the creative process,
 * reducing the time-to-market for narrative content while enhancing quality and consistency.
 * By integrating agentic AI for content generation, analysis, and ideation, it empowers
 * writers to overcome creative blocks, explore diverse narrative paths, and produce
 * commercially viable stories with unprecedented efficiency. The platform acts as a
 * strategic asset, enabling enterprises in entertainment, publishing, and marketing to
 * rapidly prototype and iterate on compelling narratives, thereby unlocking new revenue
 * streams and establishing a competitive advantage in content creation. Its structured data
 * models and AI-driven insights ensure higher narrative integrity and market relevance,
 * protecting intellectual property value and reducing the risk of project delays.
 */
import React, { useState, useReducer, useEffect, useCallback, createContext, useContext } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Global application name constant.
 */
export const APP_NAME = "Narrative Forge Pro";
/**
 * Global application version constant.
 */
export const APP_VERSION = "2.0.0-beta";
/**
 * Prefix for local storage keys to prevent conflicts.
 */
export const LOCAL_STORAGE_KEY_PREFIX = "narrativeForgePro_";
/**
 * Debounce delay in milliseconds for autosave operations.
 */
export const DEBOUNCE_SAVE_MS = 1000;
/**
 * Maximum number of AI suggestions for simpler prompts.
 */
export const MAX_AI_SUGGESTIONS = 5;
/**
 * Default maximum output tokens for AI responses.
 */
export const AI_MAX_TOKENS_DEFAULT = 2048;
/**
 * Default AI temperature setting (creativity).
 */
export const AI_TEMPERATURE_DEFAULT = 0.8;
/**
 * Default AI Top P setting (diversity).
 */
export const AI_TOP_P_DEFAULT = 0.95;
/**
 * Default AI Top K setting (diversity).
 */
export const AI_TOP_K_DEFAULT = 40;

/**
 * Generates a unique identifier string using random alphanumeric characters.
 * Business Value: Ensures uniqueness for all dynamic entities within the system,
 * critical for data integrity and preventing collisions in multi-user or
 * complex data environments.
 */
export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
/**
 * Formats a Date object into a locale-specific string.
 * Business Value: Provides consistent and user-friendly date representation across the application,
 * improving user experience and data readability.
 */
export const formatDate = (date: Date): string => date.toLocaleString();
/**
 * Debounces a function, delaying its execution until after a specified interval.
 * Business Value: Optimizes performance by limiting the frequency of expensive operations
 * (e.g., saving to local storage, API calls) triggered by rapid user input, preventing
 * resource exhaustion and enhancing application responsiveness.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

/**
 * Type definition for different notification styles.
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Interface representing a single notification message.
 */
export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    timeoutId?: NodeJS.Timeout;
}

/**
 * Union type for possible notification actions.
 */
export type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string };

/**
 * Reducer function for managing the state of notifications.
 * Business Value: Centralizes and streamlines the management of user feedback messages,
 * ensuring consistent and timely communication of application events (success, errors, info)
 * across the platform, which is vital for user trust and productivity.
 * @param state The current array of notifications.
 * @param action The action to perform on the notifications state.
 * @returns The new state of notifications.
 */
export const notificationReducer = (state: Notification[], action: NotificationAction): Notification[] => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return [...state, action.payload];
        case 'REMOVE_NOTIFICATION':
            return state.filter(n => n.id !== action.payload);
        default:
            return state;
    }
};

/**
 * React Context for managing notifications globally.
 */
export const NotificationContext = createContext<{
    notifications: Notification[];
    dispatch: React.Dispatch<NotificationAction>;
    addNotification: (message: string, type: NotificationType, duration?: number) => void;
}>({
    notifications: [],
    dispatch: () => { },
    addNotification: () => { },
});

/**
 * Provides a global notification system to its children components.
 * Business Value: Offers a robust, application-wide mechanism for delivering real-time
 * user feedback. This enhances operational clarity, reduces support inquiries by
 * proactively informing users of system status or issues, and improves overall
 * user satisfaction, directly contributing to user retention and engagement.
 * @param children The child components to render within the provider.
 */
export const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [notifications, dispatch] = useReducer(notificationReducer, []);

    const addNotification = useCallback((message: string, type: NotificationType, duration: number = 5000) => {
        const id = generateUniqueId();
        const newNotification: Notification = { id, message, type };
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

        const timeoutId = setTimeout(() => {
            dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
        }, duration);

        newNotification.timeoutId = timeoutId;
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, dispatch, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Custom hook to access the notification context.
 * Business Value: Simplifies access to the notification system, promoting reusable and clean code.
 */
export const useNotifications = () => useContext(NotificationContext);

/**
 * Renders a container for displaying all active notifications.
 * Business Value: Visually presents important system messages to the user in a non-intrusive
 * and accessible manner, ensuring critical information is conveyed effectively without
 * disrupting workflow. This contributes to a professional and reliable user experience.
 */
export const NotificationContainer: React.FC = () => {
    const { notifications, dispatch } = useNotifications();

    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'info': return 'bg-blue-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-gray-700';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {notifications.map(n => (
                <div key={n.id}
                    className={`${getNotificationColor(n.type)} text-white p-3 rounded-lg shadow-md flex justify-between items-center transition-opacity duration-300 ease-out animate-fade-in`}>
                    <span>{n.message}</span>
                    <button onClick={() => {
                        dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id });
                        if (n.timeoutId) clearTimeout(n.timeoutId);
                    }}
                        className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

/**
 * Configuration interface for AI model parameters.
 */
export interface AIConfig {
    model: string;
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    responseMimeType: string;
    responseSchema?: any;
}

/**
 * Default AI configuration settings.
 */
export const defaultAIConfig: AIConfig = {
    model: 'gemini-1.5-flash-latest',
    temperature: AI_TEMPERATURE_DEFAULT,
    topP: AI_TOP_P_DEFAULT,
    topK: AI_TOP_K_DEFAULT,
    maxOutputTokens: AI_MAX_TOKENS_DEFAULT,
    responseMimeType: "text/plain",
};

/**
 * Type definition for character personality traits.
 */
export type PersonalityTrait = 'sarcastic' | 'optimistic' | 'cynical' | 'brave' | 'cowardly' | 'loyal' | 'treacherous' | 'wise' | 'naive' | 'driven' | 'lazy' | 'charismatic' | 'reserved' | 'impulsive' | 'calm';

/**
 * Interface representing a character in a narrative project.
 */
export interface Character {
    id: string;
    name: string;
    description: string;
    backstory: string;
    motivations: string;
    goals: string;
    personalityTraits: PersonalityTrait[];
    dialogueStyle: string;
    relationships: { characterId: string; type: string; description: string }[];
    arcs: { arcId: string; type: 'internal' | 'external'; description: string }[];
    aiNotes: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty character object for initialization.
 */
export const emptyCharacter: Character = {
    id: '', name: '', description: '', backstory: '', motivations: '', goals: '',
    personalityTraits: [], dialogueStyle: '', relationships: [], arcs: [], aiNotes: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

/**
 * Type definition for different location types.
 */
export type LocationType = 'indoor' | 'outdoor' | 'city' | 'rural' | 'fantasy' | 'sci-fi' | 'historical' | 'specificBuilding' | 'naturalLandmark';

/**
 * Interface representing a location in a narrative project.
 */
export interface Location {
    id: string;
    name: string;
    type: LocationType;
    description: string;
    history: string;
    significance: string;
    keyElements: string[];
    mood: string;
    aiNotes: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty location object for initialization.
 */
export const emptyLocation: Location = {
    id: '', name: '', type: 'outdoor', description: '', history: '', significance: '',
    keyElements: [], mood: '', aiNotes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

/**
 * Type definition for scene mood.
 */
export type SceneMood = 'tense' | 'humorous' | 'dramatic' | 'romantic' | 'suspenseful' | 'calm' | 'action-packed';
/**
 * Type definition for scene pacing.
 */
export type ScenePacing = 'slow' | 'medium' | 'fast';

/**
 * Interface representing a scene in a narrative project.
 */
export interface Scene {
    id: string;
    title: string;
    synopsis: string;
    content: string;
    locationId: string;
    characterIds: string[];
    mood: SceneMood;
    pacing: ScenePacing;
    plotPointsCovered: string[];
    aiFeedback: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty scene object for initialization.
 */
export const emptyScene: Scene = {
    id: '', title: '', synopsis: '', content: '', locationId: '', characterIds: [],
    mood: 'calm', pacing: 'medium', plotPointsCovered: [], aiFeedback: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

/**
 * Type definition for different plot point types.
 */
export type PlotPointType = 'incitingIncident' | 'risingAction' | 'climax' | 'fallingAction' | 'resolution' | 'midpoint' | 'plotTwist' | 'reversal';

/**
 * Interface representing a plot point in a narrative project.
 */
export interface PlotPoint {
    id: string;
    title: string;
    type: PlotPointType;
    description: string;
    impactOnCharacters: string[];
    associatedScenes: string[];
    requiredElements: string[];
    aiSuggestions: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty plot point object for initialization.
 */
export const emptyPlotPoint: PlotPoint = {
    id: '', title: '', type: 'incitingIncident', description: '', impactOnCharacters: [],
    associatedScenes: [], requiredElements: [], aiSuggestions: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

/**
 * Type definition for different story arc types.
 */
export type StoryArcType = 'main' | 'sub_plot' | 'character_arc' | 'thematic';

/**
 * Interface representing a story arc in a narrative project.
 */
export interface StoryArc {
    id: string;
    title: string;
    type: StoryArcType;
    description: string;
    startPoint: string;
    endPoint: string;
    keyPlotPoints: string[];
    charactersInvolved: string[];
    aiAnalysis: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty story arc object for initialization.
 */
export const emptyStoryArc: StoryArc = {
    id: '', title: '', type: 'main', description: '', startPoint: '', endPoint: '',
    keyPlotPoints: [], charactersInvolved: [], aiAnalysis: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

/**
 * Type definition for AI chat message roles.
 */
export type AIChatRole = 'user' | 'model';

/**
 * Interface representing a single message in an AI chat history.
 */
export interface AIChatMessage {
    id: string;
    role: AIChatRole;
    content: string;
    timestamp: string;
    relatedEntityId?: string;
    relatedEntityType?: 'character' | 'scene' | 'location' | 'plot_point';
}

/**
 * Interface for project-specific settings and preferences.
 */
export interface ProjectSettings {
    projectId: string;
    lastOpenedPanel: AppPanel;
    autosaveEnabled: boolean;
    autoAIPropositions: boolean;
    preferredAIConfig: AIConfig;
    documentFont: string;
    documentFontSize: number;
    theme: 'dark' | 'light';
    showLineNumbers: boolean;
    exportFormat: 'fountain' | 'pdf' | 'html' | 'json';
    createdAt: string;
    updatedAt: string;
}

/**
 * Default project settings for new projects.
 */
export const defaultProjectSettings: ProjectSettings = {
    projectId: '',
    lastOpenedPanel: 'scriptEditor',
    autosaveEnabled: true,
    autoAIPropositions: false,
    preferredAIConfig: defaultAIConfig,
    documentFont: 'Inter',
    documentFontSize: 16,
    theme: 'dark',
    showLineNumbers: true,
    exportFormat: 'fountain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

/**
 * Interface representing an entire narrative project.
 */
export interface Project {
    id: string;
    name: string;
    logline: string;
    synopsis: string;
    genre: string[];
    targetAudience: string;
    characters: Character[];
    locations: Location[];
    scenes: Scene[];
    plotPoints: PlotPoint[];
    storyArcs: StoryArc[];
    aiChatHistory: AIChatMessage[];
    settings: ProjectSettings;
    createdAt: string;
    updatedAt: string;
}

/**
 * Empty project object for initialization, including a default initial scene.
 */
export const emptyProject: Project = {
    id: generateUniqueId(),
    name: 'New Project',
    logline: '',
    synopsis: '',
    genre: [],
    targetAudience: '',
    characters: [],
    locations: [],
    scenes: [{
        ...emptyScene,
        id: generateUniqueId(),
        title: 'Initial Scene',
        content: `[SCENE START]

INT. COFFEE SHOP - NIGHT

A coffee shop, moments before closing. Rain streaks down the windows.
ALEX (30s), tired and cynical, wipes down a counter.
MAYA (30s), energetic and optimistic, enters, shaking off an umbrella.

MAYA
You're still here.

ALEX
The world needs its caffeine, even at the bitter end.

MAYA
(Smiling)
The world needs its dreamers more. That's why I'm here. I have an idea.

ALEX
(Scoffs)
Another one? Does this one also involve teaching squirrels to code?
`
    }],
    plotPoints: [],
    storyArcs: [],
    aiChatHistory: [],
    settings: { ...defaultProjectSettings, projectId: '' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

/**
 * Type definition for different application panels.
 */
export type AppPanel =
    | 'dashboard'
    | 'scriptEditor'
    | 'characters'
    | 'locations'
    | 'plotBoard'
    | 'worldBuilder'
    | 'aiChat'
    | 'aiConfig'
    | 'projectSettings'
    | 'exportImport';

/**
 * Interface representing the global application state.
 */
export interface AppState {
    projects: Project[];
    activeProjectId: string | null;
    activePanel: AppPanel;
    currentAISuggestions: string[];
    isAILoading: boolean;
    aiError: string | null;
    currentAIRequestPrompt: string;
    selectedCharacterId: string | null;
    selectedLocationId: string | null;
    selectedSceneId: string | null;
    selectedPlotPointId: string | null;
    selectedStoryArcId: string | null;
    showModal: {
        type: 'newProject' | 'editCharacter' | 'editLocation' | 'editScene' | 'editPlotPoint' | 'editStoryArc' | 'confirmDelete' | null;
        isOpen: boolean;
        data?: any;
    };
}

/**
 * Initial state for the application.
 */
export const initialAppState: AppState = {
    projects: [],
    activeProjectId: null,
    activePanel: 'dashboard',
    currentAISuggestions: [],
    isAILoading: false,
    aiError: null,
    currentAIRequestPrompt: '',
    selectedCharacterId: null,
    selectedLocationId: null,
    selectedSceneId: null,
    selectedPlotPointId: null,
    selectedStoryArcId: null,
    showModal: { type: null, isOpen: false, data: null },
};

/**
 * Union type for all possible application actions.
 */
export type AppAction =
    | { type: 'SET_PROJECTS'; payload: Project[] }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'SET_ACTIVE_PROJECT'; payload: string | null }
    | { type: 'SET_ACTIVE_PANEL'; payload: AppPanel }
    | { type: 'SET_AI_LOADING'; payload: boolean }
    | { type: 'SET_AI_SUGGESTIONS'; payload: string[] }
    | { type: 'SET_AI_ERROR'; payload: string | null }
    | { type: 'SET_CURRENT_AI_REQUEST_PROMPT'; payload: string }
    | { type: 'ADD_CHARACTER'; payload: { projectId: string; character: Character } }
    | { type: 'UPDATE_CHARACTER'; payload: { projectId: string; character: Character } }
    | { type: 'DELETE_CHARACTER'; payload: { projectId: string; characterId: string } }
    | { type: 'SET_SELECTED_CHARACTER'; payload: string | null }
    | { type: 'ADD_LOCATION'; payload: { projectId: string; location: Location } }
    | { type: 'UPDATE_LOCATION'; payload: { projectId: string; location: Location } }
    | { type: 'DELETE_LOCATION'; payload: { projectId: string; locationId: string } }
    | { type: 'SET_SELECTED_LOCATION'; payload: string | null }
    | { type: 'ADD_SCENE'; payload: { projectId: string; scene: Scene } }
    | { type: 'UPDATE_SCENE'; payload: { projectId: string; scene: Scene } }
    | { type: 'DELETE_SCENE'; payload: { projectId: string; sceneId: string } }
    | { type: 'SET_SELECTED_SCENE'; payload: string | null }
    | { type: 'ADD_PLOT_POINT'; payload: { projectId: string; plotPoint: PlotPoint } }
    | { type: 'UPDATE_PLOT_POINT'; payload: { projectId: string; plotPoint: PlotPoint } }
    | { type: 'DELETE_PLOT_POINT'; payload: { projectId: string; plotPointId: string } }
    | { type: 'SET_SELECTED_PLOT_POINT'; payload: string | null }
    | { type: 'ADD_STORY_ARC'; payload: { projectId: string; storyArc: StoryArc } }
    | { type: 'UPDATE_STORY_ARC'; payload: { projectId: string; storyArc: StoryArc } }
    | { type: 'DELETE_STORY_ARC'; payload: { projectId: string; storyArcId: string } }
    | { type: 'SET_SELECTED_STORY_ARC'; payload: string | null }
    | { type: 'ADD_AI_CHAT_MESSAGE'; payload: { projectId: string; message: AIChatMessage } }
    | { type: 'UPDATE_PROJECT_SETTINGS'; payload: { projectId: string; settings: Partial<ProjectSettings> } }
    | { type: 'OPEN_MODAL'; payload: { type: AppState['showModal']['type']; data?: any } }
    | { type: 'CLOSE_MODAL' };

/**
 * Reducer function for managing the global application state.
 * Business Value: This central state management logic is the backbone of the application's
 * responsiveness and data consistency. It ensures all user interactions and AI operations
 * (e.g., adding a character, updating a scene, receiving AI suggestions) are processed
 * predictably and reliably. This robust data flow minimizes errors, simplifies debugging,
 * and maintains a high-fidelity representation of the user's creative project, directly
 * safeguarding intellectual property and accelerating project completion.
 * @param state The current application state.
 * @param action The action to perform on the application state.
 * @returns The new application state.
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            return { ...state, projects: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : p
                ),
            };
        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter(p => p.id !== action.payload),
                activeProjectId: state.activeProjectId === action.payload ? null : state.activeProjectId,
            };
        case 'SET_ACTIVE_PROJECT':
            return { ...state, activeProjectId: action.payload };
        case 'SET_ACTIVE_PANEL':
            return { ...state, activePanel: action.payload };
        case 'SET_AI_LOADING':
            return { ...state, isAILoading: action.payload };
        case 'SET_AI_SUGGESTIONS':
            return { ...state, currentAISuggestions: action.payload };
        case 'SET_AI_ERROR':
            return { ...state, aiError: action.payload };
        case 'SET_CURRENT_AI_REQUEST_PROMPT':
            return { ...state, currentAIRequestPrompt: action.payload };

        case 'ADD_CHARACTER':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, characters: [...p.characters, { ...action.payload.character, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
                        : p
                ),
            };
        case 'UPDATE_CHARACTER':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? {
                            ...p,
                            characters: p.characters.map(c =>
                                c.id === action.payload.character.id ? { ...action.payload.character, updatedAt: new Date().toISOString() } : c
                            ),
                        }
                        : p
                ),
            };
        case 'DELETE_CHARACTER':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, characters: p.characters.filter(c => c.id !== action.payload.characterId) }
                        : p
                ),
                selectedCharacterId: state.selectedCharacterId === action.payload.characterId ? null : state.selectedCharacterId,
            };
        case 'SET_SELECTED_CHARACTER':
            return { ...state, selectedCharacterId: action.payload };

        case 'ADD_LOCATION':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, locations: [...p.locations, { ...action.payload.location, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
                        : p
                ),
            };
        case 'UPDATE_LOCATION':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? {
                            ...p,
                            locations: p.locations.map(l =>
                                l.id === action.payload.location.id ? { ...action.payload.location, updatedAt: new Date().toISOString() } : l
                            ),
                        }
                        : p
                ),
            };
        case 'DELETE_LOCATION':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, locations: p.locations.filter(l => l.id !== action.payload.locationId) }
                        : p
                ),
                selectedLocationId: state.selectedLocationId === action.payload.locationId ? null : state.selectedLocationId,
            };
        case 'SET_SELECTED_LOCATION':
            return { ...state, selectedLocationId: action.payload };

        case 'ADD_SCENE':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, scenes: [...p.scenes, { ...action.payload.scene, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
                        : p
                ),
            };
        case 'UPDATE_SCENE':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? {
                            ...p,
                            scenes: p.scenes.map(s =>
                                s.id === action.payload.scene.id ? { ...action.payload.scene, updatedAt: new Date().toISOString() } : s
                            ),
                        }
                        : p
                ),
            };
        case 'DELETE_SCENE':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, scenes: p.scenes.filter(s => s.id !== action.payload.sceneId) }
                        : p
                ),
                selectedSceneId: state.selectedSceneId === action.payload.sceneId ? null : state.selectedSceneId,
            };
        case 'SET_SELECTED_SCENE':
            return { ...state, selectedSceneId: action.payload };

        case 'ADD_PLOT_POINT':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, plotPoints: [...p.plotPoints, { ...action.payload.plotPoint, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
                        : p
                ),
            };
        case 'UPDATE_PLOT_POINT':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? {
                            ...p,
                            plotPoints: p.plotPoints.map(pp =>
                                pp.id === action.payload.plotPoint.id ? { ...action.payload.plotPoint, updatedAt: new Date().toISOString() } : pp
                            ),
                        }
                        : p
                ),
            };
        case 'DELETE_PLOT_POINT':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, plotPoints: p.plotPoints.filter(pp => pp.id !== action.payload.plotPointId) }
                        : p
                ),
                selectedPlotPointId: state.selectedPlotPointId === action.payload.plotPointId ? null : state.selectedPlotPointId,
            };
        case 'SET_SELECTED_PLOT_POINT':
            return { ...state, selectedPlotPointId: action.payload };

        case 'ADD_STORY_ARC':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, storyArcs: [...p.storyArcs, { ...action.payload.storyArc, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }
                        : p
                ),
            };
        case 'UPDATE_STORY_ARC':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? {
                            ...p,
                            storyArcs: p.storyArcs.map(sa =>
                                sa.id === action.payload.storyArc.id ? { ...action.payload.storyArc, updatedAt: new Date().toISOString() } : sa
                            ),
                        }
                        : p
                ),
            };
        case 'DELETE_STORY_ARC':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, storyArcs: p.storyArcs.filter(sa => sa.id !== action.payload.storyArcId) }
                        : p
                ),
                selectedStoryArcId: state.selectedStoryArcId === action.payload.storyArcId ? null : state.selectedStoryArcId,
            };
        case 'SET_SELECTED_STORY_ARC':
            return { ...state, selectedStoryArcId: action.payload };

        case 'ADD_AI_CHAT_MESSAGE':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, aiChatHistory: [...p.aiChatHistory, action.payload.message] }
                        : p
                ),
            };
        case 'UPDATE_PROJECT_SETTINGS':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.projectId
                        ? { ...p, settings: { ...p.settings, ...action.payload.settings, updatedAt: new Date().toISOString() } }
                        : p
                ),
            };
        case 'OPEN_MODAL':
            return { ...state, showModal: { type: action.payload.type, isOpen: true, data: action.payload.data } };
        case 'CLOSE_MODAL':
            return { ...state, showModal: { type: null, isOpen: false, data: null } };
        default:
            return state;
    }
};

/**
 * Saves the current application state (specifically projects) to local storage.
 * Business Value: Ensures data persistence across user sessions, preventing loss of creative
 * work and providing a seamless, reliable user experience. This robust data durability
 * is crucial for maintaining user trust and the integrity of high-value narrative assets.
 * @param state The current application state to save.
 */
export const saveAppStateToLocalStorage = (state: AppState) => {
    try {
        const serializedState = JSON.stringify(state.projects);
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}projects`, serializedState);
    } catch (error) {
        console.error("Error saving state to local storage:", error);
    }
};

/**
 * Loads project data from local storage.
 * Business Value: Recovers previously saved creative projects, enabling users to continue
 * their work without interruption. This critical functionality ensures data availability
 * and underpins the platform's reliability, directly impacting user productivity and
 * satisfaction.
 * @returns An array of loaded Project objects.
 */
export const loadAppStateFromLocalStorage = (): AppState['projects'] => {
    try {
        const serializedState = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}projects`);
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState) as Project[];
    } catch (error) {
        console.error("Error loading state from local storage:", error);
        return [];
    }
};

/**
 * Service wrapper for interacting with the Google Generative AI API.
 * Business Value: This service encapsulates all AI interactions, providing a secure and
 * performant interface for leveraging advanced generative AI in narrative creation.
 * It is central to the platform's value proposition, enabling features like automated
 * dialogue generation, character concepting, plot analysis, and world-building.
 * The abstraction ensures maintainability, allows for easy model upgrades, and isolates
 * sensitive API key management, contributing to robust security and competitive advantage.
 */
export class GoogleGenAIService {
    private ai: GoogleGenAI;
    private apiKey: string;

    /**
     * Constructs the GoogleGenAIService.
     * @param apiKey The API key for Google Generative AI.
     */
    constructor(apiKey: string) {
        if (!apiKey || apiKey === 'undefined') {
            console.warn("Google Gen AI API Key is missing or invalid. AI features will be disabled or limited.");
            this.apiKey = 'dummy_key';
        } else {
            this.apiKey = apiKey;
        }
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }

    /**
     * Configures the model parameters for an AI request.
     * @param config The AI configuration settings.
     * @returns An object conforming to the AI model's expected configuration.
     */
    private getModelConfig(config: AIConfig) {
        return {
            model: config.model,
            contents: '',
            config: {
                temperature: config.temperature,
                topP: config.topP,
                topK: config.topK,
                maxOutputTokens: config.maxOutputTokens,
                responseMimeType: config.responseMimeType,
                responseSchema: config.responseSchema
            }
        };
    }

    /**
     * Generates content from the AI model based on a prompt and configuration.
     * @param prompt The input prompt for the AI.
     * @param config The AI configuration to use.
     * @returns The generated text content from the AI.
     * @throws Error if the API key is not configured or generation fails.
     */
    public async generateContent(prompt: string, config: AIConfig): Promise<any> {
        if (this.apiKey === 'dummy_key') {
            throw new Error("AI functionality is disabled: API Key not configured.");
        }
        try {
            const modelConfig = this.getModelConfig(config);
            modelConfig.contents = prompt;
            const model = this.ai.getGenerativeModel({ model: config.model, generationConfig: modelConfig.config });
            const response = await model.generateContent(prompt);
            return response.response.text();
        } catch (e) {
            console.error("Error generating content:", e);
            throw new Error(`AI content generation failed: ${(e as Error).message}`);
        }
    }

    /**
     * Generates dialogue suggestions for a given script context and user request.
     * Business Value: Significantly boosts writer productivity by offering instant, context-aware
     * dialogue options. This reduces creative blocks, ensures character voice consistency,
     * and accelerates scene development, directly shortening project timelines and reducing
     * labor costs.
     * @param scriptContext The current script content or scene description.
     * @param requestPrompt The user's specific request for dialogue.
     * @param config The AI configuration to use.
     * @returns An array of suggested dialogue lines.
     * @throws Error if AI generation or parsing fails.
     */
    public async generateDialogueSuggestions(scriptContext: string, requestPrompt: string, config: AIConfig): Promise<string[]> {
        const schema = { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
        const dialogueConfig = { ...config, responseMimeType: "application/json", responseSchema: schema };

        const fullPrompt = `You are an expert screenwriter. Based on the following scene context, generate ${MAX_AI_SUGGESTIONS} alternative lines of dialogue that match the user's request. Focus on tone, character voice, and plot advancement. Provide only the dialogue lines.

            **Scene Context:**
            ${scriptContext}

            **User Request:**
            ${requestPrompt}

            Output must be a JSON object with a single key 'suggestions' which is an array of strings.`;

        const responseText = await this.generateContent(fullPrompt, dialogueConfig);
        try {
            const result = JSON.parse(responseText);
            return result.suggestions || [];
        } catch (e) {
            console.error("Failed to parse AI dialogue suggestions:", responseText, e);
            throw new Error("Failed to parse AI dialogue suggestions.");
        }
    }

    /**
     * Generates a detailed character concept based on a high-level description.
     * Business Value: Streamlines the character development process, allowing writers to
     * rapidly prototype diverse personalities, backstories, and motivations. This accelerates
     * pre-production, reduces the need for extensive manual brainstorming, and ensures
     * richer, more consistent character arcs across large projects.
     * @param characterDescription A high-level concept for the character.
     * @param config The AI configuration to use.
     * @returns A fully populated Character object.
     * @throws Error if AI generation or parsing fails.
     */
    public async generateCharacterConcept(characterDescription: string, config: AIConfig): Promise<Character> {
        const schema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                backstory: { type: Type.STRING },
                motivations: { type: Type.STRING },
                goals: { type: Type.STRING },
                personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                dialogueStyle: { type: Type.STRING },
                aiNotes: { type: Type.STRING }
            },
            required: ['name', 'description', 'backstory', 'motivations', 'goals', 'personalityTraits', 'dialogueStyle', 'aiNotes']
        };
        const characterConfig = { ...config, responseMimeType: "application/json", responseSchema: schema };

        const fullPrompt = `You are an expert character designer for a narrative. Based on the following high-level concept, generate a detailed character profile in JSON format.
            Concept: ${characterDescription}

            Ensure personalityTraits is an array of strings, and aiNotes contains additional insights.
            Output must be a JSON object following the provided schema.`;

        const responseText = await this.generateContent(fullPrompt, characterConfig);
        try {
            const result = JSON.parse(responseText);
            return {
                ...emptyCharacter,
                id: generateUniqueId(),
                ...result,
                personalityTraits: (result.personalityTraits || []).filter((t: string): t is PersonalityTrait => Object.values(Character).includes(t as PersonalityTrait)),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        } catch (e) {
            console.error("Failed to parse AI character concept:", responseText, e);
            throw new Error("Failed to parse AI character concept.");
        }
    }

    /**
     * Generates a detailed location concept based on a high-level description.
     * Business Value: Accelerates world-building and scene-setting by providing richly
     * described locations that fit narrative requirements. This functionality reduces
     * the manual effort in crafting immersive environments, ensuring consistency and
     * detail across an entire project, critical for large-scale content production.
     * @param locationDescription A high-level concept for the location.
     * @param config The AI configuration to use.
     * @returns A fully populated Location object.
     * @throws Error if AI generation or parsing fails.
     */
    public async generateLocationConcept(locationDescription: string, config: AIConfig): Promise<Location> {
        const schema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['indoor', 'outdoor', 'city', 'rural', 'fantasy', 'sci-fi', 'historical', 'specificBuilding', 'naturalLandmark'] },
                description: { type: Type.STRING },
                history: { type: Type.STRING },
                significance: { type: Type.STRING },
                keyElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                mood: { type: Type.STRING },
                aiNotes: { type: Type.STRING }
            },
            required: ['name', 'type', 'description', 'history', 'significance', 'keyElements', 'mood', 'aiNotes']
        };
        const locationConfig = { ...config, responseMimeType: "application/json", responseSchema: schema };

        const fullPrompt = `You are an expert location designer for a narrative. Based on the following high-level concept, generate a detailed location profile in JSON format.
            Concept: ${locationDescription}

            Ensure keyElements is an array of strings, and aiNotes contains additional insights.
            Output must be a JSON object following the provided schema.`;

        const responseText = await this.generateContent(fullPrompt, locationConfig);
        try {
            const result = JSON.parse(responseText);
            return {
                ...emptyLocation,
                id: generateUniqueId(),
                ...result,
                type: (result.type || 'outdoor') as LocationType,
                keyElements: result.keyElements || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        } catch (e) {
            console.error("Failed to parse AI location concept:", responseText, e);
            throw new Error("Failed to parse AI location concept.");
        }
    }

    /**
     * Analyzes a script section for specific aspects like pacing, character arc, or plot holes.
     * Business Value: Provides invaluable editorial feedback at scale, identifying structural
     * and narrative weaknesses that would otherwise require extensive human review. This
     * accelerates the revision process, improves script quality, and reduces costs associated
     * with professional editing, ensuring faster path to production readiness.
     * @param scriptSection The script content to analyze.
     * @param analysisType The type of analysis to perform.
     * @param config The AI configuration to use.
     * @returns A string containing the AI's analysis and suggestions.
     * @throws Error if AI generation fails.
     */
    public async analyzeScriptSection(scriptSection: string, analysisType: 'pacing' | 'character_arc' | 'plot_holes' | 'tone_consistency', config: AIConfig): Promise<string> {
        const fullPrompt = `As a professional script editor, analyze the following script section for ${analysisType}. Provide constructive feedback and suggestions for improvement.

            **Script Section:**
            ${scriptSection}

            **Analysis Focus:** ${analysisType}`;

        return this.generateContent(fullPrompt, config);
    }

    /**
     * Generates new plot point ideas based on the current project context.
     * Business Value: Overcomes creative stagnation by offering novel and contextually
     * relevant plot developments. This tool enables writers to quickly expand and refine
     * their story outlines, ensuring a compelling and dynamic narrative flow, which is
     * essential for market success and audience engagement.
     * @param projectContext A partial Project object providing context (name, logline, characters, existing plot points).
     * @param config The AI configuration to use.
     * @returns An array of suggested plot point ideas.
     * @throws Error if AI generation or parsing fails.
     */
    public async generatePlotPointIdeas(projectContext: Partial<Project>, config: AIConfig): Promise<string[]> {
        const schema = { type: Type.OBJECT, properties: { ideas: { type: Type.ARRAY, items: { type: Type.STRING } } } };
        const plotConfig = { ...config, responseMimeType: "application/json", responseSchema: schema };

        const projectSummary = `Project Name: ${projectContext.name || 'Untitled'}
            Logline: ${projectContext.logline || 'Not set'}
            Synopsis: ${projectContext.synopsis || 'Not set'}
            Characters: ${projectContext.characters?.map(c => c.name).join(', ') || 'None'}
            Existing Plot Points: ${projectContext.plotPoints?.map(pp => pp.title).join(', ') || 'None'}`;

        const fullPrompt = `You are an expert storyteller. Based on the following project context, suggest ${MAX_AI_SUGGESTIONS} compelling plot point ideas that could advance the narrative or introduce new conflicts.

            **Project Context:**
            ${projectSummary}

            Output must be a JSON object with a single key 'ideas' which is an array of strings.`;

        const responseText = await this.generateContent(fullPrompt, plotConfig);
        try {
            const result = JSON.parse(responseText);
            return result.ideas || [];
        } catch (e) {
            console.error("Failed to parse AI plot point ideas:", responseText, e);
            throw new Error("Failed to parse AI plot point ideas.");
        }
    }

    /**
     * Enables a multi-turn chat interaction with the AI assistant, providing project context.
     * Business Value: Acts as an always-available creative partner, offering real-time
     * brainstorming, problem-solving, and guidance. This interactive agentic AI reduces
     * creative friction, provides personalized support, and helps writers explore ideas
     * dynamically, leading to more innovative and successful narrative outcomes.
     * @param messages The array of chat messages (history).
     * @param currentProject The active project context.
     * @param config The AI configuration to use.
     * @returns The AI's response message.
     * @throws Error if AI chat generation fails.
     */
    public async chatWithAI(messages: AIChatMessage[], currentProject: Project, config: AIConfig): Promise<string> {
        if (this.apiKey === 'dummy_key') {
            throw new Error("AI functionality is disabled: API Key not configured.");
        }
        try {
            const projectContext = `Project Name: ${currentProject.name}
            Logline: ${currentProject.logline}
            Synopsis: ${currentProject.synopsis}
            Characters: ${currentProject.characters.map(c => c.name + " (" + c.description + ")").join('; ')}
            Locations: ${currentProject.locations.map(l => l.name + " (" + l.description + ")").join('; ')}
            Current Script Excerpt (if available, e.g. last scene): ${currentProject.scenes[currentProject.scenes.length - 1]?.content || 'N/A'}`;

            const historyForAPI = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const model = this.ai.getGenerativeModel({ model: config.model, generationConfig: config });
            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: `You are a helpful and creative AI writing assistant, specialized in narrative development. You have access to the following project information:\n\n**Project Context:**\n${projectContext}\n\nBased on this, please assist the user.` }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Understood. I am ready to help with your project. What would you like to discuss or generate?' }]
                    },
                    ...historyForAPI.slice(0, -1)
                ]
            });

            const latestUserMessage = messages[messages.length - 1].content;
            const result = await chat.sendMessage(latestUserMessage);
            const response = await result.response;
            return response.text();
        } catch (e) {
            console.error("Error in AI chat interaction:", e);
            throw new Error(`AI chat failed: ${(e as Error).message}`);
        }
    }

    /**
     * Generates world lore (e.g., history, rules, cultural aspects) based on project context.
     * Business Value: Facilitates the creation of rich, consistent, and deeply immersive
     * fictional worlds. This AI capability saves significant development time for complex
     * projects (e.g., fantasy, sci-fi), ensuring that world-building elements are coherent
     * and strategically aligned with the narrative, enhancing the overall commercial appeal
     * and depth of the intellectual property.
     * @param projectContext The active project context.
     * @param userPrompt A specific prompt from the user for lore generation.
     * @param config The AI configuration to use.
     * @returns A string containing generated world lore.
     * @throws Error if AI generation fails.
     */
    public async generateWorldLore(projectContext: Project, userPrompt: string, config: AIConfig): Promise<string> {
        const fullProjectContext = `Project Name: ${projectContext.name}
Logline: ${projectContext.logline}
Synopsis: ${projectContext.synopsis}
Genres: ${projectContext.genre.join(', ')}
Characters: ${projectContext.characters.map(c => `${c.name} (${c.description})`).join('; ')}
Locations: ${projectContext.locations.map(l => `${l.name} (${l.description})`).join('; ')}
Story Arcs: ${projectContext.storyArcs.map(sa => `${sa.title} (${sa.description})`).join('; ')}
Existing Lore/World Rules: (if any in project.settings or a dedicated field)

User Request: ${userPrompt}`;

        const prompt = `You are an expert world-builder and lore master. Based on the provided project context, generate detailed and consistent world lore related to the user's request. Focus on history, culture, magic/tech systems, or social structures.

Context:
${fullProjectContext}

Please provide a comprehensive and engaging response.`;

        return this.generateContent(prompt, config);
    }
}

/**
 * Global instance of the GoogleGenAIService.
 */
export const aiService = new GoogleGenAIService(process.env.NEXT_PUBLIC_API_KEY as string);

/**
 * A reusable modal component for displaying dialogs and forms.
 * Business Value: Provides a standardized, accessible, and user-friendly interface for
 * critical interactions. Consistent modal design improves user experience, reduces
 * learning curves, and ensures important workflows (e.g., confirmations, data entry)
 * are handled efficiently, contributing to professional application quality.
 * @param isOpen Whether the modal is currently open.
 * @param title The title displayed at the top of the modal.
 * @param onClose Callback function to close the modal.
 * @param children The content to display inside the modal body.
 */
export const Modal: React.FC<React.PropsWithChildren<{ isOpen: boolean; title: string; onClose: () => void }>> = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * A standardized input field component.
 * Business Value: Ensures UI consistency and simplifies form development.
 * Standardized input fields improve user data entry accuracy and reduce development time.
 * @param label The label for the input field.
 * @param value The current value of the input.
 * @param onChange Callback function for value changes.
 * @param placeholder The placeholder text for the input.
 * @param type The HTML input type (e.g., 'text', 'number').
 * @param className Additional CSS classes.
 */
export const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; className?: string; disabled?: boolean }> = ({ label, value, onChange, placeholder, type = 'text', className, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-700/50 p-2 rounded text-white border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        />
    </div>
);

/**
 * A standardized textarea field component.
 * Business Value: Provides a consistent and expandable input area for longer text inputs.
 * Essential for narrative applications where detailed descriptions are required,
 * ensuring a good user experience for content creation.
 * @param label The label for the textarea.
 * @param value The current value of the textarea.
 * @param onChange Callback function for value changes.
 * @param placeholder The placeholder text for the textarea.
 * @param rows The number of visible text lines.
 * @param className Additional CSS classes.
 */
export const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; className?: string }> = ({ label, value, onChange, placeholder, rows = 3, className }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full bg-gray-700/50 p-2 rounded text-white border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition-colors ${className}`}
        />
    </div>
);

/**
 * A standardized select dropdown field component.
 * Business Value: Ensures consistent presentation and functionality for choice-based inputs.
 * Improves data integrity by guiding user selection, reducing input errors, and streamlining
 * form interactions across the application.
 * @param label The label for the select field.
 * @param value The current selected value.
 * @param onChange Callback function for value changes.
 * @param options An array of options to display in the dropdown.
 * @param className Additional CSS classes.
 */
export const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string; disabled?: boolean }[]; className?: string; multiple?: boolean }> = ({ label, value, onChange, options, className, multiple = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            multiple={multiple}
            className={`w-full bg-gray-700/50 p-2 rounded text-white border border-transparent focus:border-cyan-500 focus:ring-cyan-500 transition-colors ${className}`}
        >
            {options.map(option => (
                <option key={option.value || option.label} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

/**
 * A confirmation modal for delete operations.
 * Business Value: Implements a crucial safety mechanism, preventing accidental data loss.
 * This explicit confirmation flow protects valuable user-generated content, enhances
 * data governance, and builds user confidence in the platform's reliability,
 * safeguarding intellectual property.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onConfirm Callback to confirm the deletion.
 * @param message The confirmation message to display.
 */
export const ConfirmDeleteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}> = ({ isOpen, onClose, onConfirm, message }) => (
    <Modal isOpen={isOpen} title="Confirm Deletion" onClose={onClose}>
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">Delete</button>
        </div>
    </Modal>
);

/**
 * Modal form for creating or editing a narrative project.
 * Business Value: Centralizes the creation and management of core narrative projects.
 * This streamlined interface enables rapid project initiation and modification,
 * serving as the entry point for all creative endeavors within the platform.
 * Efficient project management directly contributes to development velocity and
 * organized content production.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the project data.
 * @param initialProject Optional initial project data for editing.
 */
export const ProjectFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (project: Project) => void;
    initialProject?: Project;
}> = ({ isOpen, onClose, onSubmit, initialProject = emptyProject }) => {
    const [project, setProject] = useState<Project>(initialProject);

    useEffect(() => {
        if (isOpen) {
            setProject(initialProject);
        }
    }, [initialProject, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit({ ...project, id: project.id || generateUniqueId(), settings: { ...project.settings, projectId: project.id || generateUniqueId() } });
    };

    return (
        <Modal isOpen={isOpen} title={initialProject.id ? "Edit Project" : "Create New Project"} onClose={onClose}>
            <InputField label="Project Name" name="name" value={project.name} onChange={handleChange} />
            <TextareaField label="Logline" name="logline" value={project.logline} onChange={handleChange} rows={2} />
            <TextareaField label="Synopsis" name="synopsis" value={project.synopsis} onChange={handleChange} rows={5} />
            <InputField label="Genre (comma separated)" name="genre" value={project.genre.join(', ')} onChange={(e) => setProject(prev => ({ ...prev, genre: e.target.value.split(',').map(g => g.trim()).filter(Boolean) }))} />
            <InputField label="Target Audience" name="targetAudience" value={project.targetAudience} onChange={handleChange} />
            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Project</button>
            </div>
        </Modal>
    );
};

/**
 * Modal form for creating or editing character profiles, with AI suggestion integration.
 * Business Value: Accelerates the critical character development phase by enabling rapid
 * data entry and integrating AI-generated concepts. This reduces creative bottlenecks,
 * ensures detailed and consistent character profiles, and supports iterative design,
 * ultimately saving time and resources in narrative production.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the character data.
 * @param initialCharacter Optional initial character data for editing.
 * @param aiSuggestions Optional AI-generated suggestions for character traits/details.
 */
export const CharacterFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (character: Character) => void;
    initialCharacter?: Character;
    aiSuggestions?: string[];
}> = ({ isOpen, onClose, onSubmit, initialCharacter = emptyCharacter, aiSuggestions = [] }) => {
    const [character, setCharacter] = useState<Character>(initialCharacter);
    const [newTrait, setNewTrait] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCharacter(initialCharacter);
        }
    }, [initialCharacter, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCharacter(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTrait = () => {
        if (newTrait.trim() && !character.personalityTraits.includes(newTrait.trim() as PersonalityTrait)) {
            setCharacter(prev => ({ ...prev, personalityTraits: [...prev.personalityTraits, newTrait.trim() as PersonalityTrait] }));
            setNewTrait('');
        }
    };

    const handleRemoveTrait = (traitToRemove: PersonalityTrait) => {
        setCharacter(prev => ({ ...prev, personalityTraits: prev.personalityTraits.filter(t => t !== traitToRemove) }));
    };

    const handleSubmit = () => {
        onSubmit({ ...character, id: character.id || generateUniqueId() });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} title={initialCharacter.id ? "Edit Character" : "Create New Character"} onClose={onClose}>
            <InputField label="Name" name="name" value={character.name} onChange={handleChange} />
            <TextareaField label="Description (Physical, brief summary)" name="description" value={character.description} onChange={handleChange} />
            <TextareaField label="Backstory" name="backstory" value={character.backstory} onChange={handleChange} />
            <TextareaField label="Motivations" name="motivations" value={character.motivations} onChange={handleChange} />
            <TextareaField label="Goals" name="goals" value={character.goals} onChange={handleChange} />
            <TextareaField label="Dialogue Style" name="dialogueStyle" value={character.dialogueStyle} onChange={handleChange} />

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Personality Traits</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {character.personalityTraits.map(trait => (
                        <span key={trait} className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            {trait}
                            <button onClick={() => handleRemoveTrait(trait)} className="ml-1 text-red-300 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newTrait}
                        onChange={(e) => setNewTrait(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTrait(); } }}
                        placeholder="Add new trait"
                        className="flex-grow bg-gray-700/50 p-2 rounded text-white border border-transparent focus:border-cyan-500"
                    />
                    <button onClick={handleAddTrait} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white">Add</button>
                </div>
            </div>

            {aiSuggestions.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300">AI Suggestions:</h4>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Character</button>
            </div>
        </Modal>
    );
};

/**
 * Modal form for creating or editing location details, with AI suggestion integration.
 * Business Value: Facilitates the efficient development of rich and detailed fictional
 * environments. By integrating AI suggestions, it streamlines the world-building process,
 * ensuring consistency and depth in setting descriptions, which is vital for immersive
 * storytelling and reducing production timelines for complex projects.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the location data.
 * @param initialLocation Optional initial location data for editing.
 * @param aiSuggestions Optional AI-generated suggestions for location details.
 */
export const LocationFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (location: Location) => void;
    initialLocation?: Location;
    aiSuggestions?: string[];
}> = ({ isOpen, onClose, onSubmit, initialLocation = emptyLocation, aiSuggestions = [] }) => {
    const [location, setLocation] = useState<Location>(initialLocation);
    const [newElement, setNewElement] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLocation(initialLocation);
        }
    }, [initialLocation, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocation(prev => ({ ...prev, [name]: value }));
    };

    const handleAddElement = () => {
        if (newElement.trim() && !location.keyElements.includes(newElement.trim())) {
            setLocation(prev => ({ ...prev, keyElements: [...prev.keyElements, newElement.trim()] }));
            setNewElement('');
        }
    };

    const handleRemoveElement = (elementToRemove: string) => {
        setLocation(prev => ({ ...prev, keyElements: prev.keyElements.filter(el => el !== elementToRemove) }));
    };

    const handleSubmit = () => {
        onSubmit({ ...location, id: location.id || generateUniqueId() });
        onClose();
    };

    const locationTypeOptions = [
        { value: 'indoor', label: 'Indoor' }, { value: 'outdoor', label: 'Outdoor' },
        { value: 'city', label: 'City' }, { value: 'rural', label: 'Rural' },
        { value: 'fantasy', label: 'Fantasy' }, { value: 'sci-fi', label: 'Sci-Fi' },
        { value: 'historical', label: 'Historical' }, { value: 'specificBuilding', label: 'Specific Building' },
        { value: 'naturalLandmark', label: 'Natural Landmark' }
    ];

    return (
        <Modal isOpen={isOpen} title={initialLocation.id ? "Edit Location" : "Create New Location"} onClose={onClose}>
            <InputField label="Name" name="name" value={location.name} onChange={handleChange} />
            <SelectField label="Type" name="type" value={location.type} onChange={handleChange} options={locationTypeOptions} />
            <TextareaField label="Description (Visuals, atmosphere)" name="description" value={location.description} onChange={handleChange} />
            <TextareaField label="History" name="history" value={location.history} onChange={handleChange} />
            <TextareaField label="Significance to Story" name="significance" value={location.significance} onChange={handleChange} />
            <InputField label="Mood" name="mood" value={location.mood} onChange={handleChange} />

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Key Elements</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {location.keyElements.map(element => (
                        <span key={element} className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            {element}
                            <button onClick={() => handleRemoveElement(element)} className="ml-1 text-red-300 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newElement}
                        onChange={(e) => setNewElement(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddElement(); } }}
                        placeholder="Add key element"
                        className="flex-grow bg-gray-700/50 p-2 rounded text-white border border-transparent focus:border-cyan-500"
                    />
                    <button onClick={handleAddElement} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white">Add</button>
                </div>
            </div>

            {aiSuggestions.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300">AI Suggestions:</h4>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Location</button>
            </div>
        </Modal>
    );
};

/**
 * Modal form for creating or editing scene details, linking to characters, locations, and plot points.
 * Business Value: Provides a structured interface for defining and organizing individual scenes,
 * a fundamental unit of narrative. This ensures scene consistency, proper linkage to other
 * story elements, and clear pacing, which is crucial for maintaining story integrity
 * and facilitating collaborative writing workflows.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the scene data.
 * @param initialScene Optional initial scene data for editing.
 * @param locations Array of available locations for selection.
 * @param characters Array of available characters for selection.
 * @param plotPoints Array of available plot points for selection.
 * @param aiFeedback Optional AI-generated feedback for the scene.
 */
export const SceneFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (scene: Scene) => void;
    initialScene?: Scene;
    locations: Location[];
    characters: Character[];
    plotPoints: PlotPoint[];
    aiFeedback?: string;
}> = ({ isOpen, onClose, onSubmit, initialScene = emptyScene, locations, characters, plotPoints, aiFeedback }) => {
    const [scene, setScene] = useState<Scene>(initialScene);

    useEffect(() => {
        if (isOpen) {
            setScene(initialScene);
        }
    }, [initialScene, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setScene(prev => ({ ...prev, [name]: value }));
    };

    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setScene(prev => ({ ...prev, characterIds: selectedOptions }));
    };

    const handlePlotPointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setScene(prev => ({ ...prev, plotPointsCovered: selectedOptions }));
    };

    const handleSubmit = () => {
        onSubmit({ ...scene, id: scene.id || generateUniqueId() });
        onClose();
    };

    const sceneMoodOptions = [
        { value: 'tense', label: 'Tense' }, { value: 'humorous', label: 'Humorous' },
        { value: 'dramatic', label: 'Dramatic' }, { value: 'romantic', label: 'Romantic' },
        { value: 'suspenseful', label: 'Suspenseful' }, { value: 'calm', label: 'Calm' },
        { value: 'action-packed', label: 'Action-Packed' }
    ];
    const scenePacingOptions = [
        { value: 'slow', label: 'Slow' }, { value: 'medium', label: 'Medium' },
        { value: 'fast', label: 'Fast' }
    ];

    return (
        <Modal isOpen={isOpen} title={initialScene.id ? "Edit Scene" : "Create New Scene"} onClose={onClose}>
            <InputField label="Title" name="title" value={scene.title} onChange={handleChange} />
            <TextareaField label="Synopsis" name="synopsis" value={scene.synopsis} onChange={handleChange} />
            <TextareaField label="Content (Script)" name="content" value={scene.content} onChange={handleChange} rows={10} className="font-mono text-sm" />

            <SelectField
                label="Primary Location"
                name="locationId"
                value={scene.locationId}
                onChange={handleChange}
                options={[{ value: '', label: 'None' }, ...locations.map(loc => ({ value: loc.id, label: loc.name }))]}
            />
            <SelectField
                label="Characters Present"
                name="characterIds"
                value={''}
                onChange={handleCharacterChange}
                options={characters.map(char => ({ value: char.id, label: char.name }))}
                className="h-24"
                multiple
            />
            <SelectField
                label="Plot Points Covered"
                name="plotPointsCovered"
                value={''}
                onChange={handlePlotPointChange}
                options={plotPoints.map(pp => ({ value: pp.id, label: pp.title }))}
                className="h-24"
                multiple
            />
            <SelectField label="Mood" name="mood" value={scene.mood} onChange={handleChange} options={sceneMoodOptions} />
            <SelectField label="Pacing" name="pacing" value={scene.pacing} onChange={handleChange} options={scenePacingOptions} />

            {aiFeedback && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300">AI Feedback:</h4>
                    <p className="text-gray-400 text-sm bg-gray-900/50 p-3 rounded italic">{aiFeedback}</p>
                </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Scene</button>
            </div>
        </Modal>
    );
};

/**
 * Modal form for creating or editing plot points, linking to characters and scenes.
 * Business Value: Provides a structured way to define and manage key narrative beats,
 * ensuring logical progression and impact. This visual and structured approach to
 * plot development helps maintain story coherence, identify gaps, and supports
 * complex multi-arc narratives, critical for professional storytelling.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the plot point data.
 * @param initialPlotPoint Optional initial plot point data for editing.
 * @param characters Array of available characters for selection.
 * @param scenes Array of available scenes for selection.
 * @param aiSuggestions Optional AI-generated suggestions for plot points.
 */
export const PlotPointFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plotPoint: PlotPoint) => void;
    initialPlotPoint?: PlotPoint;
    characters: Character[];
    scenes: Scene[];
    aiSuggestions?: string[];
}> = ({ isOpen, onClose, onSubmit, initialPlotPoint = emptyPlotPoint, characters, scenes, aiSuggestions = [] }) => {
    const [plotPoint, setPlotPoint] = useState<PlotPoint>(initialPlotPoint);

    useEffect(() => {
        if (isOpen) {
            setPlotPoint(initialPlotPoint);
        }
    }, [initialPlotPoint, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlotPoint(prev => ({ ...prev, [name]: value }));
    };

    const handleCharacterImpactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setPlotPoint(prev => ({ ...prev, impactOnCharacters: selectedOptions }));
    };

    const handleAssociatedScenesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setPlotPoint(prev => ({ ...prev, associatedScenes: selectedOptions }));
    };

    const handleRequiredElementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPlotPoint(prev => ({ ...prev, requiredElements: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }));
    };

    const handleSubmit = () => {
        onSubmit({ ...plotPoint, id: plotPoint.id || generateUniqueId() });
        onClose();
    };

    const plotPointTypeOptions = [
        { value: 'incitingIncident', label: 'Inciting Incident' }, { value: 'risingAction', label: 'Rising Action' },
        { value: 'climax', label: 'Climax' }, { value: 'fallingAction', label: 'Falling Action' },
        { value: 'resolution', label: 'Resolution' }, { value: 'midpoint', label: 'Midpoint' },
        { value: 'plotTwist', label: 'Plot Twist' }, { value: 'reversal', label: 'Reversal' }
    ];

    return (
        <Modal isOpen={isOpen} title={initialPlotPoint.id ? "Edit Plot Point" : "Create New Plot Point"} onClose={onClose}>
            <InputField label="Title" name="title" value={plotPoint.title} onChange={handleChange} />
            <SelectField label="Type" name="type" value={plotPoint.type} onChange={handleChange} options={plotPointTypeOptions} />
            <TextareaField label="Description" name="description" value={plotPoint.description} onChange={handleChange} />

            <SelectField
                label="Impacts Characters"
                name="impactOnCharacters"
                value={''}
                onChange={handleCharacterImpactChange}
                options={characters.map(char => ({ value: char.id, label: char.name }))}
                className="h-24"
                multiple
            />
            <SelectField
                label="Associated Scenes"
                name="associatedScenes"
                value={''}
                onChange={handleAssociatedScenesChange}
                options={scenes.map(scene => ({ value: scene.id, label: scene.title }))}
                className="h-24"
                multiple
            />
            <TextareaField
                label="Required Elements (one per line)"
                name="requiredElements"
                value={plotPoint.requiredElements.join('\n')}
                onChange={handleRequiredElementsChange}
                placeholder="Key items, information, or events"
            />

            {aiSuggestions.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300">AI Suggestions:</h4>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Plot Point</button>
            </div>
        </Modal>
    );
};

/**
 * Modal form for creating or editing story arcs, linking to characters, plot points, and scenes.
 * Business Value: Enables the structured definition and management of overarching narrative
 * threads and character journeys. This critical tool ensures thematic consistency,
 * proper pacing of character development, and alignment with major plot beats,
 * which is essential for crafting multi-layered, engaging, and commercially successful stories.
 * @param isOpen Whether the modal is open.
 * @param onClose Callback to close the modal.
 * @param onSubmit Callback to handle form submission with the story arc data.
 * @param initialStoryArc Optional initial story arc data for editing.
 * @param characters Array of available characters for selection.
 * @param plotPoints Array of available plot points for selection.
 * @param scenes Array of available scenes for selection.
 */
export const StoryArcFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (storyArc: StoryArc) => void;
    initialStoryArc?: StoryArc;
    characters: Character[];
    plotPoints: PlotPoint[];
    scenes: Scene[];
}> = ({ isOpen, onClose, onSubmit, initialStoryArc = emptyStoryArc, characters, plotPoints, scenes }) => {
    const [storyArc, setStoryArc] = useState<StoryArc>(initialStoryArc);

    useEffect(() => {
        if (isOpen) {
            setStoryArc(initialStoryArc);
        }
    }, [initialStoryArc, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStoryArc(prev => ({ ...prev, [name]: value }));
    };

    const handleCharactersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setStoryArc(prev => ({ ...prev, charactersInvolved: selectedOptions }));
    };

    const handleKeyPlotPointsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setStoryArc(prev => ({ ...prev, keyPlotPoints: selectedOptions }));
    };

    const handleSubmit = () => {
        onSubmit({ ...storyArc, id: storyArc.id || generateUniqueId() });
        onClose();
    };

    const storyArcTypeOptions = [
        { value: 'main', label: 'Main Plot' }, { value: 'sub_plot', label: 'Sub Plot' },
        { value: 'character_arc', label: 'Character Arc' }, { value: 'thematic', label: 'Thematic Arc' }
    ];

    const sceneOrPlotPointOptions = [
        { value: '', label: 'None' },
        { label: '--- Scenes ---', value: '', disabled: true },
        ...scenes.map(s => ({ value: s.id, label: `Scene: ${s.title}` })),
        { label: '--- Plot Points ---', value: '', disabled: true },
        ...plotPoints.map(pp => ({ value: pp.id, label: `Plot: ${pp.title}` }))
    ];

    return (
        <Modal isOpen={isOpen} title={initialStoryArc.id ? "Edit Story Arc" : "Create New Story Arc"} onClose={onClose}>
            <InputField label="Title" name="title" value={storyArc.title} onChange={handleChange} />
            <SelectField label="Type" name="type" value={storyArc.type} onChange={handleChange} options={storyArcTypeOptions} />
            <TextareaField label="Description" name="description" value={storyArc.description} onChange={handleChange} />

            <SelectField
                label="Start Point (Scene or Plot Point)"
                name="startPoint"
                value={storyArc.startPoint}
                onChange={handleChange}
                options={sceneOrPlotPointOptions}
            />
            <SelectField
                label="End Point (Scene or Plot Point)"
                name="endPoint"
                value={storyArc.endPoint}
                onChange={handleChange}
                options={sceneOrPlotPointOptions}
            />

            <SelectField
                label="Key Plot Points in this Arc"
                name="keyPlotPoints"
                value={''}
                onChange={handleKeyPlotPointsChange}
                options={plotPoints.map(pp => ({ value: pp.id, label: pp.title }))}
                className="h-24"
                multiple
            />
            <SelectField
                label="Characters Involved"
                name="charactersInvolved"
                value={''}
                onChange={handleCharactersChange}
                options={characters.map(char => ({ value: char.id, label: char.name }))}
                className="h-24"
                multiple
            />

            <div className="flex justify-end mt-4 space-x-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white">Save Story Arc</button>
            </div>
        </Modal>
    );
};

/**
 * Interface for a user's simulated role in the application, for RBAC.
 */
export type UserRole = 'writer' | 'admin' | 'viewer';

/**
 * Context for providing user role information across the application.
 */
export const UserRoleContext = createContext<{
    userRole: UserRole;
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}>({
    userRole: 'writer',
    setUserRole: () => { }
});

/**
 * Provider component for the UserRoleContext.
 * Business Value: Implements a foundational layer for Role-Based Access Control (RBAC)
 * within the client-side application. By simulating user roles, it demonstrates the
 * capability to enforce granular permissions, ensuring that sensitive operations (e.g.,
 * project deletion, AI configuration) are restricted to authorized users. This is critical
 * for data governance, intellectual property protection, and compliance in commercial
 * environments, enhancing the security posture of the application.
 * @param children The child components to render within the provider.
 */
export const UserRoleProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>('writer');

    useEffect(() => {
        const storedRole = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}userRole`) as UserRole;
        if (storedRole && ['writer', 'admin', 'viewer'].includes(storedRole)) {
            setUserRole(storedRole);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}userRole`, userRole);
    }, [userRole]);

    return (
        <UserRoleContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

/**
 * Custom hook to access the user role context.
 * Business Value: Simplifies access to user role information for implementing RBAC logic.
 */
export const useUserRole = () => useContext(UserRoleContext);


/**
 * Dashboard panel component, displaying a list of projects and allowing for creation, editing, and deletion.
 * Business Value: Serves as the central command center for project management, enabling
 * users to efficiently organize and access their narrative projects. This streamlines
 * project initiation, provides clear oversight of all creative assets, and ensures
 * quick navigation, directly boosting user productivity and reducing project overhead.
 * @param projects An array of Project objects.
 * @param activeProjectId The ID of the currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param addNotification Callback to add a notification.
 */
export const DashboardPanel: React.FC<{
    projects: Project[];
    activeProjectId: string | null;
    dispatch: React.Dispatch<AppAction>;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ projects, activeProjectId, dispatch, addNotification }) => {
    const { userRole } = useUserRole();
    const canManageProjects = userRole === 'admin' || userRole === 'writer';

    const handleNewProject = (project: Project) => {
        dispatch({ type: 'ADD_PROJECT', payload: project });
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: project.id });
        dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'scriptEditor' });
        addNotification("New project created!", "success");
    };

    const handleSelectProject = (projectId: string) => {
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: projectId });
        const selectedProject = projects.find(p => p.id === projectId);
        if (selectedProject?.settings.lastOpenedPanel) {
            dispatch({ type: 'SET_ACTIVE_PANEL', payload: selectedProject.settings.lastOpenedPanel });
        } else {
            dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'scriptEditor' });
        }
        addNotification(`Project '${selectedProject?.name}' loaded.`, "info");
    };

    const handleDeleteProject = (projectId: string) => {
        if (!canManageProjects) {
            addNotification("You do not have permission to delete projects.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: projectId, message: "Are you sure you want to delete this project and all its data? This action cannot be undone." } } });
    };

    const handleEditProject = (project: Project) => {
        if (!canManageProjects) {
            addNotification("You do not have permission to edit projects.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'newProject', data: project } });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <div className="flex justify-end">
                {canManageProjects && (
                    <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'newProject' } })}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        New Project
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                    <p className="text-gray-400 col-span-full">No projects yet. Start by creating a new one!</p>
                ) : (
                    projects.map(project => (
                        <Card key={project.id} className={`p-4 ${project.id === activeProjectId ? 'border-2 border-cyan-500' : 'border border-gray-700'}`}>
                            <h3 className="text-xl font-semibold text-white truncate">{project.name}</h3>
                            <p className="text-sm text-gray-400 italic mb-2 line-clamp-2">{project.logline || 'No logline provided.'}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                <span>Created: {formatDate(new Date(project.createdAt))}</span>
                                <span>Updated: {formatDate(new Date(project.updatedAt))}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleSelectProject(project.id)}
                                    className="flex-grow px-3 py-2 bg-cyan-700 hover:bg-cyan-800 rounded text-white text-sm">Open</button>
                                {canManageProjects && (
                                    <>
                                        <button onClick={() => handleEditProject(project)}
                                            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm">Edit</button>
                                        <button onClick={() => handleDeleteProject(project.id)}
                                            className="px-3 py-2 bg-red-700 hover:bg-red-800 rounded text-white text-sm">Delete</button>
                                    </>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

/**
 * Script editor panel component, allowing users to write and edit scene content with AI assistance.
 * Business Value: The core engine for content creation, dramatically enhancing writing velocity
 * and quality through integrated AI co-writing. This directly translates to faster script
 * development, reduced human effort, and consistently high-quality dialogue, a critical
 * factor for accelerated content production and market competitive advantage.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param currentAISuggestions An array of AI-generated suggestions.
 * @param isAILoading Boolean indicating if AI is currently processing a request.
 * @param currentAIRequestPrompt The last prompt sent to the AI.
 * @param addNotification Callback to add a notification.
 */
export const ScriptEditorPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    currentAISuggestions: string[];
    isAILoading: boolean;
    currentAIRequestPrompt: string;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, currentAISuggestions, isAILoading, currentAIRequestPrompt, addNotification }) => {
    const { userRole } = useUserRole();
    const canEditContent = userRole === 'admin' || userRole === 'writer';

    const [scriptContent, setScriptContent] = useState<string>('');
    const [prompt, setPrompt] = useState(currentAIRequestPrompt || 'Suggest a witty, sarcastic comeback for Alex.');
    const [selectedSceneId, setSelectedSceneId] = useState(project.scenes[0]?.id || '');

    // Set initial scene content and selection
    useEffect(() => {
        const sceneToDisplay = project.scenes.find(s => s.id === selectedSceneId);
        if (sceneToDisplay) {
            setScriptContent(sceneToDisplay.content);
        } else if (project.scenes.length > 0) {
            setSelectedSceneId(project.scenes[0].id);
            setScriptContent(project.scenes[0].content);
        } else {
            setScriptContent('');
            setSelectedSceneId('');
        }
    }, [selectedSceneId, project.scenes]);

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!canEditContent) return;
        setScriptContent(e.target.value);
        const updatedScene = project.scenes.find(s => s.id === selectedSceneId);
        if (updatedScene) {
            dispatch({
                type: 'UPDATE_SCENE',
                payload: { projectId: project.id, scene: { ...updatedScene, content: e.target.value } }
            });
        }
    };

    const handleGenerate = async () => {
        if (!canEditContent) {
            addNotification("You do not have permission to generate AI suggestions.", "error");
            return;
        }
        if (!selectedSceneId) {
            addNotification("Please select or create a scene first.", "warning");
            return;
        }
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [] });
        dispatch({ type: 'SET_CURRENT_AI_REQUEST_PROMPT', payload: prompt });
        try {
            const suggestions = await aiService.generateDialogueSuggestions(scriptContent, prompt, project.settings.preferredAIConfig);
            dispatch({ type: 'SET_AI_SUGGESTIONS', payload: suggestions });
            addNotification("AI suggestions generated!", "success");
        } catch (error: any) {
            console.error("ScriptEditorPanel AI Error:", error);
            dispatch({ type: 'SET_AI_ERROR', payload: error.message || "Failed to generate AI suggestions." });
            addNotification(`AI Error: ${error.message || "Failed to generate suggestions."}`, "error");
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    };

    const handleAddNewScene = () => {
        if (!canEditContent) {
            addNotification("You do not have permission to add scenes.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'editScene', data: { ...emptyScene, projectId: project.id } } });
    };

    const handleUpdateScene = (scene: Scene) => {
        if (!canEditContent) return;
        dispatch({ type: 'UPDATE_SCENE', payload: { projectId: project.id, scene } });
        addNotification("Scene updated.", "success");
    };

    const handleAddScene = (scene: Scene) => {
        if (!canEditContent) return;
        dispatch({ type: 'ADD_SCENE', payload: { projectId: project.id, scene } });
        setSelectedSceneId(scene.id);
        addNotification("Scene created.", "success");
    };

    const handleDeleteScene = (sceneId: string) => {
        if (!canEditContent) {
            addNotification("You do not have permission to delete scenes.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: sceneId, message: "Are you sure you want to delete this scene?" } } });
    };

    const currentEditScene = project.scenes.find(s => s.id === selectedSceneId);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Script Editor</h2>

            <div className="flex justify-between items-center mb-4">
                <SelectField
                    label="Active Scene"
                    value={selectedSceneId}
                    onChange={(e) => setSelectedSceneId(e.target.value)}
                    options={project.scenes.map(s => ({ value: s.id, label: s.title }))}
                    className="w-2/3"
                />
                <div className="flex space-x-2 ml-4">
                    {canEditContent && (
                        <>
                            <button onClick={handleAddNewScene} className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm">New Scene</button>
                            {currentEditScene && (
                                <>
                                    <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'editScene', data: currentEditScene } })} className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm">Edit Scene Details</button>
                                    <button onClick={() => handleDeleteScene(currentEditScene.id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm">Delete Scene</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Script Content">
                        <textarea
                            value={scriptContent}
                            onChange={handleScriptChange}
                            className="w-full h-[60vh] bg-gray-900/50 p-4 rounded-lg font-mono text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Start writing your scene here..."
                            disabled={!canEditContent}
                        />
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="AI Co-Writer">
                        <div className="space-y-4">
                            <TextareaField
                                label="Your Request:"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                placeholder="e.g., Suggest a witty, sarcastic comeback for Alex."
                            />
                            <button onClick={handleGenerate} disabled={isAILoading || !selectedSceneId || !canEditContent} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                {isAILoading ? 'Generating...' : 'Get Suggestions'}
                            </button>
                            {currentAISuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Suggestions:</h4>
                                    {currentAISuggestions.map((s, i) => (
                                        <p key={i} className="text-sm p-2 bg-gray-900/50 rounded italic break-words">"{s}"</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            <SceneFormModal
                isOpen={project.showModal.type === 'editScene' && project.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={project.showModal.data?.id ? handleUpdateScene : handleAddScene}
                initialScene={project.showModal.data || emptyScene}
                locations={project.locations}
                characters={project.characters}
                plotPoints={project.plotPoints}
            />
        </div>
    );
};

/**
 * Characters panel component, managing character profiles with AI concept generation.
 * Business Value: Accelerates the critical character development process by enabling
 * efficient creation, editing, and review of character profiles. The integrated AI
 * concept generator drastically reduces initial brainstorming time, ensuring rich,
 * consistent, and engaging characters for compelling narratives, which are fundamental
 * to market-ready content.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param isAILoading Boolean indicating if AI is currently processing a request.
 * @param currentAISuggestions An array of AI-generated suggestions.
 * @param addNotification Callback to add a notification.
 */
export const CharactersPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    isAILoading: boolean;
    currentAISuggestions: string[];
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, isAILoading, currentAISuggestions, addNotification }) => {
    const { userRole } = useUserRole();
    const canManageCharacters = userRole === 'admin' || userRole === 'writer';
    const canUseAI = userRole === 'admin' || userRole === 'writer';

    const [characterConceptPrompt, setCharacterConceptPrompt] = useState('');
    const { selectedCharacterId } = project;
    const selectedCharacter = project.characters.find(c => c.id === selectedCharacterId);

    const handleAddCharacter = (character: Character) => {
        if (!canManageCharacters) return;
        dispatch({ type: 'ADD_CHARACTER', payload: { projectId: project.id, character } });
        dispatch({ type: 'SET_SELECTED_CHARACTER', payload: character.id });
        addNotification(`Character '${character.name}' added.`, "success");
    };

    const handleUpdateCharacter = (character: Character) => {
        if (!canManageCharacters) return;
        dispatch({ type: 'UPDATE_CHARACTER', payload: { projectId: project.id, character } });
        addNotification(`Character '${character.name}' updated.`, "success");
    };

    const handleDeleteCharacter = (characterId: string) => {
        if (!canManageCharacters) {
            addNotification("You do not have permission to delete characters.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: characterId, message: "Are you sure you want to delete this character?" } } });
    };

    const generateCharacterConcept = async () => {
        if (!canUseAI) {
            addNotification("You do not have permission to use AI features.", "error");
            return;
        }
        if (!characterConceptPrompt) {
            addNotification("Please enter a concept for the character first.", "warning");
            return;
        }
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [] });
        try {
            const generatedCharacter = await aiService.generateCharacterConcept(characterConceptPrompt, project.settings.preferredAIConfig);
            dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [`AI generated a concept for: ${generatedCharacter.name}`] });
            dispatch({ type: 'OPEN_MODAL', payload: { type: 'editCharacter', data: generatedCharacter } });
            addNotification("AI character concept generated!", "success");
        } catch (error: any) {
            console.error("CharactersPanel AI Error:", error);
            dispatch({ type: 'SET_AI_ERROR', payload: error.message || "Failed to generate character concept." });
            addNotification(`AI Error: ${error.message || "Failed to generate character concept."}`, "error");
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Characters</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Character List">
                        {canManageCharacters && (
                            <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'editCharacter' } })}
                                className="w-full mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Character
                            </button>
                        )}
                        <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                            {project.characters.length === 0 ? (
                                <p className="text-gray-400">No characters added yet.</p>
                            ) : (
                                project.characters.map(char => (
                                    <li key={char.id}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedCharacterId === char.id ? 'bg-cyan-900 border border-cyan-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        onClick={() => dispatch({ type: 'SET_SELECTED_CHARACTER', payload: char.id })}>
                                        <span className="text-white font-medium">{char.name}</span>
                                        {canManageCharacters && (
                                            <div className="flex space-x-1">
                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_MODAL', payload: { type: 'editCharacter', data: char } }); }} className="text-gray-400 hover:text-cyan-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCharacter(char.id); }} className="text-gray-400 hover:text-red-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {selectedCharacter ? (
                        <Card title={`${selectedCharacter.name}'s Profile`}>
                            <div className="space-y-3 text-gray-300">
                                <p><strong className="text-white">Description:</strong> {selectedCharacter.description}</p>
                                <p><strong className="text-white">Backstory:</strong> {selectedCharacter.backstory}</p>
                                <p><strong className="text-white">Motivations:</strong> {selectedCharacter.motivations}</p>
                                <p><strong className="text-white">Goals:</strong> {selectedCharacter.goals}</p>
                                <p><strong className="text-white">Dialogue Style:</strong> {selectedCharacter.dialogueStyle}</p>
                                <p><strong className="text-white">Personality:</strong> {selectedCharacter.personalityTraits.join(', ')}</p>
                                {selectedCharacter.aiNotes && <p className="italic text-gray-400">AI Notes: {selectedCharacter.aiNotes}</p>}
                            </div>
                        </Card>
                    ) : (
                        <Card title="Character Details">
                            <p className="text-gray-400">Select a character from the list or create a new one to view details.</p>
                        </Card>
                    )}
                    {canUseAI && (
                        <Card title="AI Character Concept Generator">
                            <TextareaField
                                label="Concept Idea (e.g., 'A grizzled space pirate with a hidden soft spot for stray cats.')"
                                value={characterConceptPrompt}
                                onChange={(e) => setCharacterConceptPrompt(e.target.value)}
                                rows={4}
                            />
                            <button onClick={generateCharacterConcept} disabled={isAILoading || !characterConceptPrompt}
                                className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                                {isAILoading ? 'Generating Concept...' : 'Generate Character Concept'}
                            </button>
                            {currentAISuggestions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">AI Output:</h4>
                                    <p className="text-sm p-2 bg-gray-900/50 rounded italic text-gray-400">{currentAISuggestions[0]}</p>
                                    <p className="text-sm text-gray-500">The generated character concept has been pre-filled into the 'Add New Character' modal. You can review and save it.</p>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
            <CharacterFormModal
                isOpen={project.showModal.type === 'editCharacter' && project.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={project.showModal.data?.id ? handleUpdateCharacter : handleAddCharacter}
                initialCharacter={project.showModal.data || emptyCharacter}
                aiSuggestions={project.showModal.data ? [] : currentAISuggestions}
            />
        </div>
    );
};

/**
 * Locations panel component, managing location details with AI concept generation.
 * Business Value: Provides an efficient workflow for developing detailed and immersive
 * fictional settings. By integrating AI for location concept generation, it reduces
 * the manual effort in world-building, ensures consistency across descriptions, and
 * accelerates the creation of rich story environments, which are crucial for
 * audience engagement and commercial appeal.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param isAILoading Boolean indicating if AI is currently processing a request.
 * @param currentAISuggestions An array of AI-generated suggestions.
 * @param addNotification Callback to add a notification.
 */
export const LocationsPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    isAILoading: boolean;
    currentAISuggestions: string[];
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, isAILoading, currentAISuggestions, addNotification }) => {
    const { userRole } = useUserRole();
    const canManageLocations = userRole === 'admin' || userRole === 'writer';
    const canUseAI = userRole === 'admin' || userRole === 'writer';

    const [locationConceptPrompt, setLocationConceptPrompt] = useState('');
    const { selectedLocationId } = project;
    const selectedLocation = project.locations.find(l => l.id === selectedLocationId);

    const handleAddLocation = (location: Location) => {
        if (!canManageLocations) return;
        dispatch({ type: 'ADD_LOCATION', payload: { projectId: project.id, location } });
        dispatch({ type: 'SET_SELECTED_LOCATION', payload: location.id });
        addNotification(`Location '${location.name}' added.`, "success");
    };

    const handleUpdateLocation = (location: Location) => {
        if (!canManageLocations) return;
        dispatch({ type: 'UPDATE_LOCATION', payload: { projectId: project.id, location } });
        addNotification(`Location '${location.name}' updated.`, "success");
    };

    const handleDeleteLocation = (locationId: string) => {
        if (!canManageLocations) {
            addNotification("You do not have permission to delete locations.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: locationId, message: "Are you sure you want to delete this location?" } } });
    };

    const generateLocationConcept = async () => {
        if (!canUseAI) {
            addNotification("You do not have permission to use AI features.", "error");
            return;
        }
        if (!locationConceptPrompt) {
            addNotification("Please enter a concept for the location first.", "warning");
            return;
        }
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [] });
        try {
            const generatedLocation = await aiService.generateLocationConcept(locationConceptPrompt, project.settings.preferredAIConfig);
            dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [`AI generated a concept for: ${generatedLocation.name}`] });
            dispatch({ type: 'OPEN_MODAL', payload: { type: 'editLocation', data: generatedLocation } });
            addNotification("AI location concept generated!", "success");
        } catch (error: any) {
            console.error("LocationsPanel AI Error:", error);
            dispatch({ type: 'SET_AI_ERROR', payload: error.message || "Failed to generate location concept." });
            addNotification(`AI Error: ${error.message || "Failed to generate location concept."}`, "error");
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Locations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Location List">
                        {canManageLocations && (
                            <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'editLocation' } })}
                                className="w-full mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Location
                            </button>
                        )}
                        <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                            {project.locations.length === 0 ? (
                                <p className="text-gray-400">No locations added yet.</p>
                            ) : (
                                project.locations.map(loc => (
                                    <li key={loc.id}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedLocationId === loc.id ? 'bg-cyan-900 border border-cyan-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        onClick={() => dispatch({ type: 'SET_SELECTED_LOCATION', payload: loc.id })}>
                                        <span className="text-white font-medium">{loc.name}</span>
                                        {canManageLocations && (
                                            <div className="flex space-x-1">
                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_MODAL', payload: { type: 'editLocation', data: loc } }); }} className="text-gray-400 hover:text-cyan-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteLocation(loc.id); }} className="text-gray-400 hover:text-red-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {selectedLocation ? (
                        <Card title={`${selectedLocation.name} Details`}>
                            <div className="space-y-3 text-gray-300">
                                <p><strong className="text-white">Type:</strong> {selectedLocation.type}</p>
                                <p><strong className="text-white">Description:</strong> {selectedLocation.description}</p>
                                <p><strong className="text-white">History:</strong> {selectedLocation.history}</p>
                                <p><strong className="text-white">Significance:</strong> {selectedLocation.significance}</p>
                                <p><strong className="text-white">Mood:</strong> {selectedLocation.mood}</p>
                                <p><strong className="text-white">Key Elements:</strong> {selectedLocation.keyElements.join(', ')}</p>
                                {selectedLocation.aiNotes && <p className="italic text-gray-400">AI Notes: {selectedLocation.aiNotes}</p>}
                            </div>
                        </Card>
                    ) : (
                        <Card title="Location Details">
                            <p className="text-gray-400">Select a location from the list or create a new one to view details.</p>
                        </Card>
                    )}
                    {canUseAI && (
                        <Card title="AI Location Concept Generator">
                            <TextareaField
                                label="Concept Idea (e.g., 'A desolate, futuristic space station built into an asteroid.')"
                                value={locationConceptPrompt}
                                onChange={(e) => setLocationConceptPrompt(e.target.value)}
                                rows={4}
                            />
                            <button onClick={generateLocationConcept} disabled={isAILoading || !locationConceptPrompt}
                                className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                                {isAILoading ? 'Generating Concept...' : 'Generate Location Concept'}
                            </button>
                            {currentAISuggestions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">AI Output:</h4>
                                    <p className="text-sm p-2 bg-gray-900/50 rounded italic text-gray-400">{currentAISuggestions[0]}</p>
                                    <p className="text-sm text-gray-500">The generated location concept has been pre-filled into the 'Add New Location' modal. You can review and save it.</p>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
            <LocationFormModal
                isOpen={project.showModal.type === 'editLocation' && project.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={project.showModal.data?.id ? handleUpdateLocation : handleAddLocation}
                initialLocation={project.showModal.data || emptyLocation}
                aiSuggestions={project.showModal.data ? [] : currentAISuggestions}
            />
        </div>
    );
};

/**
 * Plot board panel component, managing plot points and offering AI ideas.
 * Business Value: Provides a structured visual overview of the narrative's key beats,
 * ensuring logical story progression and thematic consistency. The integrated AI
 * ideation significantly accelerates plot development, helping writers overcome blocks
 * and explore diverse narrative paths, which is crucial for delivering engaging
 * and commercially successful stories.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param isAILoading Boolean indicating if AI is currently processing a request.
 * @param currentAISuggestions An array of AI-generated suggestions.
 * @param addNotification Callback to add a notification.
 */
export const PlotBoardPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    isAILoading: boolean;
    currentAISuggestions: string[];
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, isAILoading, currentAISuggestions, addNotification }) => {
    const { userRole } = useUserRole();
    const canManagePlotPoints = userRole === 'admin' || userRole === 'writer';
    const canUseAI = userRole === 'admin' || userRole === 'writer';

    const { selectedPlotPointId } = project;
    const selectedPlotPoint = project.plotPoints.find(pp => pp.id === selectedPlotPointId);

    const handleAddPlotPoint = (plotPoint: PlotPoint) => {
        if (!canManagePlotPoints) return;
        dispatch({ type: 'ADD_PLOT_POINT', payload: { projectId: project.id, plotPoint } });
        addNotification(`Plot Point '${plotPoint.title}' added.`, "success");
    };

    const handleUpdatePlotPoint = (plotPoint: PlotPoint) => {
        if (!canManagePlotPoints) return;
        dispatch({ type: 'UPDATE_PLOT_POINT', payload: { projectId: project.id, plotPoint } });
        addNotification(`Plot Point '${plotPoint.title}' updated.`, "success");
    };

    const handleDeletePlotPoint = (plotPointId: string) => {
        if (!canManagePlotPoints) {
            addNotification("You do not have permission to delete plot points.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: plotPointId, message: "Are you sure you want to delete this plot point?" } } });
    };

    const generatePlotPointIdeas = async () => {
        if (!canUseAI) {
            addNotification("You do not have permission to use AI features.", "error");
            return;
        }
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [] });
        try {
            const ideas = await aiService.generatePlotPointIdeas(project, project.settings.preferredAIConfig);
            dispatch({ type: 'SET_AI_SUGGESTIONS', payload: ideas });
            addNotification("AI plot point ideas generated!", "success");
        } catch (error: any) {
            console.error("PlotBoardPanel AI Error:", error);
            dispatch({ type: 'SET_AI_ERROR', payload: error.message || "Failed to generate plot point ideas." });
            addNotification(`AI Error: ${error.message || "Failed to generate plot point ideas."}`, "error");
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Plot Board</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Plot Points List">
                        {canManagePlotPoints && (
                            <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'editPlotPoint' } })}
                                className="w-full mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Plot Point
                            </button>
                        )}
                        <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                            {project.plotPoints.length === 0 ? (
                                <p className="text-gray-400">No plot points added yet.</p>
                            ) : (
                                project.plotPoints.map(pp => (
                                    <li key={pp.id}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedPlotPointId === pp.id ? 'bg-cyan-900 border border-cyan-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        onClick={() => dispatch({ type: 'SET_SELECTED_PLOT_POINT', payload: pp.id })}>
                                        <span className="text-white font-medium">{pp.title} ({pp.type})</span>
                                        {canManagePlotPoints && (
                                            <div className="flex space-x-1">
                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_MODAL', payload: { type: 'editPlotPoint', data: pp } }); }} className="text-gray-400 hover:text-cyan-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeletePlotPoint(pp.id); }} className="text-gray-400 hover:text-red-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </Card>
                    {canUseAI && (
                        <Card title="AI Plot Point Ideas">
                            <button onClick={generatePlotPointIdeas} disabled={isAILoading}
                                className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                                {isAILoading ? 'Generating Ideas...' : 'Generate Plot Point Ideas'}
                            </button>
                            {currentAISuggestions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Suggestions:</h4>
                                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                        {currentAISuggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {selectedPlotPoint ? (
                        <Card title={`${selectedPlotPoint.title} Details`}>
                            <div className="space-y-3 text-gray-300">
                                <p><strong className="text-white">Type:</strong> {selectedPlotPoint.type}</p>
                                <p><strong className="text-white">Description:</strong> {selectedPlotPoint.description}</p>
                                <p><strong className="text-white">Impacts Characters:</strong> {selectedPlotPoint.impactOnCharacters.map(charId => project.characters.find(c => c.id === charId)?.name || 'Unknown').join(', ')}</p>
                                <p><strong className="text-white">Associated Scenes:</strong> {selectedPlotPoint.associatedScenes.map(sceneId => project.scenes.find(s => s.id === sceneId)?.title || 'Unknown').join(', ')}</p>
                                <p><strong className="text-white">Required Elements:</strong> {selectedPlotPoint.requiredElements.join(', ')}</p>
                                {selectedPlotPoint.aiSuggestions && <p className="italic text-gray-400">AI Suggestions: {selectedPlotPoint.aiSuggestions}</p>}
                            </div>
                        </Card>
                    ) : (
                        <Card title="Plot Point Details">
                            <p className="text-gray-400">Select a plot point from the list or create a new one to view details.</p>
                        </Card>
                    )}
                </div>
            </div>
            <PlotPointFormModal
                isOpen={project.showModal.type === 'editPlotPoint' && project.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={project.showModal.data?.id ? handleUpdatePlotPoint : handleAddPlotPoint}
                initialPlotPoint={project.showModal.data || emptyPlotPoint}
                characters={project.characters}
                scenes={project.scenes}
            />
        </div>
    );
};

/**
 * World builder panel component, managing story arcs and offering AI lore generation.
 * Business Value: Provides a dedicated space for constructing the foundational elements
 * of a fictional world and managing overarching story structures. This panel ensures
 * consistency in world lore, facilitates complex narrative design through story arcs,
 * and empowers writers to build rich, immersive universes, critical for multi-platform
 * IP development and long-term audience engagement.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param addNotification Callback to add a notification.
 */
export const WorldBuilderPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, addNotification }) => {
    const { userRole } = useUserRole();
    const canManageStoryArcs = userRole === 'admin' || userRole === 'writer';
    const canUseAI = userRole === 'admin' || userRole === 'writer';

    const [worldLorePrompt, setWorldLorePrompt] = useState('');
    const [aiLoreOutput, setAiLoreOutput] = useState('');
    const [isAILoreLoading, setIsAILoreLoading] = useState(false);

    const { selectedStoryArcId } = project;
    const selectedStoryArc = project.storyArcs.find(sa => sa.id === selectedStoryArcId);

    const handleAddStoryArc = (storyArc: StoryArc) => {
        if (!canManageStoryArcs) return;
        dispatch({ type: 'ADD_STORY_ARC', payload: { projectId: project.id, storyArc } });
        addNotification(`Story Arc '${storyArc.title}' added.`, "success");
    };

    const handleUpdateStoryArc = (storyArc: StoryArc) => {
        if (!canManageStoryArcs) return;
        dispatch({ type: 'UPDATE_STORY_ARC', payload: { projectId: project.id, storyArc } });
        addNotification(`Story Arc '${storyArc.title}' updated.`, "success");
    };

    const handleDeleteStoryArc = (storyArcId: string) => {
        if (!canManageStoryArcs) {
            addNotification("You do not have permission to delete story arcs.", "error");
            return;
        }
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityId: storyArcId, message: "Are you sure you want to delete this story arc?" } } });
    };

    const generateWorldLore = async () => {
        if (!canUseAI) {
            addNotification("You do not have permission to use AI features.", "error");
            return;
        }
        if (!worldLorePrompt.trim()) {
            addNotification("Please enter a concept for world lore generation.", "warning");
            return;
        }
        setIsAILoreLoading(true);
        setAiLoreOutput('');
        try {
            const lore = await aiService.generateWorldLore(project, worldLorePrompt, project.settings.preferredAIConfig);
            setAiLoreOutput(lore);
            addNotification("AI World Lore generated!", "success");
        } catch (error: any) {
            console.error("WorldBuilderPanel AI Error:", error);
            addNotification(`AI Error: ${error.message || "Failed to generate world lore."}`, "error");
        } finally {
            setIsAILoreLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">World Builder & Story Arcs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Story Arcs">
                        {canManageStoryArcs && (
                            <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'editStoryArc' } })}
                                className="w-full mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Story Arc
                            </button>
                        )}
                        <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                            {project.storyArcs.length === 0 ? (
                                <p className="text-gray-400">No story arcs defined yet.</p>
                            ) : (
                                project.storyArcs.map(sa => (
                                    <li key={sa.id}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedStoryArcId === sa.id ? 'bg-cyan-900 border border-cyan-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        onClick={() => dispatch({ type: 'SET_SELECTED_STORY_ARC', payload: sa.id })}>
                                        <span className="text-white font-medium">{sa.title} ({sa.type})</span>
                                        {canManageStoryArcs && (
                                            <div className="flex space-x-1">
                                                <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_MODAL', payload: { type: 'editStoryArc', data: sa } }); }} className="text-gray-400 hover:text-cyan-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteStoryArc(sa.id); }} className="text-gray-400 hover:text-red-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {selectedStoryArc ? (
                        <Card title={`${selectedStoryArc.title} Details`}>
                            <div className="space-y-3 text-gray-300">
                                <p><strong className="text-white">Type:</strong> {selectedStoryArc.type}</p>
                                <p><strong className="text-white">Description:</strong> {selectedStoryArc.description}</p>
                                <p><strong className="text-white">Start Point:</strong> {project.scenes.find(s => s.id === selectedStoryArc.startPoint)?.title || project.plotPoints.find(pp => pp.id === selectedStoryArc.startPoint)?.title || 'N/A'}</p>
                                <p><strong className="text-white">End Point:</strong> {project.scenes.find(s => s.id === selectedStoryArc.endPoint)?.title || project.plotPoints.find(pp => pp.id === selectedStoryArc.endPoint)?.title || 'N/A'}</p>
                                <p><strong className="text-white">Key Plot Points:</strong> {selectedStoryArc.keyPlotPoints.map(ppId => project.plotPoints.find(pp => pp.id === ppId)?.title || 'Unknown').join(', ')}</p>
                                <p><strong className="text-white">Characters Involved:</strong> {selectedStoryArc.charactersInvolved.map(charId => project.characters.find(c => c.id === charId)?.name || 'Unknown').join(', ')}</p>
                                {selectedStoryArc.aiAnalysis && <p className="italic text-gray-400">AI Analysis: {selectedStoryArc.aiAnalysis}</p>}
                            </div>
                        </Card>
                    ) : (
                        <Card title="Story Arc Details">
                            <p className="text-gray-400">Select a story arc or create a new one to view details.</p>
                        </Card>
                    )}
                    {canUseAI && (
                        <Card title="AI World Lore Generator">
                            <TextareaField
                                label="Concept Idea (e.g., 'The history of magic in the kingdom of Eldoria.')"
                                value={worldLorePrompt}
                                onChange={(e) => setWorldLorePrompt(e.target.value)}
                                rows={4}
                            />
                            <button onClick={generateWorldLore} disabled={isAILoreLoading || !worldLorePrompt.trim()}
                                className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                                {isAILoreLoading ? 'Generating World Lore...' : 'Generate World Lore'}
                            </button>
                            {aiLoreOutput && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-300">AI Generated Lore:</h4>
                                    <p className="text-gray-400 text-sm bg-gray-900/50 p-3 rounded italic">{aiLoreOutput}</p>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
            <StoryArcFormModal
                isOpen={project.showModal.type === 'editStoryArc' && project.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={project.showModal.data?.id ? handleUpdateStoryArc : handleAddStoryArc}
                initialStoryArc={project.showModal.data || emptyStoryArc}
                characters={project.characters}
                plotPoints={project.plotPoints}
                scenes={project.scenes}
            />
        </div>
    );
};

/**
 * AI chat panel component for interactive conversations with the AI assistant.
 * Business Value: Provides an interactive agentic AI interface that acts as a real-time
 * creative partner. This dynamic chat environment facilitates brainstorming, problem-solving,
 * and rapid iteration on narrative concepts, significantly reducing creative blocks and
 * accelerating the development of innovative and compelling storylines, essential for
 * high-velocity content production.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param isAILoading Boolean indicating if AI is currently processing a request.
 * @param addNotification Callback to add a notification.
 */
export const AIChatPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    isAILoading: boolean;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, isAILoading, addNotification }) => {
    const { userRole } = useUserRole();
    const canUseAI = userRole === 'admin' || userRole === 'writer';

    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!canUseAI) {
            addNotification("You do not have permission to use AI chat.", "error");
            return;
        }
        if (!chatInput.trim()) return;

        const userMessage: AIChatMessage = {
            id: generateUniqueId(),
            role: 'user',
            content: chatInput,
            timestamp: new Date().toISOString()
        };
        dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId: project.id, message: userMessage } });
        setChatInput('');
        dispatch({ type: 'SET_AI_LOADING', payload: true });

        try {
            const aiResponseContent = await aiService.chatWithAI([...project.aiChatHistory, userMessage], project, project.settings.preferredAIConfig);
            const aiMessage: AIChatMessage = {
                id: generateUniqueId(),
                role: 'model',
                content: aiResponseContent,
                timestamp: new Date().toISOString()
            };
            dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId: project.id, message: aiMessage } });
            addNotification("AI responded!", "success");
        } catch (error: any) {
            console.error("AIChatPanel AI Error:", error);
            const errorMessage: AIChatMessage = {
                id: generateUniqueId(),
                role: 'model',
                content: `Error: ${error.message || "Failed to get AI response."}`,
                timestamp: new Date().toISOString()
            };
            dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId: project.id, message: errorMessage } });
            addNotification(`AI Chat Error: ${error.message || "Failed to get AI response."}`, "error");
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [project.aiChatHistory, isAILoading]);

    return (
        <div className="space-y-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white">AI Assistant Chat</h2>
            <Card className="flex-grow flex flex-col min-h-0">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900/50 rounded-lg mb-4">
                    {project.aiChatHistory.length === 0 ? (
                        <p className="text-gray-500 italic">Start a conversation with your AI co-writer! Ask for ideas, feedback, or help with your story.</p>
                    ) : (
                        project.aiChatHistory.map(message => (
                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-lg ${message.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-100'}`}>
                                    <p className="font-semibold">{message.role === 'user' ? 'You' : 'AI Assistant'}</p>
                                    <p className="text-sm break-words">{message.content}</p>
                                    <span className="text-xs text-gray-400 block text-right mt-1">{formatDate(new Date(message.timestamp))}</span>
                                </div>
                            </div>
                        ))
                    )}
                    {isAILoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] p-3 rounded-lg bg-gray-700 text-gray-100 animate-pulse">
                                <p className="font-semibold">AI Assistant</p>
                                <p className="text-sm">Typing...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <TextareaField
                        label=""
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        rows={2}
                        placeholder="Type your message to the AI..."
                        className="flex-grow"
                        disabled={!canUseAI}
                    />
                    <button onClick={handleSendMessage} disabled={isAILoading || !chatInput.trim() || !canUseAI}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white self-end disabled:opacity-50">
                        Send
                    </button>
                </div>
            </Card>
        </div>
    );
};

/**
 * AI configuration panel component, allowing users to adjust AI model parameters.
 * Business Value: Provides granular control over the generative AI's behavior, enabling
 * users to fine-tune outputs for creativity, diversity, and length. This configurability
 * maximizes the utility of the AI, allows adaptation to diverse narrative styles and
 * project requirements, and directly impacts the quality and relevance of AI-generated
 * content, securing optimal ROI from AI investments.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param addNotification Callback to add a notification.
 */
export const AIConfigPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, addNotification }) => {
    const { userRole } = useUserRole();
    const canManageAIConfig = userRole === 'admin';

    const currentConfig = project.settings.preferredAIConfig;
    const [localConfig, setLocalConfig] = useState<AIConfig>(currentConfig);

    useEffect(() => {
        setLocalConfig(currentConfig);
    }, [currentConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setLocalConfig(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSaveConfig = () => {
        if (!canManageAIConfig) {
            addNotification("You do not have permission to save AI configurations.", "error");
            return;
        }
        dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { projectId: project.id, settings: { preferredAIConfig: localConfig } } });
        addNotification("AI configuration saved.", "success");
    };

    const handleResetToDefaults = () => {
        if (!canManageAIConfig) {
            addNotification("You do not have permission to reset AI configurations.", "error");
            return;
        }
        setLocalConfig(defaultAIConfig);
        addNotification("AI configuration reset to defaults.", "info");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">AI Configuration</h2>
            <Card title="General AI Settings">
                <div className="space-y-4">
                    <SelectField
                        label="AI Model"
                        name="model"
                        value={localConfig.model}
                        onChange={handleChange}
                        options={[
                            { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash (Latest)' },
                            { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (Latest)' },
                            { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro (Legacy)' }
                        ]}
                        disabled={!canManageAIConfig}
                    />
                    <InputField
                        label="Temperature (Creativity - 0.0 to 1.0)"
                        type="number"
                        name="temperature"
                        value={localConfig.temperature.toString()}
                        onChange={handleChange}
                        min="0" max="1" step="0.01"
                        placeholder="0.0 - 1.0"
                        disabled={!canManageAIConfig}
                    />
                    <InputField
                        label="Top P (Diversity - 0.0 to 1.0)"
                        type="number"
                        name="topP"
                        value={localConfig.topP.toString()}
                        onChange={handleChange}
                        min="0" max="1" step="0.01"
                        placeholder="0.0 - 1.0"
                        disabled={!canManageAIConfig}
                    />
                    <InputField
                        label="Top K (Diversity - integer)"
                        type="number"
                        name="topK"
                        value={localConfig.topK.toString()}
                        onChange={handleChange}
                        min="1" step="1"
                        placeholder="1 - 100"
                        disabled={!canManageAIConfig}
                    />
                    <InputField
                        label="Max Output Tokens"
                        type="number"
                        name="maxOutputTokens"
                        value={localConfig.maxOutputTokens.toString()}
                        onChange={handleChange}
                        min="1" step="64"
                        placeholder="e.g., 2048"
                        disabled={!canManageAIConfig}
                    />

                    <div className="flex justify-end space-x-2 mt-6">
                        <button onClick={handleResetToDefaults} disabled={!canManageAIConfig} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white disabled:opacity-50">Reset to Defaults</button>
                        <button onClick={handleSaveConfig} disabled={!canManageAIConfig} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white disabled:opacity-50">Save Configuration</button>
                    </div>
                </div>
            </Card>
            <Card title="API Key Status">
                <p className="text-gray-300">
                    Your Google Gen AI API Key is currently: {' '}
                    {process.env.NEXT_PUBLIC_API_KEY && process.env.NEXT_PUBLIC_API_KEY !== 'undefined' ? (
                        <span className="text-green-400">Configured (***********)</span>
                    ) : (
                        <span className="text-red-400">Not Configured. AI features may be limited or disabled.</span>
                    )}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    To configure your API key, set the <code>NEXT_PUBLIC_API_KEY</code> environment variable in your project.
                    Only 'Admin' roles can modify these settings.
                </p>
            </Card>
        </div>
    );
};

/**
 * Project settings panel component, managing project-specific preferences and global UI settings.
 * Business Value: Provides users with granular control over their project's environment and
 * application behavior. This personalization enhances user satisfaction, accommodates diverse
 * workflows, and ensures the platform adapts to individual creative needs, contributing to
 * higher user engagement and retention.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param addNotification Callback to add a notification.
 */
export const ProjectSettingsPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, addNotification }) => {
    const { userRole, setUserRole } = useUserRole();
    const canEditSettings = userRole === 'admin' || userRole === 'writer';
    const canChangeRole = userRole === 'admin';

    const [localSettings, setLocalSettings] = useState<ProjectSettings>(project.settings);

    useEffect(() => {
        setLocalSettings(project.settings);
    }, [project.settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!canEditSettings) return;
        const { name, value, type, checked } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveSettings = () => {
        if (!canEditSettings) {
            addNotification("You do not have permission to save project settings.", "error");
            return;
        }
        dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { projectId: project.id, settings: localSettings } });
        addNotification("Project settings saved.", "success");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Project Settings</h2>
            <Card title="General Settings">
                <div className="space-y-4">
                    <InputField label="Project Name" name="name" value={project.name} onChange={() => { }} disabled />
                    <InputField label="Logline" name="logline" value={project.logline} onChange={() => { }} disabled />

                    <div>
                        <label className="inline-flex items-center text-gray-300">
                            <input
                                type="checkbox"
                                name="autosaveEnabled"
                                checked={localSettings.autosaveEnabled}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-cyan-600 bg-gray-700 border-gray-600 rounded"
                                disabled={!canEditSettings}
                            />
                            <span className="ml-2">Enable Autosave</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-7">Automatically saves your project every few seconds.</p>
                    </div>

                    <div>
                        <label className="inline-flex items-center text-gray-300">
                            <input
                                type="checkbox"
                                name="autoAIPropositions"
                                checked={localSettings.autoAIPropositions}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded"
                                disabled={!canEditSettings}
                            />
                            <span className="ml-2">Enable Auto AI Propositions (Experimental)</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-7">AI suggests dialogue/plot points in the background (may incur more AI costs).</p>
                    </div>

                    <SelectField
                        label="Theme"
                        name="theme"
                        value={localSettings.theme}
                        onChange={handleChange}
                        options={[
                            { value: 'dark', label: 'Dark' },
                            { value: 'light', label: 'Light' }
                        ]}
                        disabled={!canEditSettings}
                    />
                    <InputField
                        label="Document Font"
                        name="documentFont"
                        value={localSettings.documentFont}
                        onChange={handleChange}
                        placeholder="e.g., Inter, Source Code Pro"
                        disabled={!canEditSettings}
                    />
                    <InputField
                        label="Document Font Size (px)"
                        type="number"
                        name="documentFontSize"
                        value={localSettings.documentFontSize.toString()}
                        onChange={handleChange}
                        min="10" max="24" step="1"
                        disabled={!canEditSettings}
                    />

                    <div className="flex justify-end mt-6">
                        <button onClick={handleSaveSettings} disabled={!canEditSettings} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white disabled:opacity-50">Save Settings</button>
                    </div>
                </div>
            </Card>
            <Card title="User Role Simulation (for testing RBAC)">
                <p className="text-gray-300 mb-2">Current Role: <span className="font-semibold capitalize text-cyan-400">{userRole}</span></p>
                <SelectField
                    label="Simulate User Role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    options={[
                        { value: 'writer', label: 'Writer (Edit Content, Use AI)' },
                        { value: 'admin', label: 'Admin (All Permissions)' },
                        { value: 'viewer', label: 'Viewer (Read-Only)' },
                    ]}
                    disabled={!canChangeRole}
                />
                {!canChangeRole && <p className="text-xs text-gray-500 mt-1">Only 'Admin' roles can change user roles for simulation.</p>}
            </Card>
        </div>
    );
};

/**
 * Export/Import panel component, providing functionality to export project data in various formats and import existing projects.
 * Business Value: Ensures data portability and interoperability, allowing users to back up,
 * share, and transfer their narrative projects. This critical functionality protects
 * intellectual property, facilitates collaboration, and enables integration with other
 * tools, providing flexibility and security for high-value content assets.
 * @param project The currently active project.
 * @param dispatch The dispatcher function for application actions.
 * @param addNotification Callback to add a notification.
 */
export const ExportImportPanel: React.FC<{
    project: Project;
    dispatch: React.Dispatch<AppAction>;
    addNotification: (message: string, type: NotificationType) => void;
}> = ({ project, dispatch, addNotification }) => {
    const { userRole } = useUserRole();
    const canExportImport = userRole === 'admin' || userRole === 'writer';

    const [exportFormat, setExportFormat] = useState<ProjectSettings['exportFormat']>(project.settings.exportFormat);
    const [importFile, setImportFile] = useState<File | null>(null);

    const handleExport = () => {
        if (!canExportImport) {
            addNotification("You do not have permission to export projects.", "error");
            return;
        }
        try {
            let fileContent: string;
            let fileName: string;
            const projectData = { ...project, settings: { ...project.settings, preferredAIConfig: undefined } };

            switch (exportFormat) {
                case 'json':
                    fileContent = JSON.stringify(projectData, null, 2);
                    fileName = `${project.name.replace(/\s/g, '_')}.json`;
                    break;
                case 'fountain':
                    fileContent = `# ${project.name}\n\n`;
                    if (project.logline) fileContent += `Logline: ${project.logline}\n\n`;
                    fileContent += project.scenes.map(s => s.content).join('\n\n');
                    fileName = `${project.name.replace(/\s/g, '_')}.fountain`;
                    break;
                case 'pdf':
                case 'html':
                default:
                    addNotification("PDF/HTML export is not yet fully implemented. Exporting JSON for now.", "info");
                    fileContent = JSON.stringify(projectData, null, 2);
                    fileName = `${project.name.replace(/\s/g, '_')}.json`;
                    break;
            }

            const blob = new Blob([fileContent], { type: `application/${exportFormat === 'json' ? 'json' : 'text'}` });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addNotification(`Project exported as ${exportFormat.toUpperCase()}.`, "success");
        } catch (error: any) {
            console.error("Export failed:", error);
            addNotification(`Export failed: ${error.message}`, "error");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (!canExportImport) {
            addNotification("You do not have permission to import projects.", "error");
            return;
        }
        if (!importFile) {
            addNotification("Please select a file to import.", "warning");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedProject: Project = JSON.parse(content);
                if (importedProject && importedProject.id && importedProject.name && Array.isArray(importedProject.scenes)) {
                    const newProject = {
                        ...importedProject,
                        id: generateUniqueId(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        settings: { ...importedProject.settings, projectId: generateUniqueId() }
                    };
                    dispatch({ type: 'ADD_PROJECT', payload: newProject });
                    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newProject.id });
                    addNotification(`Project '${newProject.name}' imported successfully!`, "success");
                    setImportFile(null);
                } else {
                    throw new Error("Invalid project file structure.");
                }
            } catch (error: any) {
                console.error("Import failed:", error);
                addNotification(`Import failed: ${error.message}`, "error");
            }
        };
        reader.readAsText(importFile);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Export / Import Project</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Export Project">
                    <div className="space-y-4">
                        <SelectField
                            label="Export Format"
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as ProjectSettings['exportFormat'])}
                            options={[
                                { value: 'json', label: 'JSON (Full Project Data)' },
                                { value: 'fountain', label: 'Fountain (Screenplay Format)' },
                                { value: 'pdf', label: 'PDF (Print Format - Coming Soon)', disabled: true },
                                { value: 'html', label: 'HTML (Web Preview - Coming Soon)', disabled: true },
                            ]}
                            disabled={!canExportImport}
                        />
                        <button onClick={handleExport} className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50" disabled={!canExportImport}>
                            Export Project
                        </button>
                    </div>
                </Card>
                <Card title="Import Project">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Select JSON Project File</label>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-cyan-500 file:text-white
                                hover:file:bg-cyan-600"
                                disabled={!canExportImport}
                            />
                        </div>
                        <button onClick={handleImport} disabled={!importFile || !canExportImport} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50">
                            Import Project
                        </button>
                        {importFile && <p className="text-sm text-gray-400">Selected: {importFile.name}</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

/**
 * Main navigation bar component for the application.
 * Business Value: Provides intuitive and efficient navigation across all core application
 * modules, ensuring a seamless user experience. This consistent navigation system reduces
 * user friction, increases engagement, and helps users quickly access different creative
 * tools, thereby maximizing productivity and reducing the learning curve for new users.
 * @param activePanel The currently active panel.
 * @param setActivePanel Callback to set the active panel.
 * @param currentProjectName The name of the currently active project.
 * @param clearActiveProject Callback to clear the active project and return to the dashboard.
 */
export const MainNavbar: React.FC<{
    activePanel: AppPanel;
    setActivePanel: (panel: AppPanel) => void;
    currentProjectName: string;
    clearActiveProject: () => void;
}> = ({ activePanel, setActivePanel, currentProjectName, clearActiveProject }) => {
    const navItems: { label: string; panel: AppPanel }[] = [
        { label: 'Dashboard', panel: 'dashboard' },
        { label: 'Script Editor', panel: 'scriptEditor' },
        { label: 'Characters', panel: 'characters' },
        { label: 'Locations', panel: 'locations' },
        { label: 'Plot Board', panel: 'plotBoard' },
        { label: 'World Builder', panel: 'worldBuilder' },
        { label: 'AI Chat', panel: 'aiChat' },
        { label: 'AI Config', panel: 'aiConfig' },
        { label: 'Settings', panel: 'projectSettings' },
        { label: 'Export/Import', panel: 'exportImport' },
    ];

    return (
        <nav className="bg-gray-900 shadow-lg p-4 sticky top-0 z-40">
            <div className="flex justify-between items-center flex-wrap">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    <h1 className="text-2xl font-bold text-white tracking-wider">{APP_NAME}</h1>
                    {currentProjectName && (
                        <>
                            <span className="text-gray-500 hidden sm:inline">|</span>
                            <span className="text-cyan-400 text-xl font-semibold">{currentProjectName}</span>
                            <button onClick={clearActiveProject} className="text-gray-400 hover:text-white text-sm ml-2">
                                [Change Project]
                            </button>
                        </>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    {navItems.map(item => (
                        <button
                            key={item.panel}
                            onClick={() => setActivePanel(item.panel)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200
                                ${activePanel === item.panel
                                    ? 'bg-cyan-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

/**
 * Main application component for Narrative Forge, orchestrating state, UI, and AI interactions.
 * Business Value: This is the core orchestrator of the entire NarrativeForge Pro platform,
 * unifying all AI-driven tools and creative workflows into a cohesive, commercial-grade
 * application. It ensures robust state management, persistent data storage, real-time
 * user feedback, and simulated role-based access control, forming a stable foundation
 * for professional narrative development. This component's design guarantees scalability,
 * maintainability, and a superior user experience, which are critical for platform
 * adoption and sustained market leadership.
 */
export const NarrativeForgeView: React.FC = () => {
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const { addNotification } = useNotifications();

    const currentProject = appState.activeProjectId
        ? appState.projects.find(p => p.id === appState.activeProjectId)
        : null;

    useEffect(() => {
        const loadedProjects = loadAppStateFromLocalStorage();
        if (loadedProjects.length > 0) {
            dispatch({ type: 'SET_PROJECTS', payload: loadedProjects });
            const lastActiveProjectId = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}lastActiveProject`);
            if (lastActiveProjectId && loadedProjects.some(p => p.id === lastActiveProjectId)) {
                dispatch({ type: 'SET_ACTIVE_PROJECT', payload: lastActiveProjectId });
                const proj = loadedProjects.find(p => p.id === lastActiveProjectId);
                if (proj && proj.settings.lastOpenedPanel) {
                    dispatch({ type: 'SET_ACTIVE_PANEL', payload: proj.settings.lastOpenedPanel });
                } else {
                    dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'scriptEditor' });
                }
            } else {
                dispatch({ type: 'SET_ACTIVE_PROJECT', payload: null });
                dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'dashboard' });
            }
        } else {
            dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'dashboard' });
        }
    }, []);

    const debouncedSaveState = useCallback(
        debounce((stateToSave: AppState) => {
            saveAppStateToLocalStorage(stateToSave);
            if (stateToSave.activeProjectId) {
                localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}lastActiveProject`, stateToSave.activeProjectId);
            } else {
                localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}lastActiveProject`);
            }
            addNotification("Project data autosaved!", "info");
        }, DEBOUNCE_SAVE_MS),
        [addNotification]
    );

    useEffect(() => {
        if (appState.projects.length > 0) {
            debouncedSaveState(appState);
            if (currentProject && currentProject.settings.lastOpenedPanel !== appState.activePanel) {
                dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { projectId: currentProject.id, settings: { lastOpenedPanel: appState.activePanel } } });
            }
        }
    }, [appState.projects, appState.activeProjectId, appState.activePanel, debouncedSaveState, currentProject]);

    const handleSetActivePanel = useCallback((panel: AppPanel) => {
        dispatch({ type: 'SET_ACTIVE_PANEL', payload: panel });
    }, []);

    const handleClearActiveProject = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: null });
        dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'dashboard' });
    }, []);

    const handleConfirmDelete = (entityId: string, message: string) => {
        const modalData = appState.showModal.data;
        if (modalData?.entityId !== entityId) {
            console.warn(`Attempted to confirm deletion for entity ID ${entityId} but modal data is for ${modalData?.entityId}. Action aborted.`);
            return;
        }

        switch (appState.showModal.type) {
            case 'confirmDelete':
                const projectToDelete = appState.projects.find(p => p.id === entityId);
                if (projectToDelete) {
                    dispatch({ type: 'DELETE_PROJECT', payload: entityId });
                    addNotification("Project deleted permanently.", "success");
                } else if (currentProject) {
                    if (currentProject.characters.some(c => c.id === entityId)) {
                        dispatch({ type: 'DELETE_CHARACTER', payload: { projectId: currentProject.id, characterId: entityId } });
                        addNotification("Character deleted.", "success");
                    } else if (currentProject.locations.some(l => l.id === entityId)) {
                        dispatch({ type: 'DELETE_LOCATION', payload: { projectId: currentProject.id, locationId: entityId } });
                        addNotification("Location deleted.", "success");
                    } else if (currentProject.scenes.some(s => s.id === entityId)) {
                        dispatch({ type: 'DELETE_SCENE', payload: { projectId: currentProject.id, sceneId: entityId } });
                        addNotification("Scene deleted.", "success");
                    } else if (currentProject.plotPoints.some(pp => pp.id === entityId)) {
                        dispatch({ type: 'DELETE_PLOT_POINT', payload: { projectId: currentProject.id, plotPointId: entityId } });
                        addNotification("Plot Point deleted.", "success");
                    } else if (currentProject.storyArcs.some(sa => sa.id === entityId)) {
                        dispatch({ type: 'DELETE_STORY_ARC', payload: { projectId: currentProject.id, storyArcId: entityId } });
                        addNotification("Story Arc deleted.", "success");
                    }
                }
                break;
            default:
                break;
        }
        dispatch({ type: 'CLOSE_MODAL' });
    };

    const renderPanel = () => {
        if (!currentProject && appState.activePanel !== 'dashboard') {
            dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'dashboard' });
            return null;
        }

        switch (appState.activePanel) {
            case 'dashboard':
                return <DashboardPanel projects={appState.projects} activeProjectId={appState.activeProjectId} dispatch={dispatch} addNotification={addNotification} />;
            case 'scriptEditor':
                return currentProject && <ScriptEditorPanel
                    project={currentProject}
                    dispatch={dispatch}
                    currentAISuggestions={appState.currentAISuggestions}
                    isAILoading={appState.isAILoading}
                    currentAIRequestPrompt={appState.currentAIRequestPrompt}
                    addNotification={addNotification}
                />;
            case 'characters':
                return currentProject && <CharactersPanel
                    project={currentProject}
                    dispatch={dispatch}
                    isAILoading={appState.isAILoading}
                    currentAISuggestions={appState.currentAISuggestions}
                    addNotification={addNotification}
                />;
            case 'locations':
                return currentProject && <LocationsPanel
                    project={currentProject}
                    dispatch={dispatch}
                    isAILoading={appState.isAILoading}
                    currentAISuggestions={appState.currentAISuggestions}
                    addNotification={addNotification}
                />;
            case 'plotBoard':
                return currentProject && <PlotBoardPanel
                    project={currentProject}
                    dispatch={dispatch}
                    isAILoading={appState.isAILoading}
                    currentAISuggestions={appState.currentAISuggestions}
                    addNotification={addNotification}
                />;
            case 'worldBuilder':
                return currentProject && <WorldBuilderPanel
                    project={currentProject}
                    dispatch={dispatch}
                    addNotification={addNotification}
                />;
            case 'aiChat':
                return currentProject && <AIChatPanel
                    project={currentProject}
                    dispatch={dispatch}
                    isAILoading={appState.isAILoading}
                    addNotification={addNotification}
                />;
            case 'aiConfig':
                return currentProject && <AIConfigPanel
                    project={currentProject}
                    dispatch={dispatch}
                    addNotification={addNotification}
                />;
            case 'projectSettings':
                return currentProject && <ProjectSettingsPanel
                    project={currentProject}
                    dispatch={dispatch}
                    addNotification={addNotification}
                />;
            case 'exportImport':
                return currentProject && <ExportImportPanel
                    project={currentProject}
                    dispatch={dispatch}
                    addNotification={addNotification}
                />;
            default:
                return <DashboardPanel projects={appState.projects} activeProjectId={appState.activeProjectId} dispatch={dispatch} addNotification={addNotification} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <MainNavbar
                activePanel={appState.activePanel}
                setActivePanel={handleSetActivePanel}
                currentProjectName={currentProject?.name || ''}
                clearActiveProject={handleClearActiveProject}
            />
            <main className="flex-grow p-6 container mx-auto max-w-7xl">
                {renderPanel()}
            </main>

            <ProjectFormModal
                isOpen={appState.showModal.type === 'newProject' && appState.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onSubmit={(projectData) => {
                    const isEditing = !!(appState.showModal.data as Project)?.id;
                    if (isEditing) {
                        dispatch({ type: 'UPDATE_PROJECT', payload: projectData });
                        addNotification(`Project '${projectData.name}' updated.`, "success");
                    } else {
                        const newProjectWithId = { ...projectData, id: generateUniqueId(), settings: { ...projectData.settings, projectId: generateUniqueId() } };
                        dispatch({ type: 'ADD_PROJECT', payload: newProjectWithId });
                        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newProjectWithId.id });
                        dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'scriptEditor' });
                        addNotification("New project created!", "success");
                    }
                }}
                initialProject={appState.showModal.data as Project || emptyProject}
            />

            <ConfirmDeleteModal
                isOpen={appState.showModal.type === 'confirmDelete' && appState.showModal.isOpen}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                onConfirm={() => handleConfirmDelete(appState.showModal.data?.entityId, appState.showModal.data?.message)}
                message={appState.showModal.data?.message || "Are you sure you want to delete this item?"}
            />
        </div>
    );
};

/**
 * Wrapper component to provide Notification and UserRole contexts to the main NarrativeForgeView.
 * Business Value: Ensures that essential cross-cutting concerns like global notifications
 * and role-based access control are seamlessly integrated and available throughout the
 * application. This foundational wrapper enhances the reliability, security, and
 * user experience of the entire platform.
 */
const NarrativeForgeViewWrapper: React.FC = () => (
    <NotificationProvider>
        <UserRoleProvider>
            <NarrativeForgeView />
            <NotificationContainer />
        </UserRoleProvider>
    </NotificationProvider>
);

export default NarrativeForgeViewWrapper;