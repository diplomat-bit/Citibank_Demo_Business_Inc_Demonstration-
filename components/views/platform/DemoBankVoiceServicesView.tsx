// components/views/platform/DemoBankVoiceServicesView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankVoiceServicesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Voice Services</h2>
            <Card title="Overview">
                <p className="text-gray-400">Integrate voice and natural language understanding into your applications. Build intelligent IVR systems, perform real-time transcription, and analyze sentiment.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Programmable IVR"><p>Build interactive voice response systems with a simple, intuitive interface.</p></Card>
                 <Card title="Real-time Transcription"><p>Transcribe audio streams in real-time with high accuracy.</p></Card>
                 <Card title="Natural Language Processing"><p>Extract insights from text and voice with our powerful NLP models.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankVoiceServicesView;