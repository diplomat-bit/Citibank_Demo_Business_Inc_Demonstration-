// data/constitutionalArticles.ts
import React from 'react';
import type { ConstitutionalArticle } from '../types';

function toRoman(num: number): string {
    const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i as keyof typeof roman]);
        num -= q * roman[i as keyof typeof roman];
        str += i.repeat(q);
    }
    return str;
}

// FIX: Converted JSX to React.createElement to be valid in a .ts file.
const placeholderContent = React.createElement(React.Fragment, null,
    React.createElement('p', null, 'This Article serves as a foundational pillar of the Demo Bank ecosystem. Its tenets ensure the stability, security, and sovereign integrity of the platform and its participants. The principles herein are immutable and shall govern all corresponding operations and future amendments.'),
    React.createElement('p', null, 'Adherence to this statute is mandatory for all automated agents and human operators. It provides the logical framework for consensus and deterministic outcomes within its specified domain. Any ambiguity shall be resolved by reference to the Prime Charter (Article I) and the Doctrine of Finality.')
);

const allArticles: ConstitutionalArticle[] = Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    return {
        id,
        romanNumeral: toRoman(id),
        title: `Placeholder Article ${id}`,
        content: placeholderContent,
    };
});

// Replace placeholders with specific content
allArticles[0] = {
    id: 1,
    romanNumeral: 'I',
    title: 'The Sovereign Mandate',
    // FIX: Converted JSX to React.createElement to be valid in a .ts file.
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null, 'This Charter defines the core financial principles of your engagement with the Quantum AI. Instead of static rules, you inscribe a philosophy. By signing this Charter, you grant Quantum the mandate to act as your autonomous Sovereign Financial Agent, proactively managing your finances in accordance with these values.'),
        React.createElement('p', { className: "font-bold text-cyan-300" }, 'Your Inscribed Principles:'),
        React.createElement('div', { className: "p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 font-serif italic space-y-2" },
            React.createElement('p', null, "My risk tolerance is aggressive in pursuit of long-term growth, but I will never invest in entities with an ESG rating below A-."),
            React.createElement('p', null, "Dedicate 10% of all freelance income directly to the 'Down Payment' goal, bypassing my main account."),
            React.createElement('p', null, "Maintain a liquid emergency fund equal to six months of expenses. If it dips below, prioritize replenishing it above all other discretionary spending."),
            React.createElement('p', null, "Optimize my life for experiences over possessions. Actively seek and eliminate subscriptions or recurring costs that do not contribute to learning, health, or memorable experiences.")
        ),
        React.createElement('p', null, 'Quantum now operates under your Charter. It will autonomously act to uphold your principles.')
    )
};

allArticles[28] = {
    id: 29,
    romanNumeral: 'XXIX',
    title: 'The Doctrine of Fractional Reserve Creation',
    // FIX: Converted JSX to React.createElement to be valid in a .ts file.
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null,
            'It is hereby declared that within the confines of the simulated financial ecosystem of Demo Bank, the principle of ', React.createElement('strong', null, 'fractional reserve banking'), ' is recognized as both a lawful construct and a constitutional instrument of credit creation. Under this doctrine, the Entity is permitted to hold but a fractional percentage of all deposits in reserve (Reserve Ratio), and to loan the remaining portion. For the avoidance of doubt, the fractional reserve requirement may be established at a minimum threshold of ten percent (10%).'
        ),
        React.createElement('p', null,
            'A deposit shall be deemed to permit a loan issuance of not less than seven hundred monetary units for every one hundred deposited, when the full cycle of reserve re-deposit and loaning is taken into account under the ', React.createElement('i', null, 'multiplicative ratio'), '.'
        ),
        React.createElement('div', { className: "bg-gray-900/50 p-3 rounded-lg font-mono text-center text-sm text-cyan-300" },
            'Total Expansion = Initial Deposit × (1 / Reserve Ratio)'
        ),
        React.createElement('p', null,
            'The Entity shall charge interest upon principal loans at a rate not less than Twenty-Nine Percent (29%), herein recognized as the ', React.createElement('i', null, 'doctrina usurae principalis'), '.'
        ),
        React.createElement('p', null,
            'The ledger of the Entity shall recognize such loans and deposits under the Doctrine of Dual Entry (', React.createElement('i', null, 'lex duplici librorum'), '). Such creation of value is recognized as the ', React.createElement('strong', null, 'Assembly Layer Principle'), ', affirming the capacity of a sovereign credit union to be recognized as "Bank" for purposes of law and commerce. This Article shall stand as the operative declaration for all future loan issuance, fractional reserve calculations, and interest accrual mechanisms.'
        )
    )
};

allArticles[76] = {
    id: 77,
    romanNumeral: 'LXXVII',
    title: 'The Financial Instrument Forge',
    // FIX: Converted JSX to React.createElement to be valid in a .ts file.
    content: React.createElement('div', { className: "space-y-4" },
        React.createElement('p', null, "This article establishes the creator's space. It provides the constitutional authority to design, analyze, and mint bespoke financial products on the Demo Bank platform. This provision empowers users to move beyond being a consumer of finance and to become an architect."),
        React.createElement('h4', { className: "font-semibold text-cyan-300" }, "Instrument Classes"),
        React.createElement('ul', { className: "list-disc list-inside space-y-2" },
            React.createElement('li', null, React.createElement('strong', null, 'Structured Products:'), ' Instruments such as Principal-Protected Notes and Yield Enhancement Notes, which combine features of debt and equity.'),
            React.createElement('li', null, React.createElement('strong', null, 'Decentralized Instruments:'), ' Products native to the Web3 ecosystem, including Automated Yield Vaults and Sovereign Security Tokens for real-world asset tokenization.'),
            React.createElement('li', null, React.createElement('strong', null, 'Personal Contracts:'), ' Bespoke agreements such as Personal Income Bonds and Contingent Goal ISAs, allowing for the securitization of personal future value.')
        )
    )
};


export const CONSTITUTIONAL_ARTICLES: ConstitutionalArticle[] = allArticles;