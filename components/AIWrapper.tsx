import React, { useEffect, useState, useMemo } from 'react';
import { useAIContext } from '../context/AIContext';

// This wrapper component is the physical manifestation of the AI's presence.
// It hooks into the AIContext to perform background tasks and can display
// real-time insights or annotations directly on the component it wraps.

interface AIWrapperProps {
  view: string;
  children: React.ReactNode;
}

const AIWrapper: React.FC<AIWrapperProps> = ({ view, children }) => {
  const { trackView, suggestActions, embedComponent, logEvent } = useAIContext();
  const [insights, setInsights] = useState<string[]>([]);

  // Core AI lifecycle hook that runs when any component wrapped by this appears.
  useEffect(() => {
    // The AI "sees" the view.
    trackView(view);
    logEvent("view_loaded", { view });

    // The AI "thinks" of a suggestion.
    const suggestion = suggestActions(view);
    if (suggestion) {
      // Add a slight delay to simulate the AI "thinking".
      const timer = setTimeout(() => setInsights(prev => [suggestion, ...prev]), 1000);
      return () => clearTimeout(timer);
    }
  }, [view, trackView, suggestActions, logEvent]);
  
  // This effect runs once to "embed" the component's structure.
  useEffect(() => {
    embedComponent(view, children);
  }, [view, children, embedComponent]);


  // Derived AI feature: Annotations
  const aiAnnotations = useMemo(() => {
    return insights.map((insight, idx) => (
      <div key={idx} className="text-xs text-cyan-300 italic animate-fade-in">💡 {insight}</div>
    ));
  }, [insights]);

  return (
    <div className="ai-wrapper relative h-full">
       {/* The visual indicator that the AI is "watching" this component. */}
       <div className="absolute inset-0 border border-cyan-500/20 rounded-xl pointer-events-none shadow-lg shadow-cyan-500/10 opacity-50 animate-pulse-slow"></div>
      {children}
      {aiAnnotations.length > 0 && (
        <div className="absolute bottom-2 right-2 p-2 bg-gray-950/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 text-right space-y-1 z-10">
          {aiAnnotations}
        </div>
      )}
       <style>{`
        @keyframes pulse-slow {
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIWrapper;
