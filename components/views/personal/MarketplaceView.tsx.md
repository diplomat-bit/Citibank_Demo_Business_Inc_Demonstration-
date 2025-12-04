```md
---
# The Agora

This is the Agora. Not a store of goods, but a curated reality of potential tools and alliances. Each item presented is a reflection of your own trajectory, a possibility unearthed by the AI Co-Pilot from the patterns of your life. To enter the marketplace is to be shown not what you might want, but what your journey might require next.

---

### A Fable for the Builder: The Curator

(A traditional marketplace is a noisy, chaotic place. A thousand merchants shouting, each claiming their wares are what you need. It is a game of persuasion, not of truth. We wanted to build a different kind of marketplace. A quiet, thoughtful space. This is the Agora, and its only merchant is a curator who works for you.)

(The AI, Plato, is that curator. It has no wares of its own to sell. Its only goal is to understand you so deeply that it can show you the tools you might need for the next leg of your journey. Its core logic is 'Trajectory-Based Curation.')

(It begins by reading your history, your `transactions`. It sees you have been spending on art supplies, on books about design. It understands that you are on a creative path. It then scours the universe of possible products and services, not for what is popular, not for what is profitable, but for what resonates with the path you are already on. It looks for the tools that a creator might need.)

(The `aiJustification` is the heart of this process. It is the curator, Plato, explaining its reasoning. It is not a sales pitch. It is a quiet conversation. "Because you have shown an interest in visual arts, you might find this high-resolution digital canvas valuable for your work." It is a suggestion born of listening.)

(This turns the act of commerce on its head. It is no longer about being sold to. It is about being understood. The products that appear here are not advertisements. They are possibilities. Echoes of your own expressed interests, reflected back to you in the form of tools that might help you on your way. It is a marketplace where every item on display is, in a sense, a piece of your own unfolding story.)

---
import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, useReducer, FC, ReactNode, CSSProperties } from 'react';
import { a as animated, useSpring, useTransition, useSprings, useChain } from '@react-spring/web';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { produce } from 'immer';
import { format as formatDate, formatDistanceToNow } from 'date-fns';

//================================================================================================
// 1. TYPE DEFINITIONS & ENUMS
//================================================================================================

export type UUID = string;

export enum Currency {
  USD = 'USD', EUR = 'EUR', GBP = 'GBP', JPY = 'JPY', ETH = 'ETH', BTC = 'BTC',
}

export enum ItemType {
  PhysicalGood = 'PHYSICAL_GOOD', DigitalSoftware = 'DIGITAL_SOFTWARE', Service = 'SERVICE',
  Subscription = 'SUBSCRIPTION', Educational = 'EDUCATIONAL', CommunityAccess = 'COMMUNITY_ACCESS',
  Consulting = 'CONSULTING', APIAccess = 'API_ACCESS',
}

export enum TrajectoryType {
  Creative = 'CREATIVE', Entrepreneurial = 'ENTREPRENEURIAL', Wellness = 'WELLNESS',
  Technical = 'TECHNICAL', Academic = 'ACADEMIC', Social = 'SOCIAL', Financial = 'FINANCIAL',
}

export enum OrderStatus {
    Pending = 'PENDING', Processing = 'PROCESSING', Shipped = 'SHIPPED',
    Delivered = 'DELIVERED', Cancelled = 'CANCELLED',
}

export interface Price {
  amount: number; currency: Currency; isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Vendor {
  id: UUID; name: string; logoUrl: string; rating: number; // 1-5 scale
  bio: string; joinedDate: string; isVerified: boolean;
}

export interface AIJustification {
  short: string; detailed: string;
  basedOn: string[]; // e.g., ["Transaction history", "Recent project 'Odyssey'", "Stated interest in 'philosophy'"]
  confidenceScore: number; // 0-1
}

export interface ReviewSentiment { positive: number; neutral: number; negative: number; }
export interface ReviewTopic { topic: string; mentions: number; sentiment: 'positive' | 'neutral' | 'negative'; }
export interface ReviewAnalysis { overallSentiment: ReviewSentiment; keyTopics: ReviewTopic[]; }

export interface Review {
  id: UUID; author: string; authorAvatar?: string; rating: number; // 1-5 scale
  comment: string; createdAt: string; // ISO 8601
  isHelpfulCount: number; media: { type: 'image' | 'video'; url: string }[];
}

export interface QuestionAndAnswer {
    id: UUID; question: string; questionBy: string; askedAt: string;
    answer?: string; answeredBy?: string; answeredAt?: string;
}

export interface PhysicalGoodDetails { weightKg: number; dimensionsCm: { w: number; h: number; d: number }; }
export interface DigitalSoftwareDetails { version: string; platform: ('windows' | 'mac' | 'linux')[]; license: 'perpetual' | 'subscription'; }
export interface ServiceDetails { durationHours?: number; scope: string; }

export interface MarketplaceItem {
  id: UUID; name: string; tagline: string; description: string; imageUrls: string[];
  type: ItemType; category: string; tags: string[]; price: Price; vendor: Vendor;
  aiJustification: AIJustification; userReviews: Review[]; reviewAnalysis: ReviewAnalysis;
  qAndA: QuestionAndAnswer[]; relatedItems: UUID[]; stock?: number; isFeatured: boolean;
  relevanceScore: number; // Calculated by AI for sorting
  createdAt: string;
  details: PhysicalGoodDetails | DigitalSoftwareDetails | ServiceDetails | null;
  attributes: { name: string; value: string | number }[];
}

export interface UserTransaction {
  id: UUID; date: string; // ISO 8601
  description: string; amount: number; currency: Currency; category: string;
}

export interface UserProject {
  id: UUID; name: string; description: string; relatedTransactions: UUID[];
  startDate: string; // ISO 8601
}

export interface UserTrajectory {
  primaryType: TrajectoryType; secondaryTypes: TrajectoryType[];
  narrative: string; // A short story about the user's path, generated by the AI
  confidence: number; // 0-1
  evidence: string[];
}

export interface UserProfile {
  id: UUID; name: string; email: string; avatarUrl: string; joinedDate: string; // ISO 8601
  transactions: UserTransaction[]; projects: UserProject[];
}

export interface CurationSettings {
  allowTransactionAnalysis: boolean; allowProjectAnalysis: boolean;
  preferredItemTypes: ItemType[]; excludedTags: string[];
  curationAggressiveness: 'conservative' | 'balanced' | 'exploratory';
}

export interface CartItem { itemId: UUID; quantity: number; addedAt: string; }
export interface WishlistItem { itemId: UUID; addedAt: string; }
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';

export interface FilterState {
  searchQuery: string; categories: Set<string>; itemTypes: Set<ItemType>;
  priceRange: [number, number]; ratingRange: [number, number]; showFeaturedOnly: boolean;
}

export type Notification = {
    id: UUID; type: 'success' | 'error' | 'info'; message: string; timestamp: number;
}
export interface ComparisonState { isComparing: boolean; itemIds: UUID[]; }
export type ModalState = 'none' | 'itemDetail' | 'plato' | 'settings' | 'cart';

export type MarketplaceState = {
  isLoading: boolean; error: Error | null; items: MarketplaceItem[]; userProfile: UserProfile | null;
  userTrajectory: UserTrajectory | null; curationSettings: CurationSettings;
  filters: FilterState; sortBy: SortOption;
  pagination: { currentPage: number; itemsPerPage: number; };
  selectedItemId: UUID | null;
  activeModal: ModalState;
  cart: CartItem[]; wishlist: WishlistItem[];
  notifications: Notification[];
  comparison: ComparisonState;
};

export type MarketplaceAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { items: MarketplaceItem[]; userProfile: UserProfile; userTrajectory: UserTrajectory; } }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'UPDATE_SORT'; payload: SortOption }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_MODAL'; payload: { modal: ModalState; itemId?: UUID | null } }
  | { type: 'UPDATE_CURATION_SETTINGS'; payload: Partial<CurationSettings> }
  | { type: 'SUBMIT_FEEDBACK'; payload: { itemId: UUID; feedback: 'helpful' | 'not_relevant' } }
  | { type: 'ADD_TO_CART'; payload: { itemId: UUID; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: UUID } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { itemId: UUID; quantity: number } }
  | { type: 'TOGGLE_WISHLIST_ITEM'; payload: { itemId: UUID } }
  | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info'; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: UUID } }
  | { type: 'START_COMPARISON'; payload: { itemIds: UUID[] } }
  | { type: 'END_COMPARISON' }
  | { type: 'RESET_FILTERS' };

//================================================================================================
// 2. MOCK DATA GENERATION & API SERVICE LAYER
//================================================================================================

const MOCK_DB_DELAY = 600;
const generateUUID = (): UUID => crypto.randomUUID();
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const createMockVendor = (name: string, logo: string, bio: string): Vendor => ({
  id: generateUUID(), name, logoUrl: `https://api.dicebear.com/7.x/logo/svg?seed=${logo}`,
  rating: 3.5 + Math.random() * 1.5, bio,
  joinedDate: new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
  isVerified: Math.random() > 0.3,
});

const VENDORS = {
  artisanInk: createMockVendor('Artisan Ink', 'artisan-ink', 'Creators of fine digital and physical art tools.'),
  codeWeavers: createMockVendor('CodeWeavers', 'codeweavers', 'Building the next generation of development software.'),
  mindfulFlow: createMockVendor('Mindful Flow', 'mindfulflow', 'Guiding you towards a balanced life with tools for wellness.'),
  symposium: createMockVendor('Symposium', 'symposium', 'A collective for deep learning and knowledge sharing.'),
  quantCore: createMockVendor('QuantCore Analytics', 'quantcore', 'AI-driven financial modeling and API services.'),
};

const createMockReview = (): Review => ({
  id: generateUUID(), author: sample(['Alex', 'Sam', 'Charlie', 'Dana', 'Jordan']), authorAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`,
  rating: Math.ceil(Math.random() * 5),
  comment: sample(['Life-changing!', 'A solid product, worth the price.', 'Had some issues with setup, but support was great.', 'Not what I expected.', 'Incredible value. Would recommend to anyone on a similar path.']),
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  isHelpfulCount: Math.floor(Math.random() * 50), media: [],
});

const generateMockItems = (count: number): MarketplaceItem[] => {
    const items: MarketplaceItem[] = [];
    const templates = [
      { name: 'Visionary Pro Canvas', tagline: 'The ultimate digital drawing tablet.', type: ItemType.PhysicalGood, category: 'Digital Art', price: { amount: 799, currency: Currency.USD, isRecurring: false }, vendor: VENDORS.artisanInk, imageSeed: 'tablet_pro', tags: ['drawing', 'illustration'], attributes: [{name: 'Resolution', value: '8K'}, {name: 'Pressure Levels', value: 8192}] },
      { name: 'CodeScribe AI', tagline: 'Your AI-powered pair programmer.', type: ItemType.DigitalSoftware, category: 'Development', price: { amount: 20, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.codeWeavers, imageSeed: 'codescribe_ai', tags: ['ai', 'coding', 'productivity'], attributes: [{name: 'Languages', value: 'JS, Python, Go'}, {name: 'IDE Support', value: 'VSCode, JetBrains'}] },
      { name: 'Zenith Meditation Pod', tagline: 'A subscription to guided mindfulness.', type: ItemType.Service, category: 'Wellness', price: { amount: 15, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.mindfulFlow, imageSeed: 'zenith_pod', tags: ['meditation', 'mental health'], attributes: [{name: 'Session Lengths', value: '5, 10, 20 min'}, {name: 'Styles', value: 'Vipassana, Zen'}] },
      { name: 'The Philosophy of Systems', tagline: 'Deep-dive course on complex systems.', type: ItemType.Educational, category: 'Learning', price: { amount: 250, currency: Currency.USD, isRecurring: false }, vendor: VENDORS.symposium, imageSeed: 'systems_course', tags: ['philosophy', 'thinking models'], attributes: [{name: 'Duration', value: '8 Weeks'}, {name: 'Effort', value: '3-5 hours/week'}] },
      { name: 'Market Forecaster API', tagline: 'Predictive analytics for financial markets.', type: ItemType.APIAccess, category: 'Finance', price: { amount: 499, currency: Currency.USD, isRecurring: true, recurringInterval: 'monthly' }, vendor: VENDORS.quantCore, imageSeed: 'market_api', tags: ['finance', 'api', 'ai'], attributes: [{name: 'Rate Limit', value: '1000/min'}, {name: 'Data Lag', value: '< 50ms'}] },
    ];

    for (let i = 0; i < count; i++) {
        const template = sample(templates);
        const name = `${template.name} Mk${Math.floor(i / templates.length) + 1}`;
        items.push({
            id: generateUUID(), name, tagline: template.tagline,
            description: 'This is a detailed description that would elaborate on the product\'s features, benefits, and specifications. It is designed to give the user a complete understanding of what they are considering, allowing for an informed decision based on their curated trajectory. '.repeat(Math.random() * 4 + 2),
            imageUrls: [`https://picsum.photos/seed/${template.imageSeed}${i}/600/400`, `https://picsum.photos/seed/${template.imageSeed}${i}b/600/400`, `https://picsum.photos/seed/${template.imageSeed}${i}c/600/400`],
            type: template.type, category: template.category, tags: [template.category.toLowerCase(), ...template.tags],
            price: { ...template.price, amount: Math.round(template.price.amount * (0.8 + Math.random() * 0.4)) },
            vendor: template.vendor,
            aiJustification: {
                short: 'Based on your recent activities, this seems like a logical next step.',
                detailed: 'Our analysis of your project \'Odyssey\' and recent transactions related to digital art suggests a deep dive into high-fidelity illustration. This tool, known for its powerful brush engine and non-destructive workflow, directly aligns with the techniques you appear to be exploring. It could significantly accelerate your progress on the path of a digital artist.',
                basedOn: ['Project \'Odyssey\'', 'Transactions in \'Art Supplies\''],
                confidenceScore: Math.random() * 0.4 + 0.55,
            },
            userReviews: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, createMockReview),
            reviewAnalysis: {
                overallSentiment: { positive: Math.floor(Math.random()*30+60), neutral: Math.floor(Math.random()*10+10), negative: Math.floor(Math.random()*10) },
                keyTopics: [ { topic: 'Ease of Use', mentions: 15, sentiment: 'positive' }, { topic: 'Price', mentions: 10, sentiment: 'neutral' }, { topic: 'Customer Support', mentions: 5, sentiment: 'negative' } ],
            },
            qAndA: [], relatedItems: [],
            isFeatured: Math.random() > 0.8,
            relevanceScore: Math.random(),
            createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
            stock: template.type === ItemType.PhysicalGood ? Math.floor(Math.random() * 100) : undefined,
            details: null,
            attributes: template.attributes,
        });
    }

    items.forEach(item => { item.relatedItems = items.filter(other => other.id !== item.id && other.category === item.category).map(other => other.id).slice(0, 3); });
    return items;
};

const MOCK_ITEMS = generateMockItems(100);

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-001', name: 'Alexandria', email: 'alex@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alexandria',
  joinedDate: new Date('2022-01-15T09:30:00Z').toISOString(),
  transactions: [ { id: generateUUID(), date: new Date().toISOString(), description: 'Artisan Ink Supplies', amount: 85, currency: Currency.USD, category: 'Art Supplies' }, { id: generateUUID(), date: new Date().toISOString(), description: 'Symposium: Design Theory', amount: 120, currency: Currency.USD, category: 'Education' } ],
  projects: [ { id: 'proj-odyssey', name: 'Odyssey', description: 'A series of digital illustrations exploring ancient myths.', relatedTransactions: [], startDate: new Date('2023-05-01T10:00:00Z').toISOString() } ],
};

const MOCK_USER_TRAJECTORY: UserTrajectory = {
  primaryType: TrajectoryType.Creative, secondaryTypes: [TrajectoryType.Academic],
  narrative: 'You are on the path of a modern storyteller, blending classical themes with digital artistry. Your journey is about mastering new mediums to express timeless ideas.',
  confidence: 0.88,
  evidence: ['Purchase history of art supplies', 'Enrollment in design theory courses', 'Active project \'Odyssey\' focusing on mythology'],
};

export class MockApiService {
  static async fetchMarketplaceData(userId: UUID): Promise<{ items: MarketplaceItem[]; userProfile: UserProfile; userTrajectory: UserTrajectory; }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const personalizedItems = MOCK_ITEMS.map(item => ({ ...item, relevanceScore: this.calculateRelevance(item, MOCK_USER_TRAJECTORY), })).sort((a, b) => b.relevanceScore - a.relevanceScore);
        resolve({ items: personalizedItems, userProfile: MOCK_USER_PROFILE, userTrajectory: MOCK_USER_TRAJECTORY });
      }, MOCK_DB_DELAY);
    });
  }

  private static calculateRelevance(item: MarketplaceItem, trajectory: UserTrajectory): number {
    let score = 0.5;
    if(trajectory.primaryType === TrajectoryType.Creative && (item.category === 'Digital Art' || item.category === 'Community')) score += 0.4;
    if(trajectory.secondaryTypes.includes(TrajectoryType.Academic) && item.type === ItemType.Educational) score += 0.3;
    if (item.isFeatured) score += 0.1;
    return Math.min(1, score * (0.8 + Math.random() * 0.4));
  }

  static async submitFeedback(userId: UUID, itemId: UUID, feedback: 'helpful' | 'not_relevant'): Promise<{success: boolean}> { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); }

  static async askPlato(userId: UUID, query: string, history: {q:string, a:string}[]): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const response = `Based on our previous conversation and your question about "${query}", I've analyzed your current trajectory as a '${MOCK_USER_TRAJECTORY.primaryType.toLowerCase()}'. I recommend exploring tools that offer collaborative features. For instance, the 'Creator's Guild Access' would connect you with peers who share your passion, potentially accelerating your 'Odyssey' project. Is collaboration something you're interested in?`;
        resolve(response);
      }, 1200);
    });
  }

  static async getComparisonAnalysis(itemIds: UUID[], trajectory: UserTrajectory): Promise<string> {
      return new Promise(resolve => {
          setTimeout(() => {
              const items = MOCK_ITEMS.filter(i => itemIds.includes(i.id));
              if (items.length < 2) return resolve("Not enough items to compare.");
              const analysis = `Comparing **${items[0].name}** and **${items[1].name}** for your **${trajectory.primaryType}** trajectory:\n\n- **${items[0].name}**: Excels in raw performance and is a one-time purchase. It's better for focused, solo work where you need maximum power.\n- **${items[1].name}**: Offers more collaborative features and a subscription model, ensuring you always have the latest updates. It's ideal if you plan to work in a team.\n\n**Recommendation:** Given your 'Odyssey' project appears to be a solo endeavor, the **${items[0].name}** might offer better long-term value. However, if you anticipate bringing on collaborators, the subscription model of **${items[1].name}** is more flexible.`;
              resolve(analysis);
          }, 1500);
      });
  }
}

//================================================================================================
// 3. STATE MANAGEMENT (Context & Reducer)
//================================================================================================

export const initialFilters: FilterState = { searchQuery: '', categories: new Set(), itemTypes: new Set(), priceRange: [0, 1000], ratingRange: [0, 5], showFeaturedOnly: false, };
export const initialState: MarketplaceState = {
  isLoading: true, error: null, items: [], userProfile: null, userTrajectory: null,
  curationSettings: { allowTransactionAnalysis: true, allowProjectAnalysis: true, preferredItemTypes: [], excludedTags: [], curationAggressiveness: 'balanced', },
  filters: initialFilters, sortBy: 'relevance', pagination: { currentPage: 1, itemsPerPage: 12 },
  selectedItemId: null, activeModal: 'none', cart: [], wishlist: [], notifications: [],
  comparison: { isComparing: false, itemIds: [] },
};

export const marketplaceReducer = produce((draft: MarketplaceState, action: MarketplaceAction) => {
  switch (action.type) {
    case 'FETCH_START': draft.isLoading = true; draft.error = null; break;
    case 'FETCH_SUCCESS':
      draft.isLoading = false;
      draft.items = action.payload.items;
      draft.userProfile = action.payload.userProfile;
      draft.userTrajectory = action.payload.userTrajectory;
      break;
    case 'FETCH_ERROR': draft.isLoading = false; draft.error = action.payload; break;
    case 'UPDATE_FILTERS': draft.filters = { ...draft.filters, ...action.payload }; draft.pagination.currentPage = 1; break;
    case 'RESET_FILTERS': draft.filters = initialFilters; draft.pagination.currentPage = 1; break;
    case 'UPDATE_SORT': draft.sortBy = action.payload; break;
    case 'SET_PAGE': draft.pagination.currentPage = action.payload; break;
    case 'SET_MODAL': draft.activeModal = action.payload.modal; draft.selectedItemId = action.payload.itemId || null; break;
    case 'ADD_TO_CART': {
      const existingItem = draft.cart.find(i => i.itemId === action.payload.itemId);
      if (existingItem) existingItem.quantity += action.payload.quantity;
      else draft.cart.push({ ...action.payload, addedAt: new Date().toISOString() });
      break;
    }
    case 'REMOVE_FROM_CART': draft.cart = draft.cart.filter(i => i.itemId !== action.payload.itemId); break;
    case 'UPDATE_CART_QUANTITY': {
      const item = draft.cart.find(i => i.itemId === action.payload.itemId);
      if (item) item.quantity = action.payload.quantity;
      break;
    }
    case 'TOGGLE_WISHLIST_ITEM': {
        const { itemId } = action.payload;
        const index = draft.wishlist.findIndex(i => i.itemId === itemId);
        if (index > -1) draft.wishlist.splice(index, 1);
        else draft.wishlist.push({ itemId, addedAt: new Date().toISOString() });
        break;
    }
    case 'ADD_NOTIFICATION': draft.notifications.push({ id: generateUUID(), timestamp: Date.now(), ...action.payload }); break;
    case 'REMOVE_NOTIFICATION': draft.notifications = draft.notifications.filter(n => n.id !== action.payload.id); break;
    default: break;
  }
});

export const MarketplaceContext = createContext<{ state: MarketplaceState; dispatch: React.Dispatch<MarketplaceAction>; } | undefined>(undefined);
export const useMarketplace = () => { const context = useContext(MarketplaceContext); if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider'); return context; };

//================================================================================================
// 4. UTILITY & CUSTOM HOOKS
//================================================================================================

export const useFilteredAndSortedItems = () => {
    const { state } = useMarketplace();
    const { items, filters, sortBy, pagination } = state;
    return useMemo(() => {
        let result = items.filter(item => {
            const query = filters.searchQuery.toLowerCase();
            if (query && !(item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.tags.some(t => t.toLowerCase().includes(query)))) return false;
            if (filters.categories.size > 0 && !filters.categories.has(item.category)) return false;
            if (filters.itemTypes.size > 0 && !filters.itemTypes.has(item.type)) return false;
            if (item.price.amount < filters.priceRange[0] || item.price.amount > filters.priceRange[1]) return false;
            const avgRating = item.userReviews.reduce((acc, r) => acc + r.rating, 0) / item.userReviews.length;
            if (avgRating < filters.ratingRange[0] || avgRating > filters.ratingRange[1]) return false;
            if (filters.showFeaturedOnly && !item.isFeatured) return false;
            return true;
        });
        switch (sortBy) {
            case 'price_asc': result.sort((a, b) => a.price.amount - b.price.amount); break;
            case 'price_desc': result.sort((a, b) => b.price.amount - a.price.amount); break;
            case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
            case 'rating': result.sort((a, b) => (b.userReviews.reduce((acc, r) => acc + r.rating, 0) / b.userReviews.length) - (a.userReviews.reduce((acc, r) => acc + r.rating, 0) / a.userReviews.length)); break;
            default: result.sort((a, b) => b.relevanceScore - a.relevanceScore); break;
        }
        const totalItems = result.length;
        const pagedItems = result.slice((pagination.currentPage - 1) * pagination.itemsPerPage, pagination.currentPage * pagination.itemsPerPage);
        return { pagedItems, totalItems };
    }, [items, filters, sortBy, pagination]);
};

export const formatCurrency = (price: Price): string => {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currency, maximumFractionDigits: 2 });
  let formatted = formatter.format(price.amount);
  if (price.isRecurring) formatted += `/${price.recurringInterval === 'monthly' ? 'mo' : 'yr'}`;
  return formatted;
};

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]);
    return debouncedValue;
};

//================================================================================================
// 5. UI COMPONENTS
//================================================================================================

const IconSearch: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconThumbsUp: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z"/></svg>;
const IconThumbsDown: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z"/></svg>;
const IconHeart: FC<{ filled?: boolean }> = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#dc3545" : "none"} stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const IconShoppingCart: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconSettings: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconFilter: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const IconStar: FC<{ filled?: boolean }> = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ffc107" : "none"} stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

const STYLES: { [key: string]: CSSProperties } = {
  pageContainer: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8f9fa', color: '#212529', minHeight: '100vh', '--primary-color': '#007bff' },
  header: { padding: '1.5rem 2.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  headerTitle: { fontSize: '1.75rem', fontWeight: 700, margin: 0 },
  mainContent: { padding: '2.5rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', alignItems: 'start' },
  sidebar: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #dee2e6', alignSelf: 'start', position: 'sticky', top: '120px' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
  card: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #dee2e6', cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(33, 37, 41, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', borderRadius: '12px', width: '90%', maxHeight: '90vh', overflowY: 'auto' },
  button: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '1rem', fontWeight: 500, transition: 'background-color 0.2s, transform 0.1s' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' },
  h2: { marginTop: 0, marginBottom: '1.5rem', fontWeight: 700, fontSize: '2rem' },
  h3: { marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e9ecef', paddingBottom: '0.75rem', fontWeight: 600, fontSize: '1.25rem' },
};

export const StarRating: FC<{ rating: number }> = ({ rating }) => <div>{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < rating} />)}</div>;
export const SkeletonCard: FC = () => (<div style={STYLES.card}><div style={{ width: '100%', height: '180px', backgroundColor: '#e9ecef' }} /><div style={{ padding: '20px' }}><div style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px', marginBottom: '10px' }} /><div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '75%', marginBottom: '15px' }} /><div style={{ height: '14px', backgroundColor: '#e9ecef', borderRadius: '4px', width: '90%' }} /></div></div>);
export const ItemCard: FC<{ item: MarketplaceItem; onSelect: (id: UUID) => void; onAddToCart: (id: UUID) => void; onToggleWishlist: (id: UUID) => void; isWishlisted: boolean; }> = ({ item, onSelect, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springProps = useSpring({ transform: `translateY(${isHovered ? -5 : 0}px)`, boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)' });
  const avgRating = item.userReviews.reduce((acc, r) => acc + r.rating, 0) / item.userReviews.length;
  return (
    <animated.div style={{ ...STYLES.card, ...springProps }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ position: 'relative' }}>
          <img onClick={() => onSelect(item.id)} src={item.imageUrls[0]} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
          <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconHeart filled={isWishlisted} /></button>
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 onClick={() => onSelect(item.id)} style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 600, flex: 1 }}>{item.name}</h4>
        <div onClick={() => onSelect(item.id)} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}><StarRating rating={avgRating} /> <span style={{fontSize: '12px', color: '#6c757d'}}>({item.userReviews.length})</span></div>
        <p onClick={() => onSelect(item.id)} style={{ margin: '0 0 15px 0', fontStyle: 'italic', fontSize: '13px', borderLeft: '3px solid var(--primary-color)', paddingLeft: '10px', color: '#495057' }}>"{item.aiJustification.short}"</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{formatCurrency(item.price)}</span>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(item.id); }} style={{...STYLES.button, padding: '8px 12px', fontSize: '14px' }}>Add to Cart</button>
        </div>
      </div>
    </animated.div>
  );
};
export const ItemDetailModal: FC<{ item: MarketplaceItem | undefined; onClose: () => void; }> = ({ item, onClose }) => {
    const { dispatch } = useMarketplace();
    const [activeTab, setActiveTab] = useState('description');
    const tabs = ['description', 'reviews', 'details', 'vendor'];
    if (!item) return null;
    const sentimentData = [{ name: 'Positive', value: item.reviewAnalysis.overallSentiment.positive }, { name: 'Neutral', value: item.reviewAnalysis.overallSentiment.neutral }, { name: 'Negative', value: item.reviewAnalysis.overallSentiment.negative }];
    const COLORS = ['#28a745', '#ffc107', '#dc3545'];
    return (
        <div style={STYLES.modalBackdrop} onClick={onClose}>
            <animated.div style={{ ...STYLES.modalContent, width: '90%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ ...STYLES.button, position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#333' }}><IconX /></button>
                <div>
                    <img src={item.imageUrls[0]} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
                    <h2 style={{ ...STYLES.h2, fontSize: '28px', marginTop: '20px' }}>{item.name}</h2>
                    <p style={{ fontSize: '18px', color: '#6c757d' }}>{item.tagline}</p>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '20px 0' }}>{formatCurrency(item.price)}</div>
                    <button onClick={() => { dispatch({type: 'ADD_TO_CART', payload: {itemId: item.id, quantity: 1}}); dispatch({type: 'ADD_NOTIFICATION', payload: {type: 'success', message: `${item.name} added to cart!`}}) }} style={{ ...STYLES.button, width: '100%', padding: '15px' }}>Acquire Tool</button>
                    <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '8px', border: '1px solid #cce4ff', marginTop: '20px' }}>
                        <h3 style={{ ...STYLES.h3, marginTop: 0 }}>Plato's Justification</h3>
                        <p>{item.aiJustification.detailed}</p>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '15px' }}><strong>Based on:</strong> {item.aiJustification.basedOn.join(', ')}<br /><strong>Confidence:</strong> {Math.round(item.aiJustification.confidenceScore * 100)}%</div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6' }}>{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...STYLES.button, background: activeTab === tab ? '#e9ecef' : 'none', color: '#343a40', textTransform: 'capitalize' }}>{tab}</button>)}</div>
                    <div style={{paddingTop: '20px'}}>
                        {activeTab === 'description' && <p>{item.description}</p>}
                        {activeTab === 'details' && <ul>{item.attributes.map(attr => <li key={attr.name}><strong>{attr.name}:</strong> {attr.value}</li>)}</ul>}
                        {activeTab === 'vendor' && <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><img src={item.vendor.logoUrl} alt={item.vendor.name} style={{ width: '50px', height: '50px' }}/><p>{item.vendor.bio}</p></div>}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 style={STYLES.h3}>Review Analysis</h3>
                                <div style={{height: '200px'}}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart><Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <h3 style={STYLES.h3}>User Reviews ({item.userReviews.length})</h3>
                                {item.userReviews.map(review => (
                                    <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}><img src={review.authorAvatar} style={{width: 32, height: 32, borderRadius: 16}} /><strong>{review.author}</strong> - <StarRating rating={review.rating} /></div>
                                        <p style={{margin: '5px 0'}}>{review.comment}</p>
                                        <small style={{color: '#6c757d'}}>{formatDistanceToNow(new Date(review.createdAt))} ago</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </animated.div>
        </div>
    );
};
export const PlatoConsultationModal: FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<{q: string, a: string}[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if(!query.trim() || isThinking) return; setIsThinking(true);
        const userQuery = query; setQuery('');
        const answer = await MockApiService.askPlato('user-001', userQuery, history);
        setHistory(prev => [...prev, { q: userQuery, a: answer }]); setIsThinking(false);
    };
    if (!isOpen) return null;
    return (
        <div style={STYLES.modalBackdrop} onClick={onClose}>
            <div style={{ ...STYLES.modalContent, maxWidth: '600px', display: 'flex', flexDirection: 'column', height: '80vh' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ ...STYLES.button, position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#333' }}><IconX /></button>
                <h2 style={STYLES.h2}>Consult Plato</h2>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                    {history.length === 0 && <p>You may ask for guidance. For example: "What should I learn next to improve my digital art?"</p>}
                    {history.map((entry, index) => (<div key={index}><p style={{textAlign: 'right', fontWeight: 'bold'}}>You: {entry.q}</p><p style={{backgroundColor: '#f0f7ff', padding: '10px', borderRadius: '8px'}}>Plato: {entry.a}</p></div>))}
                    {isThinking && <div style={{display: 'flex', justifyContent: 'center'}}><p>Plato is thinking...</p></div>}
                </div>
                <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}><input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask for a recommendation..." style={STYLES.input} disabled={isThinking}/> <button type="submit" style={STYLES.button} disabled={isThinking}>Send</button></form>
            </div>
        </div>
    );
};
export const Sidebar: FC = () => {
  const { state, dispatch } = useMarketplace();
  const { filters, items } = state;
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))), [items]);
  const itemTypes = useMemo(() => Array.from(new Set(items.map(i => i.type))), [items]);

  const handleFilterChange = (payload: Partial<FilterState>) => dispatch({ type: 'UPDATE_FILTERS', payload });

  return (
    <aside style={STYLES.sidebar}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{...STYLES.h3, marginTop: 0, border: 'none'}}>Filters</h3>
        <button onClick={() => dispatch({type: 'RESET_FILTERS'})} style={{...STYLES.button, background: 'none', color: 'var(--primary-color)', padding: 0}}>Reset</button>
      </div>
      <div>
        <h4>Category</h4>
        {categories.map(cat => (<div key={cat}><input type="checkbox" id={`cat-${cat}`} checked={filters.categories.has(cat)} onChange={() => { const newSet = new Set(filters.categories); if(newSet.has(cat)) newSet.delete(cat); else newSet.add(cat); handleFilterChange({categories: newSet})}} /> <label htmlFor={`cat-${cat}`}>{cat}</label></div>))}
      </div>
      <div style={{marginTop: '20px'}}>
        <h4>Item Type</h4>
        {itemTypes.map(type => (<div key={type}><input type="checkbox" id={`type-${type}`} checked={filters.itemTypes.has(type)} onChange={() => { const newSet = new Set(filters.itemTypes); if(newSet.has(type)) newSet.delete(type); else newSet.add(type); handleFilterChange({itemTypes: newSet})}} /> <label htmlFor={`type-${type}`}>{type.replace(/_/g, ' ').toLocaleLowerCase()}</label></div>))}
      </div>
      <div style={{marginTop: '20px'}}>
        <h4>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</h4>
        <input type="range" min="0" max="1000" value={filters.priceRange[1]} onChange={e => handleFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })} style={{width: '100%'}}/>
      </div>
    </aside>
  );
};

//================================================================================================
// 6. MAIN VIEW COMPONENT
//================================================================================================

export const MarketplaceViewContent: FC = () => {
  const { state, dispatch } = useMarketplace();
  const { isLoading, error, selectedItemId, items, wishlist, pagination } = state;
  const { pagedItems, totalItems } = useFilteredAndSortedItems();

  useEffect(() => { dispatch({ type: 'FETCH_START' }); MockApiService.fetchMarketplaceData('user-001').then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data })).catch(e => dispatch({ type: 'FETCH_ERROR', payload: e as Error })); }, [dispatch]);

  const selectedItem = useMemo(() => items.find(item => item.id === selectedItemId), [items, selectedItemId]);
  const handleAddToCart = useCallback((itemId: UUID) => { dispatch({ type: 'ADD_TO_CART', payload: { itemId, quantity: 1 } }); dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'Item added to cart!' } }); }, [dispatch]);
  const handleToggleWishlist = useCallback((itemId: UUID) => { dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: { itemId } }); }, [dispatch]);
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  return (
    <div style={STYLES.pageContainer}>
      <header style={STYLES.header}>
        <div><h1 style={STYLES.headerTitle}>The Agora</h1><p style={{margin: 0, color: '#6c757d'}}>A curated reality of potential, by Plato</p></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><button style={STYLES.button} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'plato' } })}>Consult Plato</button><button style={{...STYLES.button, background: 'none', color: '#495057'}} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'cart' } })}><IconShoppingCart /></button><button style={{...STYLES.button, background: 'none', color: '#495057'}} onClick={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'settings' } })}><IconSettings /></button><img src={state.userProfile?.avatarUrl} alt="User Avatar" style={{width: '48px', height: '48px', borderRadius: '50%'}} /></div>
      </header>
      <main style={STYLES.mainContent}>
        <Sidebar />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '50%' }}><span style={{position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#999'}}><IconSearch/></span><input type="text" placeholder="Search for tools, services, ideas..." value={state.filters.searchQuery} onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { searchQuery: e.target.value } })} style={{...STYLES.input, paddingLeft: '40px'}} /></div>
            <div><label htmlFor="sort-by">Sort by: </label><select id="sort-by" value={state.sortBy} onChange={e => dispatch({type: 'UPDATE_SORT', payload: e.target.value as SortOption})} style={{...STYLES.input, width: 'auto'}}><option value="relevance">Relevance</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Highest Rated</option></select></div>
          </div>
          {isLoading ? (<div style={STYLES.itemGrid}>{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>) : error ? (<p>There was an error loading the Agora: {error.message}</p>) : pagedItems.length > 0 ? (
            <>
              <div style={STYLES.itemGrid}>{pagedItems.map(item => (<ItemCard key={item.id} item={item} onSelect={(id) => dispatch({ type: 'SET_MODAL', payload: { modal: 'itemDetail', itemId: id } })} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={wishlist.some(w => w.itemId === item.id)} />))}</div>
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem'}}>{Array.from({length: totalPages}).map((_, i) => (<button key={i} onClick={() => dispatch({type: 'SET_PAGE', payload: i+1})} style={{...STYLES.button, background: pagination.currentPage === i+1 ? 'var(--primary-color)' : '#e9ecef', color: pagination.currentPage === i+1 ? 'white' : 'black'}}>{i+1}</button>))}</div>
            </>
          ) : (<p>No items match your current filters.</p>)}
        </div>
      </main>
      {state.activeModal === 'itemDetail' && <ItemDetailModal item={selectedItem} onClose={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'none' } })} />}
      <PlatoConsultationModal isOpen={state.activeModal === 'plato'} onClose={() => dispatch({ type: 'SET_MODAL', payload: { modal: 'none' } })}/>
    </div>
  );
};

export const MarketplaceView: FC = () => {
    const [state, dispatch] = useReducer(marketplaceReducer, initialState);
    return (
      <MarketplaceContext.Provider value={{ state, dispatch }}>
        <MarketplaceViewContent />
      </MarketplaceContext.Provider>
    );
};

export default MarketplaceView;
```