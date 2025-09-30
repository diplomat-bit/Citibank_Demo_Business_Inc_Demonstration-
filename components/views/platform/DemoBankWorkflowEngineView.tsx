// components/views/platform/DemoBankWorkflowEngineView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const DemoBankWorkflowEngineView: React.FC = () => {
    const [prompt, setPrompt] = useState("A simple approval workflow: Request -> Manager Approval -> Finance Approval -> Done");
    const [generatedSvg, setGeneratedSvg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // A simplified SVG generation for demonstration purposes. A real implementation would be more complex.
    const generateSvgFromText = (text: string) => {
        const steps = text.split('->').map(s => s.trim().replace(/"/g, ''));
        if (steps.length === 0) return '';
        
        const boxWidth = 140;
        const boxHeight = 60;
        const gap = 50;
        const totalWidth = steps.length * boxWidth + (steps.length - 1) * gap;
        const height = 150;

        let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" /></marker></defs>`;
        
        steps.forEach((step, i) => {
            const x = i * (boxWidth + gap);
            // Box
            svg += `<rect x="${x}" y="50" width="${boxWidth}" height="${boxHeight}" rx="10" fill="#1f2937" stroke="#4b5563" />`;
            // Text with wrapping
            svg += `<foreignObject x="${x}" y="50" width="${boxWidth}" height="${boxHeight}"><body xmlns="http://www.w3.org/1999/xhtml"><div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; text-align:center; color:#e5e7eb; font-size: 12px; padding: 5px; box-sizing: border-box; word-wrap: break-word;">${step}</div></body></foreignObject>`;

            if (i < steps.length - 1) {
                // Arrow
                svg += `<line x1="${x + boxWidth}" y1="${height/2}" x2="${x + boxWidth + gap}" y2="${height/2}" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrow)" />`;
            }
        });
        
        svg += `</svg>`;
        return svg;
    };


    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedSvg('');
        // This is a simulation. A real AI call would generate a more complex graph description (e.g., DOT language or JSON)
        // For this demo, we'll use the prompt directly to generate the SVG to show the concept.
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
             const validationPrompt = `You are a workflow parser. Given the following text, extract the sequential steps, separated by '->'. Return just the steps. Text: "${prompt}"`
             const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: validationPrompt });

            const svg = generateSvgFromText(response.text);
            setGeneratedSvg(svg);
        } catch (e) {
            console.error("Failed to generate workflow", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Workflow Engine</h2>
            <Card title="AI Workflow Visualizer">
                <p className="text-gray-400 mb-4">Describe a simple, linear workflow using "->" to separate steps, and the AI will create a visual diagram.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Generating...' : 'Visualize Workflow'}
                </button>
            </Card>

            {(isLoading || generatedSvg) && (
                <Card title="Generated Workflow">
                     <div className="p-4 bg-gray-900/50 rounded overflow-x-auto">
                        {isLoading ? <p>Generating...</p> : <div dangerouslySetInnerHTML={{ __html: generatedSvg }} />}
                     </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankWorkflowEngineView;