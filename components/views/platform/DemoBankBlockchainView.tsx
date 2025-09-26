// components/views/platform/DemoBankBlockchainView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const DemoBankBlockchainView: React.FC = () => {
    const [prompt, setPrompt] = useState('a simple smart contract to store a single number');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedCode('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Generate a basic Solidity smart contract for the following purpose: "${prompt}". Include comments explaining the code.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setGeneratedCode(response.text);
        } catch (error) {
            setGeneratedCode("Error: Could not generate contract.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Blockchain</h2>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">5</p><p className="text-sm text-gray-400 mt-1">Active Nodes</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1.2M</p><p className="text-sm text-gray-400 mt-1">Transactions Indexed (24h)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">25</p><p className="text-sm text-gray-400 mt-1">Deployed Contracts</p></Card>
            </div>

            <Card title="AI Smart Contract Generator">
                <p className="text-gray-400 mb-4">Describe the smart contract you want to create.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-20 bg-gray-700/50 p-2 rounded text-white"
                    placeholder="e.g., A simple voting contract"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Generate Solidity Code'}
                </button>
            </Card>

            {generatedCode && (
                <Card title="Generated Smart Contract">
                    <button onClick={() => setGeneratedCode('')} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                        {generatedCode}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export default DemoBankBlockchainView;