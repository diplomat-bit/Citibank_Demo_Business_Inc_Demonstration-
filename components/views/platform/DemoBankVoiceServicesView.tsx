// components/views/platform/DemoBankVoiceServicesView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

const DemoBankVoiceServicesView: React.FC = () => {
    const [prompt, setPrompt] = useState('Welcome to Demo Bank. How can I help you today?');
    const [isPlaying, setIsPlaying] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

    const handleGenerate = () => {
        // In a real app, this would call a text-to-speech API.
        // We will simulate this by setting the prompt text.
        setGeneratedAudio(prompt);
        setIsPlaying(false);
    };
    
    const handlePlay = () => {
        setIsPlaying(true);
        // Simulate audio playback duration
        setTimeout(() => setIsPlaying(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Voice Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><p className="text-3xl font-bold text-white">500k</p><p className="text-sm text-gray-400 mt-1">TTS Chars (24h)</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">1200</p><p className="text-sm text-gray-400 mt-1">Minutes Transcribed</p></Card>
                <Card className="text-center"><p className="text-3xl font-bold text-white">98%</p><p className="text-sm text-gray-400 mt-1">Transcription Accuracy</p></Card>
            </div>
            <Card title="AI Text-to-Speech (TTS) Generator">
                <p className="text-gray-400 mb-4">Enter text to generate a simulated audio playback.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-20 bg-gray-700/50 p-2 rounded text-white"
                />
                <button onClick={handleGenerate} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 rounded">
                    Generate Audio
                </button>
            </Card>

            {generatedAudio && (
                <Card title="Generated Audio">
                    <button onClick={() => setGeneratedAudio(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlay} disabled={isPlaying} className="p-3 bg-cyan-500/20 rounded-full disabled:opacity-50">
                            {isPlaying ? (
                                <svg className="h-6 w-6 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                            ) : (
                                <svg className="h-6 w-6 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                            )}
                        </button>
                        <p className="text-gray-300 italic">"{generatedAudio}"</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankVoiceServicesView;