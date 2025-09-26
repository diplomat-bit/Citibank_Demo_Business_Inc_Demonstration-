// components/views/platform/DemoBankFeatureManagementView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const DemoBankFeatureManagementView: React.FC = () => {
    const [prompt, setPrompt] = useState("the new AI Ad Studio feature");
    const [generatedPlan, setGeneratedPlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedPlan(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    stages: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                target: { type: Type.STRING },
                                duration: { type: Type.STRING }
                            }
                        }
                    }
                }
            };
            const fullPrompt = `Generate a 4-stage progressive rollout plan for this new feature: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedPlan(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Feature Management</h2>
            <Card title="AI Rollout Strategy Generator">
                <p className="text-gray-400 mb-4">Describe the feature you want to release.</p>
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full bg-gray-700/50 p-2 rounded text-white"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Generate Rollout Plan'}
                </button>
            </Card>

            {generatedPlan && (
                <Card title="Generated Rollout Plan">
                     <button onClick={() => setGeneratedPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    <div className="space-y-3">
                        {generatedPlan.stages.map((stage: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                                <h4 className="font-semibold text-cyan-300">{stage.name}</h4>
                                <p className="text-sm text-gray-300">Target: {stage.target}</p>
                                <p className="text-xs text-gray-400">Duration: {stage.duration}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankFeatureManagementView;