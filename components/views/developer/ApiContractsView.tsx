// components/views/developer/ApiContractsView.tsx
import React, { useState, useEffect } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const ApiContractsView: React.FC = () => {
    const [specContent, setSpecContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [generatedSdk, setGeneratedSdk] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await fetch('/openapi.yaml.txt');
                if (!response.ok) {
                    throw new Error('Failed to load API specification.');
                }
                const text = await response.text();
                setSpecContent(text);
            } catch (error) {
                setSpecContent('Error: Could not load API specification.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpec();
    }, []);

    const handleGenerateSdk = async () => {
        if (!specContent) return;
        setIsGenerating(true);
        setGeneratedSdk('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a senior software engineer. Based on the following OpenAPI 3.0 spec, generate a basic TypeScript client library using 'axios' to interact with this API. Include methods for 'getCurrentUser' and 'listTransactions'. The code should be a single, copy-pasteable snippet. Spec:\n\n${specContent}`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setGeneratedSdk(response.text.replace(/```typescript\n|```/g, '').trim());
        } catch (err) {
            setGeneratedSdk("// Error: Could not generate SDK. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">API Contracts</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="OpenAPI 3.0 Specification" className="max-h-[70vh] flex flex-col">
                    <div className="relative flex-grow">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded h-full overflow-auto">
                            {isLoading ? 'Loading specification...' : specContent}
                        </pre>
                        {specContent && (
                            <button onClick={() => handleCopy(specContent)} className="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded">
                                {copySuccess || 'Copy'}
                            </button>
                        )}
                    </div>
                </Card>
                
                <div className="space-y-6">
                    <Card title="AI Client SDK Generator">
                        <p className="text-sm text-gray-400 mb-4">Generate a basic TypeScript client library from the specification to get started quickly.</p>
                        <button onClick={handleGenerateSdk} disabled={isGenerating} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                            {isGenerating ? 'Generating SDK...' : 'Generate TypeScript SDK'}
                        </button>
                    </Card>

                    {(isGenerating || generatedSdk) && (
                        <Card title="Generated TypeScript SDK" className="max-h-[45vh] flex flex-col">
                            <div className="relative flex-grow">
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded h-full overflow-auto">
                                    {isGenerating ? 'Generating...' : generatedSdk}
                                </pre>
                                {generatedSdk && (
                                     <button onClick={() => handleCopy(generatedSdk)} className="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded">
                                        Copy
                                    </button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApiContractsView;