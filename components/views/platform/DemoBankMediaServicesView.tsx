// components/views/platform/DemoBankMediaServicesView.tsx
import React from 'react';
import Card from '../../Card';

const DemoBankMediaServicesView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Media Services</h2>
            <Card title="Overview">
                <p className="text-gray-400">A complete suite of tools for broadcast-quality video streaming. Encode, protect, and stream live and on-demand video content to any device.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Video Encoding"><p>Transcode your video files into various adaptive bitrate formats.</p></Card>
                 <Card title="Content Protection"><p>Protect your content with studio-grade DRM technologies.</p></Card>
                 <Card title="Global CDN"><p>Deliver your video content to a global audience with low latency.</p></Card>
            </div>
        </div>
    );
};

export default DemoBankMediaServicesView;