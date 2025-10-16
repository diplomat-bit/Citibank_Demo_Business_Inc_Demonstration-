// components/views/blueprints/CareerTrajectoryView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from '../../Card'; // Keep existing import for Card
import { GoogleGenAI, Type } from "@google/genai"; // Keep existing import for GoogleGenAI

/**
 * =====================================================================================================================
 * =====================================================================================================================
 *  HIGHLY ADVANCED CAREER TRAJECTORY PLATFORM - CORE FILE
 *  This file has been expanded to simulate a comprehensive, self-contained career development application,
 *  incorporating thousands of lines of logic, data management, advanced AI interactions, and UI components.
 *  It aims to provide a "logical conclusion" to a career trajectory tool, designed to be called immediately
 *  upon app installation and provide a vast array of functionality without external backend dependencies.
 *
 *  Disclaimer: In a real-world production environment, this architecture would be distributed across
 *  multiple files, a dedicated backend, and a robust microservices infrastructure. This single-file
 *  implementation is for demonstration purposes as per the directive.
 * =====================================================================================================================
 * =====================================================================================================================
 */

/**
 * =====================================================================================================================
 *  SECTION 1: CORE INFRASTRUCTURE - CONSTANTS, ENUMS, INTERFACES, AND UTILITIES
 * =====================================================================================================================
 */

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  1.1: Global Configuration & Constants
 * ---------------------------------------------------------------------------------------------------------------------
 */
export const APP_NAME = "AetherCareer Blueprint 108";
export const APP_VERSION = "2.0.0-omega";
export const API_BASE_URL_SIMULATED = "aethercareer.com/api/v1"; // Simulated, not real
export const LOCAL_STORAGE_PREFIX = "aether_career_bp_108_";
export const MAX_RESUME_LENGTH = 10000;
export const MAX_JOB_DESC_LENGTH = 5000;
export const AI_RESPONSE_TIMEOUT_MS = 60000; // 60 seconds
export const DEBOUNCE_DELAY_MS = 500;

export enum CareerStage {
    EntryLevel = "Entry-Level",
    Junior = "Junior",
    MidLevel = "Mid-Level",
    Senior = "Senior",
    Lead = "Lead",
    Manager = "Manager",
    Director = "Director",
    Executive = "Executive"
}

export enum SkillCategory {
    Technical = "Technical",
    Soft = "Soft Skills",
    Management = "Management",
    DomainSpecific = "Domain Specific",
    Tools = "Tools & Technologies"
}

export enum RecommendationType {
    Course = "Course",
    Certification = "Certification",
    Book = "Book",
    NetworkingEvent = "Networking Event",
    Project = "Project Idea",
    Mentor = "Mentor Connection"
}

export enum FeedbackSentiment {
    Positive = "Positive",
    Neutral = "Neutral",
    Negative = "Negative"
}

export enum AIPromptTemplate {
    ResumeAnalysis = "RESUME_ANALYSIS",
    CoverLetterGeneration = "COVER_LETTER_GENERATION",
    SkillGapAnalysis = "SKILL_GAP_ANALYSIS",
    CareerPathSuggestion = "CAREER_PATH_SUGGESTION",
    InterviewQuestionGeneration = "INTERVIEW_QUESTION_GENERATION",
    InterviewFeedback = "INTERVIEW_FEEDBACK",
    SalaryNegotiationScript = "SALARY_NEGOTIATION_SCRIPT",
    LinkedInProfileOptimization = "LINKEDIN_PROFILE_OPTIMIZATION",
    PerformanceReviewPrep = "PERFORMANCE_REVIEW_PREP",
    MarketTrendAnalysis = "MARKET_TREND_ANALYSIS",
    LearningResourceRecommendation = "LEARNING_RESOURCE_RECOMMENDATION"
}

export const AI_MODELS = {
    fast: 'gemini-2.5-flash',
    balanced: 'gemini-1.5-pro',
    advanced: 'gemini-1.5-flash-latest' // Assuming a hypothetical advanced model
};

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  1.2: Data Models (Interfaces)
 * ---------------------------------------------------------------------------------------------------------------------
 */

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    currentRole: string;
    industry: string;
    yearsExperience: number;
    careerStage: CareerStage;
    skills: string[]; // List of skills
    education: string[];
    certifications: string[];
    desiredRoles: string[];
    desiredIndustry: string;
    salaryExpectationMin: number;
    salaryExpectationMax: number;
    lastUpdated: string;
}

export interface SkillAssessmentResult {
    skill: string;
    category: SkillCategory;
    currentLevel: number; // 1-5 scale
    targetLevel: number; // 1-5 scale
    gap: number; // targetLevel - currentLevel
    recommendations: LearningResource[];
    lastAssessed: string;
}

export interface CareerGoal {
    id: string;
    title: string;
    description: string;
    targetDate: string; // ISO date string
    status: 'Pending' | 'InProgress' | 'Completed' | 'Deferred';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    relatedSkills: string[];
    progressNotes: { date: string; note: string }[];
    createdAt: string;
    lastUpdated: string;
}

export interface JobApplication {
    id: string;
    jobTitle: string;
    company: string;
    applicationDate: string; // ISO date string
    status: 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected' | 'Withdrawn';
    notes: string;
    jobDescription: string;
    resumeUsed: string; // Snapshot of resume text
    coverLetterUsed: string; // Snapshot of cover letter text
    interviewDates: string[]; // ISO date strings
    feedbackReceived: string;
    followUpDate: string | null; // ISO date string
    salaryOffer?: number;
    negotiationHistory: string[];
    link: string; // Link to the job posting
    createdAt: string;
    lastUpdated: string;
}

export interface AISuggestion {
    id: string;
    originalText: string;
    improvedText: string;
    rationale: string;
    category: 'Resume' | 'CoverLetter' | 'LinkedIn' | 'General';
    severity: 'Minor' | 'Moderate' | 'Major';
}

export interface CareerPathRecommendation {
    id: string;
    role: string;
    industry: string;
    description: string;
    requiredSkills: { skill: string; category: SkillCategory; level: number }[];
    averageSalaryRange: string;
    growthOutlook: 'Low' | 'Medium' | 'High' | 'Very High';
    pathways: { title: string; type: RecommendationType; resource: string }[];
}

export interface LearningResource {
    id: string;
    title: string;
    description: string;
    type: RecommendationType;
    link: string;
    estimatedTime: string;
    cost: 'Free' | 'Paid' | 'Subscription';
    relatedSkills: string[];
    provider: string;
}

export interface MarketTrend {
    id: string;
    title: string;
    description: string;
    impactOnCareer: string;
    relevantSkills: string[];
    source: string;
    date: string; // ISO date string
}

export interface InterviewQuestion {
    id: string;
    question: string;
    type: 'Behavioral' | 'Technical' | 'Situational' | 'Problem-Solving';
    keywords: string[];
    suggestedApproach: string; // AI-generated tip
}

export interface InterviewSession {
    id: string;
    jobApplicationId: string;
    sessionDate: string; // ISO date string
    role: string;
    company: string;
    questionsAsked: { question: string; userAnswer: string; aiFeedback: string; score: number }[];
    overallFeedback: string;
    areasForImprovement: string[];
    strengths: string[];
    score: number; // Overall session score out of 100
    createdAt: string;
    lastUpdated: string;
}

export interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    read: boolean;
}

// Simulated Webhook event structure
export interface WebhookEvent {
    id: string;
    eventType: 'JOB_APPLIED' | 'INTERVIEW_SCHEDULED' | 'GOAL_UPDATED' | 'PROFILE_CHANGED' | 'AI_TASK_COMPLETED';
    payload: any; // Generic payload for the event
    timestamp: string;
    processed: boolean;
}

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  1.3: Utility Functions & Classes (Self-Contained)
 * ---------------------------------------------------------------------------------------------------------------------
 */

export const generateId = (): string => `_${Math.random().toString(36).substr(2, 9)}`;

export const DateUtils = {
    getNowISO: () => new Date().toISOString(),
    formatDate: (isoString: string) => new Date(isoString).toLocaleDateString(),
    timeSince: (isoString: string) => {
        const now = new Date();
        const past = new Date(isoString);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }
};

export const TextUtils = {
    truncate: (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    countWords: (text: string) => text.trim().split(/\s+/).filter(Boolean).length,
    capitalizeFirstLetter: (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
};

export const ValidationUtils = {
    isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isNotNullOrEmpty: (str: string | null | undefined) => str !== null && str !== undefined && str.trim() !== '',
    isPositiveNumber: (num: number) => typeof num === 'number' && num > 0
};

export class CustomError extends Error {
    constructor(message: string, public code: string = 'GENERIC_ERROR') {
        super(message);
        this.name = 'CustomError';
    }
}

/**
 * Global Debounce utility for input fields.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  1.4: Simulated Local Storage Service (acts as a local 'database')
 * ---------------------------------------------------------------------------------------------------------------------
 */

export class LocalDataStore {
    private static instance: LocalDataStore;
    private constructor() {}

    public static getInstance(): LocalDataStore {
        if (!LocalDataStore.instance) {
            LocalDataStore.instance = new LocalDataStore();
        }
        return LocalDataStore.instance;
    }

    private getKey(entityType: string, id?: string): string {
        return `${LOCAL_STORAGE_PREFIX}${entityType}${id ? `_${id}` : ''}`;
    }

    public getItem<T>(entityType: string, id: string): T | null {
        try {
            const data = localStorage.getItem(this.getKey(entityType, id));
            return data ? JSON.parse(data) as T : null;
        } catch (error) {
            console.error(`Error getting item ${entityType}/${id}:`, error);
            return null;
        }
    }

    public getAllItems<T>(entityType: string): T[] {
        const items: T[] = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.getKey(entityType))) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        items.push(JSON.parse(data) as T);
                    }
                }
            }
        } catch (error) {
            console.error(`Error getting all items for ${entityType}:`, error);
        }
        return items;
    }

    public setItem<T extends { id: string }>(entityType: string, item: T): void {
        try {
            localStorage.setItem(this.getKey(entityType, item.id), JSON.stringify(item));
        } catch (error) {
            console.error(`Error setting item ${entityType}/${item.id}:`, error);
            throw new CustomError(`Failed to save ${entityType}. Local storage might be full.`, 'STORAGE_FULL');
        }
    }

    public removeItem(entityType: string, id: string): void {
        try {
            localStorage.removeItem(this.getKey(entityType, id));
        } catch (error) {
            console.error(`Error removing item ${entityType}/${id}:`, error);
        }
    }

    public clearAll(entityType: string): void {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.getKey(entityType))) {
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            console.error(`Error clearing all items for ${entityType}:`, error);
        }
    }
}

export const dataStore = LocalDataStore.getInstance();

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  1.5: Simulated Notification & Webhook Management
 * ---------------------------------------------------------------------------------------------------------------------
 */
export class NotificationService {
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];

    public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
        const newNotification: Notification = {
            ...notification,
            id: generateId(),
            timestamp: DateUtils.getNowISO(),
            read: false,
        };
        this.notifications.unshift(newNotification); // Add to beginning
        this.notifyListeners();
        // Persist notifications (e.g., in localStorage) - simplified for this example
        dataStore.setItem('notification', newNotification);
    }

    public getNotifications(): Notification[] {
        // In a real app, this would fetch from a persistent store,
        // here we just return the in-memory list for simplicity.
        return this.notifications.concat(dataStore.getAllItems<Notification>('notification')); // Combine in-memory with potentially persisted
    }

    public markAsRead(id: string): void {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.notifyListeners();
            dataStore.setItem('notification', notification);
        }
    }

    public clearNotifications(): void {
        this.notifications = [];
        this.notifyListeners();
        dataStore.clearAll('notification');
    }

    public subscribe(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }
}
export const notificationService = new NotificationService();


export class WebhookProcessor {
    private static instance: WebhookProcessor;
    private eventQueue: WebhookEvent[] = [];
    private processing: boolean = false;
    private constructor() {}

    public static getInstance(): WebhookProcessor {
        if (!WebhookProcessor.instance) {
            WebhookProcessor.instance = new WebhookProcessor();
        }
        return WebhookProcessor.instance;
    }

    public async receiveEvent(event: Omit<WebhookEvent, 'id' | 'timestamp' | 'processed'>): Promise<void> {
        const newEvent: WebhookEvent = {
            ...event,
            id: generateId(),
            timestamp: DateUtils.getNowISO(),
            processed: false,
        };
        this.eventQueue.push(newEvent);
        await this.processQueue();
    }

    private async processQueue(): Promise<void> {
        if (this.processing) return;
        this.processing = true;

        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (!event) continue;

            console.log(`Processing webhook event: ${event.eventType} (ID: ${event.id})`);
            try {
                await this.handleEvent(event);
                event.processed = true;
                console.log(`Webhook event ${event.id} processed successfully.`);
            } catch (error) {
                console.error(`Error processing webhook event ${event.id}:`, error);
                // Optionally re-queue with a delay or move to a dead-letter queue
                notificationService.addNotification({
                    type: 'error',
                    message: `Failed to process webhook event: ${event.eventType}. Error: ${(error as Error).message}`
                });
            }
        }
        this.processing = false;
    }

    private async handleEvent(event: WebhookEvent): Promise<void> {
        switch (event.eventType) {
            case 'JOB_APPLIED':
                // Simulate sending a follow-up reminder
                notificationService.addNotification({
                    type: 'info',
                    message: `Don't forget to follow up on your application for ${event.payload.jobTitle} at ${event.payload.company} in 7 days!`
                });
                // Update internal application status or analytics
                // This would involve interacting with the dataStore or other internal APIs
                break;
            case 'INTERVIEW_SCHEDULED':
                notificationService.addNotification({
                    type: 'success',
                    message: `Interview scheduled for ${event.payload.role} at ${event.payload.company} on ${DateUtils.formatDate(event.payload.interviewDate)}! Start your AI interview prep!`
                });
                break;
            case 'GOAL_UPDATED':
                notificationService.addNotification({
                    type: 'info',
                    message: `Goal "${event.payload.title}" progress updated to ${event.payload.status}. Keep up the great work!`
                });
                break;
            case 'PROFILE_CHANGED':
                // Trigger AI re-evaluation for recommendations based on new profile
                notificationService.addNotification({
                    type: 'info',
                    message: `Your profile has been updated. Re-evaluating career recommendations...`
                });
                // Call a simulated internal AI API for re-evaluation
                break;
            case 'AI_TASK_COMPLETED':
                notificationService.addNotification({
                    type: 'success',
                    message: `AI task "${event.payload.taskName}" completed! Check out the results.`
                });
                break;
            default:
                console.warn(`Unknown webhook event type: ${event.eventType}`);
        }
        // In a real system, would save the processed webhook event status
    }
}
export const webhookProcessor = WebhookProcessor.getInstance();


/**
 * =====================================================================================================================
 *  SECTION 2: AI INTEGRATION LAYER (SIMULATED & WRAPPED GEMINI)
 * =====================================================================================================================
 */

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *  2.1: Advanced CareerAIClient (Wraps GoogleGenAI with specific career methods)
 * ---------------------------------------------------------------------------------------------------------------------
 * This class abstracts the raw GoogleGenAI calls into higher-level, career-specific functions,
 * simulating a more complex internal AI engine.
 */
export class CareerAIClient {
    private ai: GoogleGenAI;
    private currentModel: string;
    private apiKey: string;

    constructor(apiKey: string, defaultModel: string = AI_MODELS.balanced) {
        if (!apiKey) {
            throw new CustomError("API_KEY is not provided for CareerAIClient.", "API_KEY_MISSING");
        }
        this.apiKey = apiKey;
        this.ai = new GoogleGenAI({ apiKey });
        this.currentModel = defaultModel;
    }

    public setModel(modelName: string): void {
        if (Object.values(AI_MODELS).includes(modelName)) {
            this.currentModel = modelName;
        } else {
            console.warn(`Invalid AI model specified: ${modelName}. Using default: ${this.currentModel}`);
        }
    }

    private async callGenerativeAI<T>(prompt: string, schema: any, model?: string): Promise<T> {
        const selectedModel = model || this.currentModel;
        try {
            const result = await Promise.race([
                this.ai.models.generateContent({
                    model: selectedModel,
                    contents: prompt,
                    config: { responseMimeType: "application/json", responseSchema: schema }
                }),
                new Promise<any>((_, reject) => setTimeout(() => reject(new CustomError("AI response timed out.", "AI_TIMEOUT")), AI_RESPONSE_TIMEOUT_MS))
            ]);

            const responseText = result?.text;
            if (!responseText) {
                throw new CustomError("AI returned no text content.", "AI_EMPTY_RESPONSE");
            }

            // Attempt to parse JSON. Gemini sometimes returns markdown wrapped JSON.
            let parsedJson: T;
            try {
                if (responseText.startsWith("```json")) {
                    parsedJson = JSON.parse(responseText.substring(7, responseText.lastIndexOf('```'))) as T;
                } else {
                    parsedJson = JSON.parse(responseText) as T;
                }
            } catch (jsonError) {
                console.error("Failed to parse AI response JSON:", responseText, jsonError);
                throw new CustomError("AI response was not valid JSON.", "AI_INVALID_JSON_RESPONSE");
            }
            return parsedJson;

        } catch (error) {
            console.error(`Error during AI call with model ${selectedModel}:`, error);
            if (error instanceof CustomError) throw error;
            throw new CustomError(`AI generation failed: ${(error as Error).message}`, "AI_GENERATION_ERROR");
        }
    }

    /**
     * AI method: Analyze Resume for a specific Job Description
     * @param resumeText The user's resume content.
     * @param jobDescription The target job description.
     * @returns A list of actionable AI suggestions for resume improvement.
     */
    public async analyzeResumeForJob(resumeText: string, jobDescription: string): Promise<AISuggestion[]> {
        const prompt = `You are an expert career coach focused on applicant tracking systems (ATS) and hiring best practices.
            Your task is to analyze a given Resume against a specific Job Description.
            Identify specific areas in the resume that can be improved to better align with the job description.
            For each improvement, provide the 'originalText' (the exact text snippet from the resume that needs change),
            the 'improvedText' (a suggested, more impactful, and relevant replacement),
            a 'rationale' explaining why the change is beneficial (e.g., keyword matching, STAR method, quantifiable impact),
            a 'category' (Resume), and a 'severity' (Minor, Moderate, Major).
            Focus on quantifying achievements, matching keywords, and using strong action verbs.

            **Job Description:**\n${jobDescription}\n\n**Resume:**\n${resumeText}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                improvements: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            originalText: { type: 'STRING' },
                            improvedText: { type: 'STRING' },
                            rationale: { type: 'STRING' },
                            category: { type: 'STRING', enum: ['Resume'] },
                            severity: { type: 'STRING', enum: ['Minor', 'Moderate', 'Major'] }
                        },
                        required: ['originalText', 'improvedText', 'rationale', 'category', 'severity']
                    }
                }
            },
            required: ['improvements']
        };

        const response = await this.callGenerativeAI<{ improvements: AISuggestion[] }>(prompt, schema);
        return response.improvements;
    }

    /**
     * AI method: Generate a tailored Cover Letter
     * @param userProfile The user's profile data.
     * @param jobApplication The job application details, including job description and company.
     * @param resumeSummary A summary of the user's resume for context.
     * @returns A string containing the generated cover letter.
     */
    public async generateCoverLetter(
        userProfile: UserProfile,
        jobApplication: JobApplication,
        resumeSummary: string
    ): Promise<string> {
        const prompt = `You are an expert cover letter writer.
            Draft a compelling and personalized cover letter for the user based on their profile, resume summary, and the target job description.
            Highlight relevant skills, experience, and achievements that align with the job requirements.
            Ensure a professional tone and a clear call to action.

            **User Profile:**\nName: ${userProfile.name}\nCurrent Role: ${userProfile.currentRole}\nSkills: ${userProfile.skills.join(', ')}\nEducation: ${userProfile.education.join(', ')}
            **Job Details:**\nCompany: ${jobApplication.company}\nJob Title: ${jobApplication.jobTitle}\nJob Description:\n${jobApplication.jobDescription}
            **Resume Summary:**\n${resumeSummary}

            Draft the cover letter as a professional business letter, without salutation placeholder and signature, but with a clear introduction, body paragraphs matching requirements, and conclusion.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                coverLetter: { type: Type.STRING, description: "The generated cover letter content." }
            },
            required: ['coverLetter']
        };

        const response = await this.callGenerativeAI<{ coverLetter: string }>(prompt, schema);
        return response.coverLetter;
    }

    /**
     * AI method: Perform a Skill Gap Analysis
     * @param userProfile The user's current profile.
     * @param targetRoles A list of desired roles or a specific job description.
     * @returns A list of SkillAssessmentResult showing gaps and recommendations.
     */
    public async getSkillGapAnalysis(userProfile: UserProfile, targetRoles: string[] | string): Promise<SkillAssessmentResult[]> {
        const target = Array.isArray(targetRoles) ? targetRoles.join(', ') : targetRoles;
        const prompt = `You are a career development expert specializing in skill gap analysis.
            Given the user's current profile and their desired target roles/job description,
            identify key skills required for those roles and compare them against the user's existing skills.
            For each identified skill, provide:
            - The skill name and category.
            - A 'currentLevel' (simulated based on user profile and general knowledge, 1-5).
            - A 'targetLevel' required for the desired roles (1-5).
            - The calculated 'gap' (targetLevel - currentLevel).
            - Up to 3 'recommendations' (LearningResource objects with title, link, type, estimatedTime, cost, provider)
              to bridge the gap, including courses, certifications, or project ideas.
            - 'lastAssessed' date.

            **User Profile:**\n${JSON.stringify(userProfile, null, 2)}
            **Target Roles/Description:**\n${target}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                skillGaps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            skill: { type: Type.STRING },
                            category: { type: Type.STRING, enum: Object.values(SkillCategory) },
                            currentLevel: { type: Type.NUMBER, minimum: 1, maximum: 5 },
                            targetLevel: { type: Type.NUMBER, minimum: 1, maximum: 5 },
                            gap: { type: Type.NUMBER, minimum: -4, maximum: 4 },
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: Object.values(RecommendationType) },
                                        link: { type: Type.STRING },
                                        estimatedTime: { type: Type.STRING },
                                        cost: { type: Type.STRING, enum: ['Free', 'Paid', 'Subscription'] },
                                        relatedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        provider: { type: Type.STRING }
                                    },
                                    required: ['id', 'title', 'description', 'type', 'link', 'estimatedTime', 'cost', 'relatedSkills', 'provider']
                                }
                            },
                            lastAssessed: { type: Type.STRING, format: 'date-time' }
                        },
                        required: ['skill', 'category', 'currentLevel', 'targetLevel', 'gap', 'recommendations', 'lastAssessed']
                    }
                }
            },
            required: ['skillGaps']
        };

        const response = await this.callGenerativeAI<{ skillGaps: SkillAssessmentResult[] }>(prompt, schema);
        // Assign generated IDs for resources, as AI doesn't always generate complex IDs
        response.skillGaps.forEach(gap => gap.recommendations.forEach(rec => rec.id = rec.id || generateId()));
        return response.skillGaps;
    }

    /**
     * AI method: Generate Career Path Recommendations
     * @param userProfile The user's current profile.
     * @param currentGoals A list of user's current career goals.
     * @returns A list of CareerPathRecommendation objects.
     */
    public async getCareerPathRecommendations(userProfile: UserProfile, currentGoals: CareerGoal[]): Promise<CareerPathRecommendation[]> {
        const prompt = `You are an experienced career counselor.
            Based on the user's current profile and stated career goals, provide 3-5 plausible career path recommendations.
            For each recommendation, include:
            - The recommended role and industry.
            - A brief description of the role.
            - A list of 'requiredSkills' with their category and target level (1-5).
            - The 'averageSalaryRange' (e.g., "$80,000 - $120,000").
            - The 'growthOutlook' for this role.
            - A list of specific 'pathways' (LearningResource/NetworkingEvent recommendations)
              to achieve this career path.

            **User Profile:**\n${JSON.stringify(userProfile, null, 2)}
            **Current Goals:**\n${JSON.stringify(currentGoals.map(g => ({ title: g.title, description: g.description })), null, 2)}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                careerPaths: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            role: { type: Type.STRING },
                            industry: { type: Type.STRING },
                            description: { type: Type.STRING },
                            requiredSkills: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        skill: { type: Type.STRING },
                                        category: { type: Type.STRING, enum: Object.values(SkillCategory) },
                                        level: { type: Type.NUMBER, minimum: 1, maximum: 5 }
                                    },
                                    required: ['skill', 'category', 'level']
                                }
                            },
                            averageSalaryRange: { type: Type.STRING },
                            growthOutlook: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Very High'] },
                            pathways: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: Object.values(RecommendationType) },
                                        resource: { type: Type.STRING } // Could be a link or description
                                    },
                                    required: ['title', 'type', 'resource']
                                }
                            }
                        },
                        required: ['id', 'role', 'industry', 'description', 'requiredSkills', 'averageSalaryRange', 'growthOutlook', 'pathways']
                    }
                }
            },
            required: ['careerPaths']
        };

        const response = await this.callGenerativeAI<{ careerPaths: CareerPathRecommendation[] }>(prompt, schema);
        response.careerPaths.forEach(path => path.id = path.id || generateId());
        return response.careerPaths;
    }

    /**
     * AI method: Simulate an Interview Session
     * @param jobDescription The target job description.
     * @param userAnswers A map of question -> user answer from a prior session.
     * @param userProfile The user's profile for contextualizing questions.
     * @returns A list of InterviewQuestion objects with AI feedback.
     */
    public async generateInterviewQuestions(jobDescription: string, userProfile: UserProfile, previousQuestions: InterviewQuestion[] = []): Promise<InterviewQuestion[]> {
        const prompt = `You are an AI interviewer specializing in ${jobDescription.includes('Software Engineer') ? 'technical software engineering' : 'general professional'} roles.
            Generate 5 relevant interview questions (mix of behavioral, technical, situational) based on the provided job description and user profile.
            Avoid asking questions already in 'previousQuestions' list.
            For each question, provide its 'type', 'keywords', and a 'suggestedApproach' for answering it effectively.

            **Job Description:**\n${jobDescription}
            **User Profile:**\n${JSON.stringify({ role: userProfile.currentRole, skills: userProfile.skills }, null, 2)}
            **Previous Questions Asked:**\n${JSON.stringify(previousQuestions.map(q => q.question), null, 2)}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['Behavioral', 'Technical', 'Situational', 'Problem-Solving'] },
                            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                            suggestedApproach: { type: Type.STRING }
                        },
                        required: ['id', 'question', 'type', 'keywords', 'suggestedApproach']
                    }
                }
            },
            required: ['questions']
        };
        const response = await this.callGenerativeAI<{ questions: InterviewQuestion[] }>(prompt, schema);
        response.questions.forEach(q => q.id = q.id || generateId());
        return response.questions;
    }

    /**
     * AI method: Provide feedback on Interview Answers
     * @param questionsWithAnswers A list of objects containing question and user's answer.
     * @param jobDescription The job description for context.
     * @returns A structured feedback object.
     */
    public async getInterviewFeedback(
        questionsWithAnswers: { question: string; userAnswer: string; }[],
        jobDescription: string,
        userProfile: UserProfile
    ): Promise<{ overallFeedback: string; areasForImprovement: string[]; strengths: string[]; questionsFeedback: { question: string; feedback: string; score: number }[]; score: number }> {
        const prompt = `You are an expert interviewer and career coach providing constructive feedback.
            Analyze the user's answers to the interview questions in the context of the provided job description and user profile.
            For each answer, provide specific feedback, highlighting strengths and areas for improvement, and a score (0-10) for that answer.
            Then, provide an overall feedback summary, general areas for improvement, and overall strengths.
            Provide an overall session score out of 100.

            **Job Description:**\n${jobDescription}
            **User Profile (Context):**\n${JSON.stringify({ role: userProfile.currentRole, skills: userProfile.skills }, null, 2)}
            **Questions and User Answers:**\n${JSON.stringify(questionsWithAnswers, null, 2)}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                overallFeedback: { type: Type.STRING },
                areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                questionsFeedback: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            feedback: { type: Type.STRING },
                            score: { type: Type.NUMBER, minimum: 0, maximum: 10 }
                        },
                        required: ['question', 'feedback', 'score']
                    }
                },
                score: { type: Type.NUMBER, minimum: 0, maximum: 100 }
            },
            required: ['overallFeedback', 'areasForImprovement', 'strengths', 'questionsFeedback', 'score']
        };

        return this.callGenerativeAI(prompt, schema);
    }

    /**
     * AI method: Draft Salary Negotiation Script
     * @param jobTitle The job title.
     * @param company The company name.
     * @param initialOffer The initial salary offer.
     * @param desiredSalary The user's desired salary.
     * @param userProfile The user's profile for leverage.
     * @returns A suggested negotiation script.
     */
    public async getSalaryNegotiationScript(
        jobTitle: string,
        company: string,
        initialOffer: number,
        desiredSalary: number,
        userProfile: UserProfile
    ): Promise<string> {
        const prompt = `You are a professional negotiation coach.
            Draft a confident and well-reasoned email/script for negotiating a salary offer.
            The user has received an offer for ${jobTitle} at ${company} for $${initialOffer},
            but desires a salary closer to $${desiredSalary}.
            Leverage the user's experience (${userProfile.yearsExperience} years as ${userProfile.currentRole}),
            their key skills (${userProfile.skills.slice(0, 3).join(', ')}),
            and any other relevant information from their profile to justify the higher request.
            Include points about market value, value proposition, and a positive, collaborative tone.
            Focus on requesting for the higher range, with a justification and readiness to discuss.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                negotiationScript: { type: Type.STRING }
            },
            required: ['negotiationScript']
        };
        const response = await this.callGenerativeAI<{ negotiationScript: string }>(prompt, schema);
        return response.negotiationScript;
    }

    /**
     * AI method: Optimize LinkedIn Profile Summary
     * @param userProfile The user's profile.
     * @param desiredRoles Desired job roles.
     * @returns An optimized LinkedIn summary string.
     */
    public async optimizeLinkedInProfile(userProfile: UserProfile, desiredRoles: string[]): Promise<string> {
        const prompt = `You are a personal branding expert.
            Craft an engaging and keyword-rich LinkedIn profile summary for the user.
            Highlight their current role, years of experience, key skills, and aspirations towards "${desiredRoles.join(' or ')}".
            The summary should be concise, professional, and attract recruiters.

            **User Profile:**\n${JSON.stringify(userProfile, null, 2)}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                linkedInSummary: { type: Type.STRING }
            },
            required: ['linkedInSummary']
        };
        const response = await this.callGenerativeAI<{ linkedInSummary: string }>(prompt, schema);
        return response.linkedInSummary;
    }

    /**
     * AI method: Generate Performance Review Preparation bullet points
     * @param userProfile The user's profile.
     * @param achievements A list of raw achievement descriptions.
     * @returns A list of bullet points formatted for performance reviews.
     */
    public async preparePerformanceReview(userProfile: UserProfile, achievements: string[]): Promise<string[]> {
        const prompt = `You are an executive coach assisting with performance review preparation.
            Transform the user's raw achievement descriptions into powerful, quantifiable bullet points
            suitable for a self-assessment or discussion during a performance review.
            Use the STAR method where appropriate (Situation, Task, Action, Result) and focus on impact.

            **User Role:** ${userProfile.currentRole}
            **Raw Achievements:**\n${achievements.map(a => `- ${a}`).join('\n')}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                reviewPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ['reviewPoints']
        };
        const response = await this.callGenerativeAI<{ reviewPoints: string[] }>(prompt, schema);
        return response.reviewPoints;
    }

    /**
     * AI method: Analyze Market Trends
     * @param industry The industry to analyze.
     * @param keywords Specific keywords to focus on.
     * @returns A list of relevant market trends.
     */
    public async getMarketTrends(industry: string, keywords: string[]): Promise<MarketTrend[]> {
        const prompt = `You are a market research analyst for career development.
            Provide 3-5 significant market trends relevant to the "${industry}" industry, focusing on "${keywords.join(', ')}".
            For each trend, include:
            - A concise title and description.
            - The 'impactOnCareer' for professionals in this field.
            - 'relevantSkills' that are becoming important due to this trend.
            - A 'source' (simulated, e.g., "Industry Report 2024", "TechCrunch").
            - The 'date' of the trend identification.

            Simulate realistic and actionable insights.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                trends: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            impactOnCareer: { type: Type.STRING },
                            relevantSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            source: { type: Type.STRING },
                            date: { type: Type.STRING, format: 'date-time' }
                        },
                        required: ['id', 'title', 'description', 'impactOnCareer', 'relevantSkills', 'source', 'date']
                    }
                }
            },
            required: ['trends']
        };
        const response = await this.callGenerativeAI<{ trends: MarketTrend[] }>(prompt, schema);
        response.trends.forEach(t => t.id = t.id || generateId());
        return response.trends;
    }

    // Add more AI methods as needed to reach desired complexity and line count...
}

export let careerAIClient: CareerAIClient | null = null;
try {
    // API_KEY is expected to be present in process.env at build/runtime.
    // In a "self-contained" scenario, one might hardcode it (BAD PRACTICE) or expect it from an env file accessible locally.
    // For this demonstration, we assume process.env.API_KEY is available as per original code.
    careerAIClient = new CareerAIClient(process.env.API_KEY as string);
} catch (e) {
    console.error("Failed to initialize CareerAIClient:", (e as Error).message);
    notificationService.addNotification({
        type: 'error',
        message: `AI Service Unavailable: ${(e as Error).message}. Please check your API key.`
    });
}


/**
 * =====================================================================================================================
 *  SECTION 3: INTERNAL API & ROUTING SIMULATION
 * =====================================================================================================================
 * These functions act as internal "API endpoints" or "routes" within this single-file application.
 * They handle business logic, interact with the data store, and trigger AI services.
 */

// 3.1 User Profile Management API
export const apiGetUserProfile = async (userId: string = 'default_user_id'): Promise<UserProfile | null> => {
    return dataStore.getItem<UserProfile>('UserProfile', userId);
};

export const apiUpdateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
    profile.lastUpdated = DateUtils.getNowISO();
    dataStore.setItem('UserProfile', profile);
    webhookProcessor.receiveEvent({ eventType: 'PROFILE_CHANGED', payload: profile });
    notificationService.addNotification({ type: 'success', message: 'User profile updated successfully!' });
    return profile;
};

export const apiInitializeUserProfile = async (userId: string = 'default_user_id'): Promise<UserProfile> => {
    let profile = await apiGetUserProfile(userId);
    if (!profile) {
        profile = {
            id: userId,
            name: "John Doe",
            email: "john.doe@example.com",
            currentRole: "Software Engineer",
            industry: "Technology",
            yearsExperience: 4,
            careerStage: CareerStage.MidLevel,
            skills: ["JavaScript", "React", "Node.js", "AWS", "Agile", "Problem Solving", "Communication"],
            education: ["B.Sc. Computer Science - University of XYZ"],
            certifications: ["AWS Certified Developer"],
            desiredRoles: ["Senior Software Engineer", "Tech Lead"],
            desiredIndustry: "Fintech",
            salaryExpectationMin: 120000,
            salaryExpectationMax: 160000,
            lastUpdated: DateUtils.getNowISO(),
        };
        dataStore.setItem('UserProfile', profile);
    }
    return profile;
};

// 3.2 Resume & Cover Letter API
export const apiGenerateResumeSuggestions = async (resume: string, jobDesc: string): Promise<AISuggestion[]> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!ValidationUtils.isNotNullOrEmpty(resume) || !ValidationUtils.isNotNullOrEmpty(jobDesc)) {
        throw new CustomError("Resume and Job Description cannot be empty.", "INPUT_VALIDATION_ERROR");
    }
    const suggestions = await careerAIClient.analyzeResumeForJob(resume, jobDesc);
    notificationService.addNotification({ type: 'success', message: `Generated ${suggestions.length} resume suggestions.` });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Resume Suggestions' } });
    return suggestions;
};

export const apiGenerateCoverLetter = async (
    userProfile: UserProfile,
    jobApplication: JobApplication,
    resumeSummary: string
): Promise<string> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!userProfile || !jobApplication || !ValidationUtils.isNotNullOrEmpty(resumeSummary)) {
        throw new CustomError("Missing profile, application, or resume summary for cover letter generation.", "INPUT_VALIDATION_ERROR");
    }
    const coverLetter = await careerAIClient.generateCoverLetter(userProfile, jobApplication, resumeSummary);
    notificationService.addNotification({ type: 'success', message: 'Cover letter generated successfully!' });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Cover Letter Generation' } });
    return coverLetter;
};

// 3.3 Skill & Career Pathing API
export const apiGetSkillGapAnalysis = async (userProfile: UserProfile, targetRoles: string[] | string): Promise<SkillAssessmentResult[]> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!userProfile || (Array.isArray(targetRoles) && targetRoles.length === 0) || (!Array.isArray(targetRoles) && !ValidationUtils.isNotNullOrEmpty(targetRoles))) {
        throw new CustomError("Missing user profile or target roles for skill gap analysis.", "INPUT_VALIDATION_ERROR");
    }
    const results = await careerAIClient.getSkillGapAnalysis(userProfile, targetRoles);
    notificationService.addNotification({ type: 'success', message: `Skill gap analysis completed. Found ${results.length} skills.` });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Skill Gap Analysis' } });
    return results;
};

export const apiGetCareerPathRecommendations = async (userProfile: UserProfile, currentGoals: CareerGoal[]): Promise<CareerPathRecommendation[]> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!userProfile) {
        throw new CustomError("Missing user profile for career path recommendations.", "INPUT_VALIDATION_ERROR");
    }
    const recommendations = await careerAIClient.getCareerPathRecommendations(userProfile, currentGoals);
    notificationService.addNotification({ type: 'success', message: `Generated ${recommendations.length} career path recommendations.` });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Career Path Recommendations' } });
    return recommendations;
};

// 3.4 Job Application Tracking API
export const apiAddJobApplication = async (app: Omit<JobApplication, 'id' | 'createdAt' | 'lastUpdated'>): Promise<JobApplication> => {
    const newApp: JobApplication = {
        ...app,
        id: generateId(),
        createdAt: DateUtils.getNowISO(),
        lastUpdated: DateUtils.getNowISO(),
        negotiationHistory: [],
    };
    dataStore.setItem('JobApplication', newApp);
    webhookProcessor.receiveEvent({ eventType: 'JOB_APPLIED', payload: { jobTitle: newApp.jobTitle, company: newApp.company } });
    notificationService.addNotification({ type: 'success', message: `Application for ${newApp.jobTitle} at ${newApp.company} added.` });
    return newApp;
};

export const apiUpdateJobApplication = async (app: JobApplication): Promise<JobApplication> => {
    app.lastUpdated = DateUtils.getNowISO();
    dataStore.setItem('JobApplication', app);
    if (app.status === 'Interviewing' && app.interviewDates.length > 0) {
        webhookProcessor.receiveEvent({ eventType: 'INTERVIEW_SCHEDULED', payload: { role: app.jobTitle, company: app.company, interviewDate: app.interviewDates[0] } });
    }
    notificationService.addNotification({ type: 'success', message: `Application for ${app.jobTitle} updated.` });
    return app;
};

export const apiGetAllJobApplications = async (): Promise<JobApplication[]> => {
    return dataStore.getAllItems<JobApplication>('JobApplication');
};

export const apiGetJobApplicationById = async (id: string): Promise<JobApplication | null> => {
    return dataStore.getItem<JobApplication>('JobApplication', id);
};

export const apiDeleteJobApplication = async (id: string): Promise<void> => {
    dataStore.removeItem('JobApplication', id);
    notificationService.addNotification({ type: 'info', message: 'Job application removed.' });
};


// 3.5 Career Goal Management API
export const apiAddCareerGoal = async (goal: Omit<CareerGoal, 'id' | 'createdAt' | 'lastUpdated' | 'progressNotes'>): Promise<CareerGoal> => {
    const newGoal: CareerGoal = {
        ...goal,
        id: generateId(),
        progressNotes: [],
        createdAt: DateUtils.getNowISO(),
        lastUpdated: DateUtils.getNowISO(),
    };
    dataStore.setItem('CareerGoal', newGoal);
    notificationService.addNotification({ type: 'success', message: `Career goal "${newGoal.title}" added.` });
    return newGoal;
};

export const apiUpdateCareerGoal = async (goal: CareerGoal): Promise<CareerGoal> => {
    goal.lastUpdated = DateUtils.getNowISO();
    dataStore.setItem('CareerGoal', goal);
    webhookProcessor.receiveEvent({ eventType: 'GOAL_UPDATED', payload: { title: goal.title, status: goal.status } });
    notificationService.addNotification({ type: 'success', message: `Career goal "${goal.title}" updated.` });
    return goal;
};

export const apiGetAllCareerGoals = async (): Promise<CareerGoal[]> => {
    return dataStore.getAllItems<CareerGoal>('CareerGoal');
};

export const apiDeleteCareerGoal = async (id: string): Promise<void> => {
    dataStore.removeItem('CareerGoal', id);
    notificationService.addNotification({ type: 'info', message: 'Career goal removed.' });
};

// 3.6 Interview Preparation API
export const apiStartInterviewSession = async (jobApplicationId: string, role: string, company: string, jobDescription: string, userProfile: UserProfile): Promise<InterviewSession> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!ValidationUtils.isNotNullOrEmpty(jobApplicationId) || !ValidationUtils.isNotNullOrEmpty(jobDescription) || !userProfile) {
        throw new CustomError("Missing details to start interview session.", "INPUT_VALIDATION_ERROR");
    }

    const initialQuestions = await careerAIClient.generateInterviewQuestions(jobDescription, userProfile);
    const session: InterviewSession = {
        id: generateId(),
        jobApplicationId,
        sessionDate: DateUtils.getNowISO(),
        role,
        company,
        questionsAsked: initialQuestions.map(q => ({ question: q.question, userAnswer: '', aiFeedback: '', score: 0 })),
        overallFeedback: 'No feedback yet.',
        areasForImprovement: [],
        strengths: [],
        score: 0,
        createdAt: DateUtils.getNowISO(),
        lastUpdated: DateUtils.getNowISO(),
    };
    dataStore.setItem('InterviewSession', session);
    notificationService.addNotification({ type: 'info', message: `Interview session for ${role} started. Good luck!` });
    return session;
};

export const apiSubmitInterviewAnswersAndGetFeedback = async (sessionId: string, questionsWithAnswers: { question: string; userAnswer: string; }[], jobDescription: string, userProfile: UserProfile): Promise<InterviewSession> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!ValidationUtils.isNotNullOrEmpty(sessionId) || questionsWithAnswers.length === 0 || !ValidationUtils.isNotNullOrEmpty(jobDescription) || !userProfile) {
        throw new CustomError("Missing session ID, answers, job description, or profile for feedback.", "INPUT_VALIDATION_ERROR");
    }

    const session = await dataStore.getItem<InterviewSession>('InterviewSession', sessionId);
    if (!session) throw new CustomError("Interview session not found.", "NOT_FOUND");

    const feedback = await careerAIClient.getInterviewFeedback(questionsWithAnswers, jobDescription, userProfile);

    session.questionsAsked = questionsWithAnswers.map(qa => {
        const qFeedback = feedback.questionsFeedback.find(f => f.question === qa.question);
        return {
            ...qa,
            aiFeedback: qFeedback?.feedback || 'No specific feedback provided.',
            score: qFeedback?.score || 0
        };
    });
    session.overallFeedback = feedback.overallFeedback;
    session.areasForImprovement = feedback.areasForImprovement;
    session.strengths = feedback.strengths;
    session.score = feedback.score;
    session.lastUpdated = DateUtils.getNowISO();

    dataStore.setItem('InterviewSession', session);
    notificationService.addNotification({ type: 'success', message: `Feedback for interview session "${session.role}" received.` });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Interview Feedback' } });
    return session;
};

export const apiGetAllInterviewSessions = async (): Promise<InterviewSession[]> => {
    return dataStore.getAllItems<InterviewSession>('InterviewSession');
};

// 3.7 Market Insights API
export const apiGetMarketTrends = async (industry: string, keywords: string[]): Promise<MarketTrend[]> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!ValidationUtils.isNotNullOrEmpty(industry)) {
        throw new CustomError("Industry cannot be empty for market trend analysis.", "INPUT_VALIDATION_ERROR");
    }
    const trends = await careerAIClient.getMarketTrends(industry, keywords);
    notificationService.addNotification({ type: 'info', message: `Fetched ${trends.length} market trends for ${industry}.` });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Market Trend Analysis' } });
    return trends;
};

// 3.8 Salary Negotiation API
export const apiGetSalaryNegotiationScript = async (
    jobTitle: string,
    company: string,
    initialOffer: number,
    desiredSalary: number,
    userProfile: UserProfile
): Promise<string> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!ValidationUtils.isNotNullOrEmpty(jobTitle) || !ValidationUtils.isNotNullOrEmpty(company) || !ValidationUtils.isPositiveNumber(initialOffer) || !ValidationUtils.isPositiveNumber(desiredSalary) || !userProfile) {
        throw new CustomError("Missing details for salary negotiation script generation.", "INPUT_VALIDATION_ERROR");
    }
    const script = await careerAIClient.getSalaryNegotiationScript(jobTitle, company, initialOffer, desiredSalary, userProfile);
    notificationService.addNotification({ type: 'success', message: 'Salary negotiation script generated.' });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Salary Negotiation Script' } });
    return script;
};

// 3.9 Personal Branding API
export const apiOptimizeLinkedInProfile = async (userProfile: UserProfile, desiredRoles: string[]): Promise<string> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!userProfile || desiredRoles.length === 0) {
        throw new CustomError("Missing user profile or desired roles for LinkedIn optimization.", "INPUT_VALIDATION_ERROR");
    }
    const summary = await careerAIClient.optimizeLinkedInProfile(userProfile, desiredRoles);
    notificationService.addNotification({ type: 'success', message: 'LinkedIn summary optimized.' });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'LinkedIn Profile Optimization' } });
    return summary;
};

// 3.10 Performance Review API
export const apiPreparePerformanceReview = async (userProfile: UserProfile, achievements: string[]): Promise<string[]> => {
    if (!careerAIClient) throw new CustomError("AI service not initialized.", "AI_SERVICE_UNAVAILABLE");
    if (!userProfile || achievements.length === 0) {
        throw new CustomError("Missing user profile or achievements for performance review preparation.", "INPUT_VALIDATION_ERROR");
    }
    const reviewPoints = await careerAIClient.preparePerformanceReview(userProfile, achievements);
    notificationService.addNotification({ type: 'success', message: 'Performance review points generated.' });
    webhookProcessor.receiveEvent({ eventType: 'AI_TASK_COMPLETED', payload: { taskName: 'Performance Review Prep' } });
    return reviewPoints;
};

/**
 * =====================================================================================================================
 *  SECTION 4: REACT COMPONENT - CAREER TRAJECTORY VIEW
 * =====================================================================================================================
 * This section contains the main React component, heavily expanded with UI elements and state management
 * to expose all the functionality defined in the preceding sections.
 */

export const CareerTrajectoryView: React.FC = () => {
    // -----------------------------------------------------------------------------------------------------------------
    //  4.1: Component-level State Management
    // -----------------------------------------------------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState<string>('resume'); // 'resume', 'profile', 'goals', 'applications', 'interview', 'skills', 'market', 'branding', 'review'

    // Core AI Analysis State
    const [resume, setResume] = useState<string>('');
    const [jobDesc, setJobDesc] = useState<string>('');
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // User Profile State
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileEditing, setIsProfileEditing] = useState<boolean>(false);

    // Job Applications State
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [showAddApplicationModal, setShowAddApplicationModal] = useState<boolean>(false);
    const [currentApplicationForm, setCurrentApplicationForm] = useState<Partial<JobApplication>>({});
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [coverLetterContent, setCoverLetterContent] = useState<string>('');
    const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<boolean>(false);
    const [isSavingApplication, setIsSavingApplication] = useState<boolean>(false);

    // Career Goals State
    const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
    const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
    const [currentGoalForm, setCurrentGoalForm] = useState<Partial<CareerGoal>>({});
    const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null);
    const [isSavingGoal, setIsSavingGoal] = useState<boolean>(false);

    // Skill Gap Analysis State
    const [skillGapTarget, setSkillGapTarget] = useState<string>('');
    const [skillGaps, setSkillGaps] = useState<SkillAssessmentResult[]>([]);
    const [isAnalyzingSkills, setIsAnalyzingSkills] = useState<boolean>(false);
    const debouncedSkillGapTarget = useDebounce(skillGapTarget, DEBOUNCE_DELAY_MS);

    // Career Path Recommendations State
    const [careerPaths, setCareerPaths] = useState<CareerPathRecommendation[]>([]);
    const [isGeneratingCareerPaths, setIsGeneratingCareerPaths] = useState<boolean>(false);

    // Interview Preparation State
    const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
    const [selectedInterviewSession, setSelectedInterviewSession] = useState<InterviewSession | null>(null);
    const [isStartingInterview, setIsStartingInterview] = useState<boolean>(false);
    const [isSubmittingAnswers, setIsSubmittingAnswers] = useState<boolean>(false);
    const [currentInterviewQuestions, setCurrentInterviewQuestions] = useState<{ question: string; userAnswer: string; }[]>([]);

    // Market Trends State
    const [marketTrendIndustry, setMarketTrendIndustry] = useState<string>(userProfile?.industry || 'Technology');
    const [marketTrendKeywords, setMarketTrendKeywords] = useState<string>('AI, Remote Work, Sustainability');
    const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
    const [isFetchingMarketTrends, setIsFetchingMarketTrends] = useState<boolean>(false);
    const debouncedMarketTrendIndustry = useDebounce(marketTrendIndustry, DEBOUNCE_DELAY_MS);
    const debouncedMarketTrendKeywords = useDebounce(marketTrendKeywords, DEBOUNCE_DELAY_MS);

    // Salary Negotiation State
    const [negotiationJobTitle, setNegotiationJobTitle] = useState<string>('');
    const [negotiationCompany, setNegotiationCompany] = useState<string>('');
    const [negotiationInitialOffer, setNegotiationInitialOffer] = useState<number>(0);
    const [negotiationDesiredSalary, setNegotiationDesiredSalary] = useState<number>(0);
    const [negotiationScript, setNegotiationScript] = useState<string>('');
    const [isGeneratingNegotiationScript, setIsGeneratingNegotiationScript] = useState<boolean>(false);

    // LinkedIn Optimization State
    const [linkedInSummary, setLinkedInSummary] = useState<string>('');
    const [isOptimizingLinkedIn, setIsOptimizingLinkedIn] = useState<boolean>(false);

    // Performance Review State
    const [performanceAchievements, setPerformanceAchievements] = useState<string>('');
    const [performanceReviewPoints, setPerformanceReviewPoints] = useState<string[]>([]);
    const [isPreparingReview, setIsPreparingReview] = useState<boolean>(false);

    // Global Notifications
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Refs for textareas to manage focus or content
    const resumeRef = useRef<HTMLTextAreaElement>(null);
    const jobDescRef = useRef<HTMLTextAreaElement>(null);


    // -----------------------------------------------------------------------------------------------------------------
    //  4.2: Lifecycle & Initial Data Loading
    // -----------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const profile = await apiInitializeUserProfile();
                setUserProfile(profile);
                setResume(profile.resume || `Experience:\nSoftware Engineer at Acme Corp (2020-2024)\n- Worked on a team to build software.\n- Fixed bugs and improved performance.`);
                setJobDesc(`Job: Senior Software Engineer at Innovate Inc.\nRequirements:\n- 5+ years of experience.\n- Expertise in agile development and CI/CD pipelines.\n- Proven ability to mentor junior engineers.`);
                setJobApplications(await apiGetAllJobApplications());
                setCareerGoals(await apiGetAllCareerGoals());
                setInterviewSessions(await apiGetAllInterviewSessions());
            } catch (err) {
                console.error("Failed to load initial data:", err);
                setError(`Failed to load initial data: ${(err as Error).message}`);
                notificationService.addNotification({ type: 'error', message: `Initial data load failed: ${(err as Error).message}` });
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();

        // Subscribe to notifications
        const unsubscribe = notificationService.subscribe((newNotifications) => {
            setNotifications([...newNotifications]); // Ensure state update with new array
        });

        return () => unsubscribe();
    }, []);

    // Effect to update user profile's resume whenever the local resume state changes
    useEffect(() => {
        if (userProfile && resume !== userProfile.resume) {
            // Update profile resume without immediate API call to avoid loops,
            // but mark it as needing save or prompt user to save.
            // For this exhaustive example, we simulate immediate persistence.
            const updatedProfile = { ...userProfile, resume };
            dataStore.setItem('UserProfile', updatedProfile);
            setUserProfile(updatedProfile);
        }
    }, [resume, userProfile]);


    // -----------------------------------------------------------------------------------------------------------------
    //  4.3: Event Handlers & Core Logic
    // -----------------------------------------------------------------------------------------------------------------

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setSuggestions([]);
        setError(null);
        try {
            if (!ValidationUtils.isNotNullOrEmpty(resume) || !ValidationUtils.isNotNullOrEmpty(jobDesc)) {
                throw new CustomError("Resume and Job Description cannot be empty for analysis.", "INPUT_VALIDATION_ERROR");
            }
            const aiSuggestions = await apiGenerateResumeSuggestions(resume, jobDesc);
            setSuggestions(aiSuggestions);
            notificationService.addNotification({ type: 'success', message: 'Resume suggestions generated successfully!' });
        } catch (err) {
            console.error("Resume analysis failed:", err);
            setError(`Resume analysis failed: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Resume analysis failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsLoading(false);
        }
    }, [resume, jobDesc]);

    const handleProfileUpdate = useCallback(async () => {
        if (!userProfile) return;
        setIsSavingApplication(true); // Reusing for profile save
        setError(null);
        try {
            const updatedProfile = await apiUpdateUserProfile(userProfile);
            setUserProfile(updatedProfile);
            setIsProfileEditing(false);
            notificationService.addNotification({ type: 'success', message: 'Profile updated.' });
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(`Failed to update profile: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Profile update failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsSavingApplication(false);
        }
    }, [userProfile]);

    const handleAddOrUpdateApplication = useCallback(async () => {
        if (!currentApplicationForm.jobTitle || !currentApplicationForm.company || !currentApplicationForm.applicationDate) {
            setError("Job Title, Company, and Application Date are required.");
            return;
        }

        setIsSavingApplication(true);
        setError(null);
        try {
            let updatedApp: JobApplication;
            if (currentApplicationForm.id) {
                updatedApp = await apiUpdateJobApplication(currentApplicationForm as JobApplication);
            } else {
                updatedApp = await apiAddJobApplication(currentApplicationForm as Omit<JobApplication, 'id' | 'createdAt' | 'lastUpdated'>);
            }
            setJobApplications(prev => {
                const existingIndex = prev.findIndex(app => app.id === updatedApp.id);
                if (existingIndex > -1) {
                    const newApps = [...prev];
                    newApps[existingIndex] = updatedApp;
                    return newApps;
                }
                return [...prev, updatedApp];
            });
            setShowAddApplicationModal(false);
            setCurrentApplicationForm({});
            notificationService.addNotification({ type: 'success', message: `Application ${updatedApp.id ? 'updated' : 'added'}!` });
        } catch (err) {
            console.error("Failed to save application:", err);
            setError(`Failed to save application: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Application save failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsSavingApplication(false);
        }
    }, [currentApplicationForm]);

    const handleGenerateCoverLetter = useCallback(async (app: JobApplication) => {
        if (!userProfile) {
            setError("User profile is required to generate a cover letter.");
            return;
        }
        setIsGeneratingCoverLetter(true);
        setCoverLetterContent('');
        setError(null);
        try {
            // Use current resume or a summary from userProfile.resume
            const resumeSummary = TextUtils.truncate(resume, 500); // Or use an AI call to summarize resume
            const generatedLetter = await apiGenerateCoverLetter(userProfile, app, resumeSummary);
            setCoverLetterContent(generatedLetter);
            // Optionally, update the application with the generated cover letter
            const updatedApp = { ...app, coverLetterUsed: generatedLetter, lastUpdated: DateUtils.getNowISO() };
            await apiUpdateJobApplication(updatedApp);
            setJobApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
            notificationService.addNotification({ type: 'success', message: 'Cover letter generated and saved to application.' });
        } catch (err) {
            console.error("Failed to generate cover letter:", err);
            setError(`Failed to generate cover letter: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Cover letter generation failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsGeneratingCoverLetter(false);
        }
    }, [userProfile, resume]);

    const handleAddOrUpdateGoal = useCallback(async () => {
        if (!currentGoalForm.title || !currentGoalForm.targetDate) {
            setError("Goal Title and Target Date are required.");
            return;
        }

        setIsSavingGoal(true);
        setError(null);
        try {
            let updatedGoal: CareerGoal;
            if (currentGoalForm.id) {
                updatedGoal = await apiUpdateCareerGoal(currentGoalForm as CareerGoal);
            } else {
                updatedGoal = await apiAddCareerGoal(currentGoalForm as Omit<CareerGoal, 'id' | 'createdAt' | 'lastUpdated' | 'progressNotes'>);
            }
            setCareerGoals(prev => {
                const existingIndex = prev.findIndex(goal => goal.id === updatedGoal.id);
                if (existingIndex > -1) {
                    const newGoals = [...prev];
                    newGoals[existingIndex] = updatedGoal;
                    return newGoals;
                }
                return [...prev, updatedGoal];
            });
            setShowAddGoalModal(false);
            setCurrentGoalForm({});
            notificationService.addNotification({ type: 'success', message: `Goal ${updatedGoal.id ? 'updated' : 'added'}!` });
        } catch (err) {
            console.error("Failed to save goal:", err);
            setError(`Failed to save goal: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Goal save failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsSavingGoal(false);
        }
    }, [currentGoalForm]);

    const handleDeleteGoal = useCallback(async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) return;
        setError(null);
        try {
            await apiDeleteCareerGoal(id);
            setCareerGoals(prev => prev.filter(goal => goal.id !== id));
            notificationService.addNotification({ type: 'info', message: 'Goal deleted.' });
        } catch (err) {
            console.error("Failed to delete goal:", err);
            setError(`Failed to delete goal: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Goal deletion failed: ${(err as CustomError).message || (err as Error).message}` });
        }
    }, []);

    const handleAnalyzeSkills = useCallback(async () => {
        if (!userProfile) {
            setError("User profile is required for skill gap analysis.");
            return;
        }
        if (!ValidationUtils.isNotNullOrEmpty(skillGapTarget)) {
            setError("Please provide target roles or a job description for skill analysis.");
            return;
        }
        setIsAnalyzingSkills(true);
        setSkillGaps([]);
        setError(null);
        try {
            const results = await apiGetSkillGapAnalysis(userProfile, skillGapTarget);
            setSkillGaps(results);
            notificationService.addNotification({ type: 'success', message: 'Skill gap analysis completed!' });
        } catch (err) {
            console.error("Skill analysis failed:", err);
            setError(`Skill analysis failed: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Skill analysis failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsAnalyzingSkills(false);
        }
    }, [userProfile, skillGapTarget]);

    const handleGenerateCareerPaths = useCallback(async () => {
        if (!userProfile) {
            setError("User profile is required for career path recommendations.");
            return;
        }
        setIsGeneratingCareerPaths(true);
        setCareerPaths([]);
        setError(null);
        try {
            const paths = await apiGetCareerPathRecommendations(userProfile, careerGoals);
            setCareerPaths(paths);
            notificationService.addNotification({ type: 'success', message: 'Career path recommendations generated!' });
        } catch (err) {
            console.error("Career path generation failed:", err);
            setError(`Career path generation failed: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Career path generation failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsGeneratingCareerPaths(false);
        }
    }, [userProfile, careerGoals]);

    const handleStartInterview = useCallback(async (app: JobApplication) => {
        if (!userProfile) {
            setError("User profile is required to start an interview session.");
            return;
        }
        setIsStartingInterview(true);
        setSelectedInterviewSession(null);
        setError(null);
        try {
            const session = await apiStartInterviewSession(app.id, app.jobTitle, app.company, app.jobDescription, userProfile);
            setInterviewSessions(prev => [...prev, session]);
            setSelectedInterviewSession(session);
            setCurrentInterviewQuestions(session.questionsAsked.map(q => ({ question: q.question, userAnswer: '' })));
            setActiveTab('interview'); // Switch to interview tab
            notificationService.addNotification({ type: 'info', message: `Interview session for ${app.jobTitle} started.` });
        } catch (err) {
            console.error("Failed to start interview session:", err);
            setError(`Failed to start interview session: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Interview session start failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsStartingInterview(false);
        }
    }, [userProfile]);

    const handleSubmitInterviewAnswers = useCallback(async () => {
        if (!selectedInterviewSession || !userProfile) {
            setError("No active interview session or user profile found.");
            return;
        }
        if (currentInterviewQuestions.some(q => !ValidationUtils.isNotNullOrEmpty(q.userAnswer))) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setIsSubmittingAnswers(true);
        setError(null);
        try {
            const updatedSession = await apiSubmitInterviewAnswersAndGetFeedback(
                selectedInterviewSession.id,
                currentInterviewQuestions,
                jobApplications.find(app => app.id === selectedInterviewSession.jobApplicationId)?.jobDescription || '',
                userProfile
            );
            setInterviewSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
            setSelectedInterviewSession(updatedSession);
            notificationService.addNotification({ type: 'success', message: 'Interview answers submitted and feedback generated!' });
        } catch (err) {
            console.error("Failed to submit interview answers:", err);
            setError(`Failed to submit interview answers: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Interview answer submission failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsSubmittingAnswers(false);
        }
    }, [selectedInterviewSession, userProfile, currentInterviewQuestions, jobApplications]);

    const handleFetchMarketTrends = useCallback(async () => {
        if (!userProfile) {
            setError("User profile is required for market trend analysis.");
            return;
        }
        if (!ValidationUtils.isNotNullOrEmpty(debouncedMarketTrendIndustry)) {
            setError("Please specify an industry for market trends.");
            return;
        }
        setIsFetchingMarketTrends(true);
        setMarketTrends([]);
        setError(null);
        try {
            const keywordsArray = debouncedMarketTrendKeywords.split(',').map(k => k.trim()).filter(Boolean);
            const trends = await apiGetMarketTrends(debouncedMarketTrendIndustry, keywordsArray);
            setMarketTrends(trends);
            notificationService.addNotification({ type: 'success', message: 'Market trends fetched successfully!' });
        } catch (err) {
            console.error("Failed to fetch market trends:", err);
            setError(`Failed to fetch market trends: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Market trend fetch failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsFetchingMarketTrends(false);
        }
    }, [userProfile, debouncedMarketTrendIndustry, debouncedMarketTrendKeywords]);

    const handleGenerateNegotiationScript = useCallback(async () => {
        if (!userProfile || !negotiationJobTitle || !negotiationCompany || !negotiationInitialOffer || !negotiationDesiredSalary) {
            setError("Please fill all negotiation details.");
            return;
        }
        if (negotiationDesiredSalary <= negotiationInitialOffer) {
            setError("Desired salary must be higher than the initial offer.");
            return;
        }

        setIsGeneratingNegotiationScript(true);
        setNegotiationScript('');
        setError(null);
        try {
            const script = await apiGetSalaryNegotiationScript(
                negotiationJobTitle,
                negotiationCompany,
                negotiationInitialOffer,
                negotiationDesiredSalary,
                userProfile
            );
            setNegotiationScript(script);
            notificationService.addNotification({ type: 'success', message: 'Salary negotiation script generated.' });
        } catch (err) {
            console.error("Failed to generate negotiation script:", err);
            setError(`Failed to generate negotiation script: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Negotiation script generation failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsGeneratingNegotiationScript(false);
        }
    }, [userProfile, negotiationJobTitle, negotiationCompany, negotiationInitialOffer, negotiationDesiredSalary]);

    const handleOptimizeLinkedIn = useCallback(async () => {
        if (!userProfile || userProfile.desiredRoles.length === 0) {
            setError("User profile and desired roles are required for LinkedIn optimization.");
            return;
        }

        setIsOptimizingLinkedIn(true);
        setLinkedInSummary('');
        setError(null);
        try {
            const summary = await apiOptimizeLinkedInProfile(userProfile, userProfile.desiredRoles);
            setLinkedInSummary(summary);
            notificationService.addNotification({ type: 'success', message: 'LinkedIn summary optimized!' });
        } catch (err) {
            console.error("Failed to optimize LinkedIn profile:", err);
            setError(`Failed to optimize LinkedIn profile: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `LinkedIn optimization failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsOptimizingLinkedIn(false);
        }
    }, [userProfile]);

    const handlePreparePerformanceReview = useCallback(async () => {
        if (!userProfile || !ValidationUtils.isNotNullOrEmpty(performanceAchievements)) {
            setError("User profile and achievements are required for performance review preparation.");
            return;
        }
        const achievementsArray = performanceAchievements.split('\n').map(a => a.trim()).filter(Boolean);
        if (achievementsArray.length === 0) {
            setError("Please enter at least one achievement.");
            return;
        }

        setIsPreparingReview(true);
        setPerformanceReviewPoints([]);
        setError(null);
        try {
            const reviewPoints = await apiPreparePerformanceReview(userProfile, achievementsArray);
            setPerformanceReviewPoints(reviewPoints);
            notificationService.addNotification({ type: 'success', message: 'Performance review points generated!' });
        } catch (err) {
            console.error("Failed to prepare performance review:", err);
            setError(`Failed to prepare performance review: ${(err as CustomError).message || (err as Error).message}`);
            notificationService.addNotification({ type: 'error', message: `Performance review prep failed: ${(err as CustomError).message || (err as Error).message}` });
        } finally {
            setIsPreparingReview(false);
        }
    }, [userProfile, performanceAchievements]);


    // -----------------------------------------------------------------------------------------------------------------
    //  4.4: Memoized Components & UI Helpers
    // -----------------------------------------------------------------------------------------------------------------

    const NotificationTray: React.FC = useMemo(() => {
        return () => (
            <div className="fixed top-4 right-4 z-50 space-y-2 max-h-screen-75 overflow-y-auto">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`p-3 rounded-lg shadow-lg flex justify-between items-center text-sm ${
                            n.type === 'success' ? 'bg-green-600' :
                            n.type === 'info' ? 'bg-blue-600' :
                            n.type === 'warning' ? 'bg-yellow-600' :
                            'bg-red-600'
                        } text-white transition-opacity duration-300 ${n.read ? 'opacity-50' : ''}`}
                        role="alert"
                    >
                        <p>{n.message} <span className="text-gray-200 text-xs ml-2">({DateUtils.timeSince(n.timestamp)})</span></p>
                        <button onClick={() => notificationService.markAsRead(n.id)} className="ml-4 text-white hover:text-gray-200 focus:outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        );
    }, [notifications]);

    const Navbar: React.FC = useMemo(() => {
        const tabs = [
            { id: 'resume', name: 'Resume & JD' },
            { id: 'profile', name: 'Profile' },
            { id: 'goals', name: 'Goals' },
            { id: 'applications', name: 'Applications' },
            { id: 'interview', name: 'Interview Prep' },
            { id: 'skills', name: 'Skills Gap' },
            { id: 'market', name: 'Market Trends' },
            { id: 'branding', name: 'Personal Branding' },
            { id: 'review', name: 'Performance Review' },
            { id: 'negotiation', name: 'Salary Negotiation' },
        ];
        return () => (
            <nav className="mb-8 p-4 bg-gray-900 rounded-lg shadow-lg flex flex-wrap gap-2 justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-cyan-700 text-white shadow-md'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
        );
    }, [activeTab]);

    const renderUserProfileSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Professional Profile</h2>
            <Card title="Edit Profile">
                <div className="space-y-4">
                    {userProfile ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-gray-400">Name</span>
                                    <input type="text" value={userProfile.name} onChange={e => setUserProfile({ ...userProfile, name: e.target.value })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Email</span>
                                    <input type="email" value={userProfile.email} onChange={e => setUserProfile({ ...userProfile, email: e.target.value })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Current Role</span>
                                    <input type="text" value={userProfile.currentRole} onChange={e => setUserProfile({ ...userProfile, currentRole: e.target.value })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Industry</span>
                                    <input type="text" value={userProfile.industry} onChange={e => setUserProfile({ ...userProfile, industry: e.target.value })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Years Experience</span>
                                    <input type="number" value={userProfile.yearsExperience} onChange={e => setUserProfile({ ...userProfile, yearsExperience: parseInt(e.target.value) })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Career Stage</span>
                                    <select value={userProfile.careerStage} onChange={e => setUserProfile({ ...userProfile, careerStage: e.target.value as CareerStage })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75">
                                        {Object.values(CareerStage).map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                    </select>
                                </label>
                            </div>
                            <label className="block">
                                <span className="text-gray-400">Skills (comma-separated)</span>
                                <textarea value={userProfile.skills.join(', ')} onChange={e => setUserProfile({ ...userProfile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} disabled={!isProfileEditing} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Education</span>
                                <textarea value={userProfile.education.join('\n')} onChange={e => setUserProfile({ ...userProfile, education: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} disabled={!isProfileEditing} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Certifications</span>
                                <textarea value={userProfile.certifications.join('\n')} onChange={e => setUserProfile({ ...userProfile, certifications: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} disabled={!isProfileEditing} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Desired Roles (comma-separated)</span>
                                <textarea value={userProfile.desiredRoles.join(', ')} onChange={e => setUserProfile({ ...userProfile, desiredRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} disabled={!isProfileEditing} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Desired Industry</span>
                                <input type="text" value={userProfile.desiredIndustry} onChange={e => setUserProfile({ ...userProfile, desiredIndustry: e.target.value })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-gray-400">Salary Expectation Min</span>
                                    <input type="number" value={userProfile.salaryExpectationMin} onChange={e => setUserProfile({ ...userProfile, salaryExpectationMin: parseInt(e.target.value) })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                                <label className="block">
                                    <span className="text-gray-400">Salary Expectation Max</span>
                                    <input type="number" value={userProfile.salaryExpectationMax} onChange={e => setUserProfile({ ...userProfile, salaryExpectationMax: parseInt(e.target.value) })} disabled={!isProfileEditing} className="w-full bg-gray-900/50 p-2 rounded text-sm disabled:opacity-75" />
                                </label>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                {isProfileEditing ? (
                                    <>
                                        <button onClick={() => { setIsProfileEditing(false); /* Revert changes? */ }} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Cancel</button>
                                        <button onClick={handleProfileUpdate} disabled={isSavingApplication} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white disabled:opacity-50">
                                            {isSavingApplication ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsProfileEditing(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white">Edit Profile</button>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400">Loading profile...</p>
                    )}
                </div>
            </Card>
        </div>
    );

    const renderCareerGoalsSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Career Goals</h2>
            <div className="text-right">
                <button onClick={() => { setCurrentGoalForm({}); setShowAddGoalModal(true); }} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white">Add New Goal</button>
            </div>
            {careerGoals.length === 0 && !isLoading && <p className="text-gray-400">No career goals set yet. Add one to get started!</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerGoals.map(goal => (
                    <Card key={goal.id} title={goal.title}>
                        <p className="text-sm text-gray-300 mb-2">{goal.description}</p>
                        <p className="text-xs text-gray-400">Target Date: {DateUtils.formatDate(goal.targetDate)}</p>
                        <p className="text-xs text-gray-400">Status: <span className={`font-semibold ${goal.status === 'Completed' ? 'text-green-400' : goal.status === 'InProgress' ? 'text-blue-400' : 'text-yellow-400'}`}>{goal.status}</span></p>
                        <p className="text-xs text-gray-400">Priority: <span className={`${goal.priority === 'Critical' ? 'text-red-400' : goal.priority === 'High' ? 'text-orange-400' : 'text-gray-400'}`}>{goal.priority}</span></p>
                        <p className="text-xs text-gray-400 mt-1">Skills: {goal.relatedSkills.join(', ')}</p>
                        <div className="mt-4 flex space-x-2 justify-end">
                            <button onClick={() => { setCurrentGoalForm(goal); setShowAddGoalModal(true); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">Edit</button>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Delete</button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add/Edit Goal Modal */}
            {showAddGoalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <Card title={currentGoalForm.id ? "Edit Career Goal" : "Add New Career Goal"} className="max-w-xl w-full">
                        <div className="space-y-4 text-white">
                            <label className="block">
                                <span className="text-gray-400">Title</span>
                                <input type="text" value={currentGoalForm.title || ''} onChange={e => setCurrentGoalForm({ ...currentGoalForm, title: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Description</span>
                                <textarea value={currentGoalForm.description || ''} onChange={e => setCurrentGoalForm({ ...currentGoalForm, description: e.target.value })} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Target Date</span>
                                <input type="date" value={currentGoalForm.targetDate ? currentGoalForm.targetDate.substring(0, 10) : ''} onChange={e => setCurrentGoalForm({ ...currentGoalForm, targetDate: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Status</span>
                                <select value={currentGoalForm.status || 'Pending'} onChange={e => setCurrentGoalForm({ ...currentGoalForm, status: e.target.value as 'Pending' | 'InProgress' | 'Completed' | 'Deferred' })} className="w-full bg-gray-900/50 p-2 rounded text-sm">
                                    <option value="Pending">Pending</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Deferred">Deferred</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Priority</span>
                                <select value={currentGoalForm.priority || 'Medium'} onChange={e => setCurrentGoalForm({ ...currentGoalForm, priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical' })} className="w-full bg-gray-900/50 p-2 rounded text-sm">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Related Skills (comma-separated)</span>
                                <input type="text" value={currentGoalForm.relatedSkills?.join(', ') || ''} onChange={e => setCurrentGoalForm({ ...currentGoalForm, relatedSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setShowAddGoalModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Cancel</button>
                                <button onClick={handleAddOrUpdateGoal} disabled={isSavingGoal} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white disabled:opacity-50">
                                    {isSavingGoal ? 'Saving...' : (currentGoalForm.id ? 'Update Goal' : 'Add Goal')}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );

    const renderJobApplicationsSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Job Applications</h2>
            <div className="text-right">
                <button onClick={() => { setCurrentApplicationForm({applicationDate: DateUtils.getNowISO().substring(0,10)}); setShowAddApplicationModal(true); }} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white">Add New Application</button>
            </div>
            {jobApplications.length === 0 && !isLoading && <p className="text-gray-400">No applications tracked yet. Add one!</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobApplications.map(app => (
                    <Card key={app.id} title={`${app.jobTitle} at ${app.company}`}>
                        <p className="text-sm text-gray-300 mb-2">Applied: {DateUtils.formatDate(app.applicationDate)}</p>
                        <p className="text-sm text-gray-300">Status: <span className={`font-semibold ${app.status === 'Offer Received' ? 'text-green-400' : app.status === 'Interviewing' ? 'text-blue-400' : app.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{app.status}</span></p>
                        <p className="text-xs text-gray-400 mt-1">{TextUtils.truncate(app.notes, 100)}</p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
                            <button onClick={() => { setSelectedApplication(app); setCoverLetterContent(app.coverLetterUsed || ''); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">Details</button>
                            <button onClick={() => handleGenerateCoverLetter(app)} disabled={isGeneratingCoverLetter} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded disabled:opacity-50">{isGeneratingCoverLetter ? 'Generating...' : 'Gen Cover Letter'}</button>
                            {app.status === 'Applied' && (
                                <button onClick={() => handleStartInterview(app)} disabled={isStartingInterview} className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded disabled:opacity-50">{isStartingInterview ? 'Starting...' : 'Start Interview Prep'}</button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add/Edit Application Modal */}
            {showAddApplicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <Card title={currentApplicationForm.id ? "Edit Job Application" : "Add New Job Application"} className="max-w-xl w-full">
                        <div className="space-y-4 text-white">
                            <label className="block">
                                <span className="text-gray-400">Job Title</span>
                                <input type="text" value={currentApplicationForm.jobTitle || ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, jobTitle: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Company</span>
                                <input type="text" value={currentApplicationForm.company || ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, company: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Application Date</span>
                                <input type="date" value={currentApplicationForm.applicationDate ? currentApplicationForm.applicationDate.substring(0, 10) : ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, applicationDate: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Status</span>
                                <select value={currentApplicationForm.status || 'Applied'} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, status: e.target.value as JobApplication['status'] })} className="w-full bg-gray-900/50 p-2 rounded text-sm">
                                    <option value="Applied">Applied</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Offer Received">Offer Received</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Job Posting Link</span>
                                <input type="url" value={currentApplicationForm.link || ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, link: e.target.value })} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Job Description (full text)</span>
                                <textarea value={currentApplicationForm.jobDescription || ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, jobDescription: e.target.value })} className="w-full h-32 bg-gray-900/50 p-2 rounded text-sm" />
                            </label>
                            <label className="block">
                                <span className="text-gray-400">Notes</span>
                                <textarea value={currentApplicationForm.notes || ''} onChange={e => setCurrentApplicationForm({ ...currentApplicationForm, notes: e.target.value })} className="w-full h-24 bg-gray-900/50 p-2 rounded text-sm" />
                            </label>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => {setShowAddApplicationModal(false); setSelectedApplication(null); setCoverLetterContent('');}} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Cancel</button>
                                <button onClick={handleAddOrUpdateApplication} disabled={isSavingApplication} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white disabled:opacity-50">
                                    {isSavingApplication ? 'Saving...' : (currentApplicationForm.id ? 'Update Application' : 'Add Application')}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Application Details & Cover Letter Viewer */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <Card title={`${selectedApplication.jobTitle} - Details`} className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="space-y-4 text-white">
                            <p><strong>Company:</strong> {selectedApplication.company}</p>
                            <p><strong>Status:</strong> {selectedApplication.status}</p>
                            <p><strong>Application Date:</strong> {DateUtils.formatDate(selectedApplication.applicationDate)}</p>
                            {selectedApplication.link && <p><strong>Job Link:</strong> <a href={selectedApplication.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{selectedApplication.link}</a></p>}
                            <p><strong>Notes:</strong> {selectedApplication.notes}</p>
                            <div className="bg-gray-800 p-3 rounded-md">
                                <h4 className="font-semibold text-gray-300">Job Description:</h4>
                                <pre className="text-sm text-gray-200 whitespace-pre-wrap">{selectedApplication.jobDescription}</pre>
                            </div>

                            <h3 className="text-xl font-bold mt-6">Generated Cover Letter</h3>
                            {isGeneratingCoverLetter ? (
                                <p className="text-gray-400">Generating cover letter...</p>
                            ) : (
                                <div className="bg-gray-800 p-3 rounded-md">
                                    {coverLetterContent ? (
                                        <pre className="text-sm text-gray-200 whitespace-pre-wrap">{coverLetterContent}</pre>
                                    ) : (
                                        <p className="text-gray-400">No cover letter generated yet. Click "Gen Cover Letter" to create one.</p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => { setSelectedApplication(null); setCoverLetterContent(''); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Close</button>
                                <button onClick={() => { setCurrentApplicationForm(selectedApplication); setShowAddApplicationModal(true); setSelectedApplication(null); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">Edit Application</button>
                                <button onClick={() => { if (window.confirm('Are you sure you want to delete this application?')) { apiDeleteJobApplication(selectedApplication.id); setJobApplications(prev => prev.filter(app => app.id !== selectedApplication.id)); setSelectedApplication(null); setCoverLetterContent(''); } }} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">Delete</button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );

    const renderSkillGapSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Skill Gap Analysis & Learning Paths</h2>
            <Card title="Analyze Skills">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-400">Target Roles or Job Description (e.g., "Senior React Developer", "Manager")</span>
                        <textarea
                            value={skillGapTarget}
                            onChange={e => setSkillGapTarget(e.target.value)}
                            className="w-full h-32 bg-gray-900/50 p-2 rounded text-sm"
                            placeholder="Enter target roles or paste a job description here..."
                        />
                    </label>
                    <div className="text-center">
                        <button
                            onClick={handleAnalyzeSkills}
                            disabled={isAnalyzingSkills || !userProfile || !ValidationUtils.isNotNullOrEmpty(skillGapTarget)}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white disabled:opacity-50"
                        >
                            {isAnalyzingSkills ? 'Analyzing...' : 'Perform Skill Gap Analysis'}
                        </button>
                    </div>
                </div>
            </Card>

            {isAnalyzingSkills && <p className="text-gray-400">Analyzing skills...</p>}
            {skillGaps.length > 0 && (
                <Card title="Skill Gap Results">
                    <div className="space-y-4">
                        {skillGaps.map((skill, i) => (
                            <div key={i} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white">{skill.skill} <span className="text-xs text-gray-400 ml-2">({skill.category})</span></h3>
                                <p className="text-sm text-gray-300 mt-1">Current Level: {skill.currentLevel}/5 | Target Level: {skill.targetLevel}/5 | Gap: <span className={`${skill.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>{skill.gap}</span></p>
                                {skill.gap > 0 && (
                                    <div className="mt-3">
                                        <p className="text-md font-medium text-blue-300">Recommendations to bridge gap:</p>
                                        <ul className="list-disc list-inside space-y-1 mt-1">
                                            {skill.recommendations.map((rec, idx) => (
                                                <li key={rec.id || idx} className="text-sm text-gray-300">
                                                    <a href={rec.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                        {rec.title} ({rec.type})
                                                    </a> - {rec.provider} ({rec.cost}, {rec.estimatedTime})
                                                    <p className="text-xs text-gray-500 ml-4">{rec.description}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <h3 className="text-xl font-bold text-white mt-8">Career Path Recommendations</h3>
            <Card title="Generate Career Paths">
                <p className="text-gray-400 mb-4">Leverage your profile and goals to get AI-powered career path suggestions.</p>
                <div className="text-center">
                    <button
                        onClick={handleGenerateCareerPaths}
                        disabled={isGeneratingCareerPaths || !userProfile || careerGoals.length === 0}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white disabled:opacity-50"
                    >
                        {isGeneratingCareerPaths ? 'Generating...' : 'Generate Career Paths'}
                    </button>
                    {!userProfile && <p className="text-red-400 mt-2">Please complete your profile first.</p>}
                    {userProfile && careerGoals.length === 0 && <p className="text-yellow-400 mt-2">Add some career goals for better recommendations!</p>}
                </div>
            </Card>

            {isGeneratingCareerPaths && <p className="text-gray-400">Generating career paths...</p>}
            {careerPaths.length > 0 && (
                <Card title="Recommended Career Paths">
                    <div className="space-y-6">
                        {careerPaths.map((path, i) => (
                            <div key={path.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="text-xl font-semibold text-green-400">{path.role} <span className="text-sm text-gray-400">({path.industry})</span></h3>
                                <p className="text-sm text-gray-300 mt-2">{path.description}</p>
                                <p className="text-sm text-gray-300">Salary Range: {path.averageSalaryRange}</p>
                                <p className="text-sm text-gray-300">Growth Outlook: <span className={`${path.growthOutlook === 'Very High' ? 'text-green-500' : path.growthOutlook === 'High' ? 'text-yellow-500' : 'text-gray-400'}`}>{path.growthOutlook}</span></p>

                                <div className="mt-4">
                                    <p className="font-semibold text-white">Required Skills:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-300 ml-2">
                                        {path.requiredSkills.map((s, idx) => (
                                            <li key={idx}>{s.skill} ({s.category}, Level {s.level}/5)</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <p className="font-semibold text-white">Pathways to achieve:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-300 ml-2">
                                        {path.pathways.map((p, idx) => (
                                            <li key={idx}><a href={p.resource} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{p.title}</a> ({p.type})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );

    const renderInterviewPrepSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Interview Preparation</h2>
            <Card title="Your Interview Sessions">
                <div className="space-y-4">
                    {interviewSessions.length === 0 && <p className="text-gray-400">No interview sessions recorded. Start one from your applications!</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interviewSessions.map(session => (
                            <div key={session.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white">{session.role} at {session.company}</h3>
                                <p className="text-sm text-gray-400">Date: {DateUtils.formatDate(session.sessionDate)}</p>
                                <p className="text-sm text-gray-400">Overall Score: <span className={`${session.score > 70 ? 'text-green-400' : session.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{session.score}/100</span></p>
                                <div className="flex justify-end mt-2">
                                    <button onClick={() => { setSelectedInterviewSession(session); setCurrentInterviewQuestions(session.questionsAsked.map(q => ({ question: q.question, userAnswer: q.userAnswer }))); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">View Feedback</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {selectedInterviewSession && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <Card title={`Interview for ${selectedInterviewSession.role} at ${selectedInterviewSession.company}`} className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="space-y-6 text-white">
                            <h3 className="text-xl font-bold">Overall Feedback: <span className={`${selectedInterviewSession.score > 70 ? 'text-green-400' : selectedInterviewSession.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{selectedInterviewSession.score}/100</span></h3>
                            <p className="text-gray-300">{selectedInterviewSession.overallFeedback}</p>

                            {selectedInterviewSession.strengths.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-green-400">Strengths:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-300">
                                        {selectedInterviewSession.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                            {selectedInterviewSession.areasForImprovement.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-red-400">Areas for Improvement:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-300">
                                        {selectedInterviewSession.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                                    </ul>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mt-6">Question-by-Question Analysis:</h3>
                            <div className="space-y-4">
                                {selectedInterviewSession.questionsAsked.map((qa, i) => (
                                    <div key={i} className="p-3 bg-gray-800 rounded-lg">
                                        <p className="font-semibold text-cyan-400">Q: {qa.question}</p>
                                        <p className="text-sm text-gray-400 mt-1">Your Answer:</p>
                                        <pre className="text-sm text-gray-200 whitespace-pre-wrap">{qa.userAnswer}</pre>
                                        <p className="text-sm text-gray-400 mt-2">AI Feedback (Score: {qa.score}/10):</p>
                                        <pre className="text-sm text-gray-200 whitespace-pre-wrap">{qa.aiFeedback}</pre>
                                    </div>
                                ))}
                            </div>

                            {selectedInterviewSession.score === 0 && ( // Allow re-submission if no feedback received yet
                                <>
                                    <h3 className="text-xl font-bold mt-6">Continue Interview Simulation:</h3>
                                    <div className="space-y-4">
                                        {currentInterviewQuestions.map((q, i) => (
                                            <div key={i} className="p-3 bg-gray-800 rounded-lg">
                                                <label className="block">
                                                    <span className="text-cyan-400 font-semibold">Question {i + 1}: {q.question}</span>
                                                    <textarea
                                                        value={q.userAnswer}
                                                        onChange={e => {
                                                            const newQuestions = [...currentInterviewQuestions];
                                                            newQuestions[i] = { ...newQuestions[i], userAnswer: e.target.value };
                                                            setCurrentInterviewQuestions(newQuestions);
                                                        }}
                                                        className="w-full h-32 bg-gray-900/50 p-2 rounded text-sm mt-1"
                                                        placeholder="Type your answer here..."
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={handleSubmitInterviewAnswers}
                                            disabled={isSubmittingAnswers || currentInterviewQuestions.some(q => !ValidationUtils.isNotNullOrEmpty(q.userAnswer))}
                                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white disabled:opacity-50"
                                        >
                                            {isSubmittingAnswers ? 'Submitting Answers...' : 'Get AI Feedback'}
                                        </button>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setSelectedInterviewSession(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Close</button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );

    const renderMarketTrendsSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Market Trends & Insights</h2>
            <Card title="Fetch Latest Trends">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-400">Industry</span>
                        <input
                            type="text"
                            value={marketTrendIndustry}
                            onChange={e => setMarketTrendIndustry(e.target.value)}
                            className="w-full bg-gray-900/50 p-2 rounded text-sm"
                            placeholder="e.g., Technology, Healthcare, Finance"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Keywords (comma-separated, optional)</span>
                        <input
                            type="text"
                            value={marketTrendKeywords}
                            onChange={e => setMarketTrendKeywords(e.target.value)}
                            className="w-full bg-gray-900/50 p-2 rounded text-sm"
                            placeholder="e.g., AI, Remote Work, Sustainability"
                        />
                    </label>
                    <div className="text-center">
                        <button
                            onClick={handleFetchMarketTrends}
                            disabled={isFetchingMarketTrends || !ValidationUtils.isNotNullOrEmpty(marketTrendIndustry)}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white disabled:opacity-50"
                        >
                            {isFetchingMarketTrends ? 'Fetching...' : 'Get Market Trends'}
                        </button>
                    </div>
                </div>
            </Card>

            {isFetchingMarketTrends && <p className="text-gray-400">Fetching market trends...</p>}
            {marketTrends.length > 0 && (
                <Card title="Current Market Insights">
                    <div className="space-y-4">
                        {marketTrends.map(trend => (
                            <div key={trend.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white">{trend.title}</h3>
                                <p className="text-sm text-gray-300 mt-1">{trend.description}</p>
                                <p className="text-sm text-gray-400 mt-2"><strong>Impact on Career:</strong> {trend.impactOnCareer}</p>
                                <p className="text-xs text-gray-500">Relevant Skills: {trend.relevantSkills.join(', ')}</p>
                                <p className="text-xs text-gray-500">Source: {trend.source} ({DateUtils.formatDate(trend.date)})</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );

    const renderSalaryNegotiationSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Salary Negotiation Assistant</h2>
            <Card title="Generate Negotiation Script">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-400">Job Title</span>
                        <input type="text" value={negotiationJobTitle} onChange={e => setNegotiationJobTitle(e.target.value)} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Company</span>
                        <input type="text" value={negotiationCompany} onChange={e => setNegotiationCompany(e.target.value)} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Initial Offer ($)</span>
                        <input type="number" value={negotiationInitialOffer} onChange={e => setNegotiationInitialOffer(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                    </label>
                    <label className="block">
                        <span className="text-gray-400">Desired Salary ($)</span>
                        <input type="number" value={negotiationDesiredSalary} onChange={e => setNegotiationDesiredSalary(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900/50 p-2 rounded text-sm" />
                    </label>
                    <div className="text-center">
                        <button
                            onClick={handleGenerateNegotiationScript}
                            disabled={isGeneratingNegotiationScript || !userProfile || negotiationDesiredSalary <= negotiationInitialOffer || !ValidationUtils.isNotNullOrEmpty(negotiationJobTitle)}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white disabled:opacity-50"
                        >
                            {isGeneratingNegotiationScript ? 'Generating...' : 'Generate Negotiation Script'}
                        </button>
                    </div>
                </div>
            </Card>

            {isGeneratingNegotiationScript && <p className="text-gray-400">Generating script...</p>}
            {negotiationScript && (
                <Card title="Suggested Negotiation Script">
                    <pre className="text-sm text-gray-200 whitespace-pre-wrap p-3 bg-gray-900/50 rounded-lg">{negotiationScript}</pre>
                    <button onClick={() => navigator.clipboard.writeText(negotiationScript)} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">Copy to Clipboard</button>
                </Card>
            )}
        </div>
    );

    const renderPersonalBrandingSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Personal Branding & LinkedIn Optimization</h2>
            <Card title="Optimize LinkedIn Summary">
                <p className="text-gray-400 mb-4">Generate a professional and keyword-rich LinkedIn summary based on your profile and desired roles.</p>
                <div className="text-center">
                    <button
                        onClick={handleOptimizeLinkedIn}
                        disabled={isOptimizingLinkedIn || !userProfile || userProfile.desiredRoles.length === 0}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white disabled:opacity-50"
                    >
                        {isOptimizingLinkedIn ? 'Optimizing...' : 'Optimize LinkedIn Summary'}
                    </button>
                    {!userProfile && <p className="text-red-400 mt-2">Please complete your profile first.</p>}
                    {userProfile && userProfile.desiredRoles.length === 0 && <p className="text-yellow-400 mt-2">Add desired roles to your profile for better optimization.</p>}
                </div>
            </Card>

            {isOptimizingLinkedIn && <p className="text-gray-400">Optimizing LinkedIn summary...</p>}
            {linkedInSummary && (
                <Card title="Optimized LinkedIn Summary">
                    <pre className="text-sm text-gray-200 whitespace-pre-wrap p-3 bg-gray-900/50 rounded-lg">{linkedInSummary}</pre>
                    <button onClick={() => navigator.clipboard.writeText(linkedInSummary)} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">Copy to Clipboard</button>
                </Card>
            )}
        </div>
    );

    const renderPerformanceReviewSection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Performance Review Assistant</h2>
            <Card title="Prepare Performance Review Points">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-400">Your Achievements (one per line, raw descriptions)</span>
                        <textarea
                            value={performanceAchievements}
                            onChange={e => setPerformanceAchievements(e.target.value)}
                            className="w-full h-48 bg-gray-900/50 p-2 rounded text-sm"
                            placeholder="e.g., Implemented new feature X. Helped team with project Y. Improved efficiency of process Z."
                        />
                    </label>
                    <div className="text-center">
                        <button
                            onClick={handlePreparePerformanceReview}
                            disabled={isPreparingReview || !userProfile || !ValidationUtils.isNotNullOrEmpty(performanceAchievements)}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white disabled:opacity-50"
                        >
                            {isPreparingReview ? 'Preparing...' : 'Generate Review Points'}
                        </button>
                    </div>
                </div>
            </Card>

            {isPreparingReview && <p className="text-gray-400">Generating review points...</p>}
            {performanceReviewPoints.length > 0 && (
                <Card title="Suggested Performance Review Points">
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-200 p-3 bg-gray-900/50 rounded-lg">
                        {performanceReviewPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigator.clipboard.writeText(performanceReviewPoints.join('\n'))} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">Copy to Clipboard</button>
                </Card>
            )}
        </div>
    );


    // -----------------------------------------------------------------------------------------------------------------
    //  4.5: Main Render Logic
    // -----------------------------------------------------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans antialiased p-6 sm:p-8 lg:p-12 relative">
            <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                {APP_NAME} <span className="text-lg text-gray-500">v{APP_VERSION}</span>
            </h1>

            {NotificationTray()}

            {Navbar()}

            {error && (
                <div className="bg-red-800 p-4 rounded-lg text-red-100 mb-6 border border-red-600" role="alert">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-10">
                {activeTab === 'resume' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Resume Optimization & Job Matching</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Your Resume">
                                <textarea
                                    value={resume}
                                    onChange={e => setResume(e.target.value)}
                                    className="w-full h-80 bg-gray-900/50 p-2 rounded text-sm font-mono text-white placeholder-gray-500 resize-y"
                                    maxLength={MAX_RESUME_LENGTH}
                                    placeholder="Paste your resume here..."
                                    ref={resumeRef}
                                />
                                <p className="text-xs text-right text-gray-500 mt-1">Words: {TextUtils.countWords(resume)} | Chars: {resume.length}/{MAX_RESUME_LENGTH}</p>
                                <button onClick={() => resumeRef.current?.select()} className="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs">Select All</button>
                            </Card>
                            <Card title="Target Job Description">
                                <textarea
                                    value={jobDesc}
                                    onChange={e => setJobDesc(e.target.value)}
                                    className="w-full h-80 bg-gray-900/50 p-2 rounded text-sm text-white placeholder-gray-500 resize-y"
                                    maxLength={MAX_JOB_DESC_LENGTH}
                                    placeholder="Paste the job description here..."
                                    ref={jobDescRef}
                                />
                                <p className="text-xs text-right text-gray-500 mt-1">Words: {TextUtils.countWords(jobDesc)} | Chars: {jobDesc.length}/{MAX_JOB_DESC_LENGTH}</p>
                                <button onClick={() => jobDescRef.current?.select()} className="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs">Select All</button>
                            </Card>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !ValidationUtils.isNotNullOrEmpty(resume) || !ValidationUtils.isNotNullOrEmpty(jobDesc)}
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </span>
                                ) : 'Generate AI Resume Suggestions'}
                            </button>
                        </div>
                        {(isLoading || suggestions.length > 0) && (
                            <Card title="AI Suggestions for Resume Improvement">
                                {isLoading ? (
                                    <p className="text-gray-400">Analyzing... Please wait. This may take a moment for detailed analysis.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {suggestions.length === 0 ? (
                                            <p className="text-gray-400">No specific suggestions found based on the provided resume and job description. Consider refining inputs.</p>
                                        ) : (
                                            suggestions.map((s, i) => (
                                                <div key={s.id || i} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                                    <p className="text-xs text-gray-400 mb-1">Original Text:</p>
                                                    <p className="text-sm text-red-400 line-through font-mono">"{s.originalText}"</p>
                                                    <p className="text-xs text-gray-400 mt-3 mb-1">Improved Text:</p>
                                                    <p className="text-sm text-green-400 font-mono">"{s.improvedText}"</p>
                                                    <p className="text-xs text-blue-400 mt-3">Rationale: <span className="text-gray-300">{s.rationale}</span></p>
                                                    <p className="text-xs text-gray-500 mt-1">Category: {s.category} | Severity: <span className={`${s.severity === 'Major' ? 'text-red-300' : s.severity === 'Moderate' ? 'text-yellow-300' : 'text-gray-300'}`}>{s.severity}</span></p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && userProfile && renderUserProfileSection()}
                {activeTab === 'goals' && renderCareerGoalsSection()}
                {activeTab === 'applications' && renderJobApplicationsSection()}
                {activeTab === 'interview' && renderInterviewPrepSection()}
                {activeTab === 'skills' && renderSkillGapSection()}
                {activeTab === 'market' && renderMarketTrendsSection()}
                {activeTab === 'negotiation' && renderSalaryNegotiationSection()}
                {activeTab === 'branding' && renderPersonalBrandingSection()}
                {activeTab === 'review' && renderPerformanceReviewSection()}
            </div>
        </div>
    );
};

export default CareerTrajectoryView;