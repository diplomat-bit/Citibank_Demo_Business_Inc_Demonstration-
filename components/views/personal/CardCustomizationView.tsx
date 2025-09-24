// components/views/personal/CardCustomizationView.tsx
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from '../../Card';

const CardCustomizationView: React.FC = () => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Add a phoenix rising from the center, with its wings made of glowing data streams.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardStory, setCardStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);
    const [metallic, setMetallic] = useState(50);
    const [holo, setHolo] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setBaseImage(`data:${file.type};base64,${base64}`);
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!baseImage || !prompt) return;
        setIsLoading(true); setError(''); setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = baseImage.split(',')[1];
            const mimeType = baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else { setError("The AI didn't return an image. Try a different prompt."); }
        } catch (err) {
            setError("Sorry, I couldn't edit the image. Please try again.");
        } finally { setIsLoading(false); }
    };

     const generateCardStory = async () => {
        setIsStoryLoading(true); setCardStory('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents. Prompt: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: storyPrompt });
            setCardStory(response.text);
        } catch (err) {
            setCardStory("Could not generate a story for this design.");
        } finally { setIsStoryLoading(false); }
    };

    const displayImage = generatedImage || baseImage;
    const cardStyle: React.CSSProperties = { '--metallic-sheen': `${metallic}%` } as React.CSSProperties;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Card Customization Forge</h2>
             <Card title="Design Your Card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                         <p className="text-gray-400 mb-4">1. Upload a base image.</p>
                         <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                         <p className="text-gray-400 my-4">2. Describe your changes with AI.</p>
                         <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Make this image look like a watercolor painting" className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" disabled={isLoading || !baseImage}/>
                         <button onClick={handleGenerate} disabled={isLoading || !baseImage || !prompt} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Image'}</button>
                         {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 mb-2">Card Preview</p>
                        <div style={cardStyle} className={`w-full max-w-sm aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center relative ${holo ? 'holo-effect' : ''}`}>
                            <div className="absolute inset-0 metallic-overlay" style={{ opacity: metallic / 200 }}></div>
                            {isLoading && <div className="text-cyan-300">Generating...</div>}
                            {!isLoading && displayImage && <img src={displayImage} alt="Card Preview" className="w-full h-full object-cover"/>}
                            {!isLoading && !displayImage && <div className="text-gray-500">Upload an image to start</div>}
                        </div>
                    </div>
                </div>
            </Card>
             <Card title="Add Physical Effects">
                <div className="space-y-4">
                    <div><label className="text-gray-300">Metallic Sheen: {metallic}%</label><input type="range" min="0" max="100" value={metallic} onChange={e => setMetallic(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" /></div>
                    <div className="flex items-center justify-between"><label className="text-gray-300">Holographic Effect</label><input type="checkbox" checked={holo} onChange={e => setHolo(e.target.checked)} className="toggle toggle-sm toggle-cyan" /></div>
                </div>
            </Card>
             <Card title="AI-Generated Card Story">
                {isStoryLoading ? <p>Generating story...</p> : cardStory ? <p className="text-gray-300 italic">"{cardStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                 <button onClick={generateCardStory} disabled={isStoryLoading || !displayImage} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm disabled:opacity-50">{isStoryLoading ? 'Writing...' : 'Generate Story'}</button>
             </Card>
            <style>{`
                .toggle-cyan:checked { background-color: #06b6d4; }
                .metallic-overlay { background: linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%); mix-blend-mode: overlay; pointer-events: none; }
                .holo-effect::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(110deg, transparent 20%, #ff00ff, #00ffff, #ffff00, #ff00ff, transparent 80%); animation: holo-spin 8s linear infinite; opacity: 0.2; mix-blend-mode: screen; }
                @keyframes holo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CardCustomizationView;
