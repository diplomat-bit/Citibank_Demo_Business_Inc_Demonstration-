// types/models/platform/constitutional-article.ts
import React from 'react';

export interface ConstitutionalArticle {
    id: number;
    romanNumeral: string;
    title: string;
    // FIX: Changed type to React.ReactNode to match data assignment and usage.
    content: React.ReactNode; 
    iconName: string; // Added to support unique icons
}