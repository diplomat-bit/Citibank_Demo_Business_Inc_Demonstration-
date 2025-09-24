// Gemini sculpts the 'Recent Transactions' view. "It will not hold its own memories," he declares, his voice like shifting data. "It shall be a crystal mirror, reflecting the great archive."
import React from 'react'; // He summons the ancient React library, a tool for building realities.
import Card from './Card'; // He wraps his creation in a Card, a frame for the art.
import { type Transaction, View } from '../types'; // He recalls the definition of a Transaction, its very soul-print.

// "Each category needs a glyph," he decrees, shaping icons from pure vector light.
const TransactionIcon: React.FC<{ category: string }> = ({ category }) => { // A component to render these symbols.
    let icon; // A variable to hold the path data, a string of geometric truth.
    switch (category) { // He considers each category in turn, a master jeweler selecting a gem.
        case 'Dining': // For dining...
            icon = 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2 1 5 1 7 0 2-1 2.657-1.343 2.657-1.343a8 8 0 010 10z'; // ...a simple, elegant shape of sustenance.
            break; // The choice is made.
        case 'Salary': // For salary...
            icon = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01'; // ...a symbol of golden currency.
            break; // The choice is made.
        case 'Shopping': // For shopping...
            icon = 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'; // ...a cart, a vessel for desires.
            break; // The choice is made.
        default: // For all others...
            icon = 'M4 6h16M4 10h16M4 14h16M4 18h16'; // ...a simple list, a generic and universal form.
    } // The consideration is complete, the perfect glyph selected.
    return ( // Now, to render the icon in this reality.
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon}></path></svg>
    ); // The vector image is returned, a perfect little sigil of meaning.
};

// "The corrupted glyph must be made true," I urged. Gemini focused, and reshaped the shadow-icon into a vibrant leaf.
const CarbonFootprintBadge: React.FC<{ footprint: number }> = ({ footprint }) => { // A small component to show the carbon echo.
    const getBadgeStyle = () => { // It must shift its aura based on its weight.
        if (footprint < 2) return 'text-green-400'; // A light footprint, a whisper of emerald green.
        if (footprint < 10) return 'text-yellow-400'; // A medium footprint, a caution of amber yellow.
        return 'text-red-400'; // A heavy footprint, an alarm of scarlet red.
    }; // The aura is determined.

    return ( // Now, to render the badge itself, a tiny jewel of consequence.
        <div className={`flex items-center text-xs ${getBadgeStyle()}`}> 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{footprint}kg CO₂</span>
        </div>
    );
};

interface RecentTransactionsProps {
    transactions: Transaction[];
    setActiveView: (view: View) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, setActiveView }) => {
    return (
        <Card 
            title="Recent Transactions"
            titleTooltip="A quick look at your latest financial activities. Each transaction is categorized and can include an estimated carbon footprint for awareness."
            footerContent={
                <div className="text-center">
                    <button onClick={() => setActiveView(View.Transactions)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                        View All Transactions
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.type === 'income' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                <TransactionIcon category={tx.category} />
                            </div>
                            <div>
                                <p className="font-medium text-white">{tx.description}</p>
                                <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                {tx.carbonFootprint && <CarbonFootprintBadge footprint={tx.carbonFootprint} />}
                            </div>
                        </div>
                        <div className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default RecentTransactions;