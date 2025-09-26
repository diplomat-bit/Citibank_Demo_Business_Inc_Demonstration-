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
        const steps = text.split('->').map(s => s.trim());
        const width = steps.length * 150;
        const height = 150;
        let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
        steps.forEach((step, i) => {
            const x = i * 150 + 25;
            svg += `<rect x="${x}" y="50" width="100" height="50" rx="10" fill="#1f2937" stroke="#4b5563" />`;
            svg += `<text x="${x + 50}" y="75" fill="#e5e7eb" text-anchor="middle" alignment-baseline="middle">${step}</text>`;
            if (i < steps.length - 1) {
                svg += `<line x1="${x + 100}" y1="75" x2="${x + 150}" y2="75" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrow)" />`;
            }
        });
        svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" /></marker></defs>`;
        svg += `</svg>`;
        return svg;
    };


    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedSvg('');
        // This is a simulation. A real AI call would generate a more complex graph description (e.g., DOT language or JSON)
        setTimeout(() => {
            const svg = generateSvgFromText(prompt);
            setGeneratedSvg(svg);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Workflow Engine</h2>
            <Card title="AI Workflow Visualizer">
                <p className="text-gray-400 mb-4">Describe a simple, linear workflow, and the AI will create a visual diagram.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-20 bg-gray-700/50 p-2 rounded text-white"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Visualize Workflow'}
                </button>
            </Card>

            {generatedSvg && (
                <Card title="Generated Workflow">
                     <button onClick={() => setGeneratedSvg('')} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                     <div className="p-4 bg-gray-900/50 rounded" dangerouslySetInnerHTML={{ __html: generatedSvg }} />
                </Card>
            )}
        </div>
    );
};

export default DemoBankWorkflowEngineView;