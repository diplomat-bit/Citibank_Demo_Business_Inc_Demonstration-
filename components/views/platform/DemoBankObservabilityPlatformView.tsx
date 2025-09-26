// components/views/platform/DemoBankObservabilityPlatformView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const DemoBankObservabilityPlatformView: React.FC = () => {
    const [prompt, setPrompt] = useState("find all 500 errors from the payments API in the last hour");
    const [generatedQuery, setGeneratedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedQuery('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // This prompt is designed to generate a query in a Splunk-like or LogQL-like syntax
            const fullPrompt = `Translate this natural language request into a log query language syntax. Request: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setGeneratedQuery(response.text);
        } catch (error) {
            setGeneratedQuery("Error: Could not generate query.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Observability</h2>
            <Card title="AI Log Query Generator">
                <p className="text-gray-400 mb-4">Describe the logs you want to find.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-20 bg-gray-700/50 p-2 rounded text-white"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Generate Query'}
                </button>
            </Card>

            {generatedQuery && (
                <Card title="Generated Query">
                    <button onClick={() => setGeneratedQuery('')} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded">
                        {generatedQuery}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export default DemoBankObservabilityPlatformView;