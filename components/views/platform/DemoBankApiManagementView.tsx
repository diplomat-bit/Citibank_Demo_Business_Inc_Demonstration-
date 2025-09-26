// components/views/platform/DemoBankApiManagementView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const DemoBankApiManagementView: React.FC = () => {
    const [prompt, setPrompt] = useState("a GET endpoint at /users/{id} that returns a user object");
    const [generatedSpec, setGeneratedSpec] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedSpec('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Generate a simple OpenAPI 3.0 specification in YAML format for the following API endpoint: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setGeneratedSpec(response.text);
        } catch (error) {
            setGeneratedSpec("Error: Could not generate OpenAPI spec.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank API Management</h2>
            <Card title="AI OpenAPI Spec Generator">
                <p className="text-gray-400 mb-4">Describe the API endpoint you want to create.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-20 bg-gray-700/50 p-2 rounded text-white"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Generate Spec'}
                </button>
            </Card>

            {generatedSpec && (
                <Card title="Generated OpenAPI Spec (YAML)">
                    <button onClick={() => setGeneratedSpec('')} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                        {generatedSpec}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export default DemoBankApiManagementView;