// components/views/megadashboard/finance/TaxCenterView.tsx
import React from 'react';
import Card from '../../../Card';

const TaxCenterView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">AI Tax Center</h2>
            <Card title="Mission Brief">
                <p className="text-gray-400">A centralized hub for intelligent tax management and compliance. Use our AI tools to automatically find deductions, calculate real-time liabilities, and prepare for filing with unparalleled accuracy.</p>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="AI Receipt Categorization"><p>Our Vision AI automatically scans and categorizes receipts from any source, identifying and tagging tax-deductible expenses instantly.</p></Card>
                 <Card title="Predictive Tax Liability"><p>Get a real-time, AI-powered estimate of your tax liability throughout the year, eliminating surprises and enabling better financial planning.</p></Card>
                 <Card title="AI Audit Risk Detection"><p>Our AI analyzes your financial data and filings against millions of data points to identify potential red flags that could trigger an audit, helping you file with confidence.</p></Card>
            </div>
        </div>
    );
};

export default TaxCenterView;