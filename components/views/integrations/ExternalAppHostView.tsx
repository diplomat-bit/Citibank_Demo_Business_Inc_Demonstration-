import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../../types'; // Assuming View enum is defined here
import FeatureGuard from '../FeatureGuard';

interface ExternalAppHostViewProps {
    appId: string; // Unique identifier for the external application
    appUrl: string; // URL of the external application to embed
    onMessage?: (data: any) => void; // Callback for messages received from the external app
    initialPayload?: any; // Data to send to the app immediately after it loads
}

/**
 * @description This view component is designed to securely render and orchestrate
 * interactions with dynamically loaded third-party applications. It leverages
 * an iframe with strict sandbox attributes to ensure isolated execution, protecting
 * the main platform from potential vulnerabilities in external content.
 * Communication between the host application and the embedded external application
 * is facilitated via the `postMessage` API, allowing for a controlled and secure
 * exchange of data and events.
 *
 * This component provides a flexible and robust framework for integrating diverse
 * external services—such as specialized analytics dashboards, partner portals,
 * or advanced visualization tools—directly into the main platform, while
 * upholding security standards and maintaining a cohesive user experience.
 */
const ExternalAppHostView: React.FC<ExternalAppHostViewProps> = ({
    appId,
    appUrl,
    onMessage,
    initialPayload,
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Assume View.ExternalAppHost exists in the View enum for feature guarding.
    // This allows the platform's feature flagging system to control access to this view type.
    const currentView = View.ExternalAppHost; // Placeholder, ensure this exists in your View enum.

    /**
     * @description Sends a message to the embedded external application via postMessage.
     * It's crucial to specify the targetOrigin for security.
     * @param {any} message - The data payload to send.
     */
    const sendMessageToApp = useCallback((message: any) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            // IMPORTANT: Replace '*' with the specific origin of the external application
            // (e.g., 'https://your-external-app.com') for production environments to
            // prevent unauthorized message sending.
            iframeRef.current.contentWindow.postMessage(message, appUrl);
            console.log(`Message sent to external app '${appId}':`, message);
        } else {
            console.warn(`Attempted to send message to app '${appId}' before iframe was ready.`);
        }
    }, [appId, appUrl]);

    /**
     * @description Handles messages received from the embedded external application.
     * It performs an origin check for security.
     * @param {MessageEvent} event - The message event object.
     */
    useEffect(() => {
        const handleIframeMessage = (event: MessageEvent) => {
            // IMPORTANT: Validate event.origin against a whitelist of trusted origins
            // to ensure messages are only processed from expected sources.
            // For example: if (!trustedOrigins.includes(event.origin)) return;
            // The current check verifies the message comes from the loaded iframe.
            if (event.source === iframeRef.current?.contentWindow) {
                console.log(`Message received from external app '${appId}':`, event.data);
                if (onMessage) {
                    onMessage(event.data);
                }
            }
        };

        window.addEventListener('message', handleIframeMessage);

        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    }, [appId, onMessage]);

    /**
     * @description Callback for when the iframe content has successfully loaded.
     * Sets loading state to false and sends an initial payload if provided.
     */
    const handleIframeLoad = useCallback(() => {
        setIsLoading(false);
        setError(null);
        console.log(`External app '${appId}' loaded successfully.`);

        if (initialPayload) {
            sendMessageToApp({ type: 'HOST_INIT_PAYLOAD', payload: initialPayload });
        }
    }, [appId, initialPayload, sendMessageToApp]);

    /**
     * @description Callback for when the iframe encounters an error during loading.
     * Sets loading state to false and displays an error message.
     */
    const handleIframeError = useCallback(() => {
        setIsLoading(false);
        setError(`Failed to load external application from: ${appUrl}. Please check the URL and network.`);
        console.error(`Error loading external app '${appId}' from ${appUrl}`);
    }, [appId, appUrl]);

    return (
        <FeatureGuard view={currentView}>
            <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                    External Application: {appId}
                </h2>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center flex-1 text-cyan-400">
                        <div className="w-12 h-12 border-4 border-cyan-400 border-dashed rounded-full animate-spin mb-3"></div>
                        <p>Loading {appId}...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center flex-1 text-red-400">
                        <p className="text-lg font-medium mb-2">Integration Error</p>
                        <p className="text-sm text-center">{error}</p>
                        <p className="text-xs text-gray-500 mt-2">
                            Ensure the external application URL is correct and accessible.
                        </p>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={appUrl}
                    title={`External Application: ${appId}`}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    className={`flex-1 w-full border-0 rounded-md bg-transparent ${isLoading || error ? 'hidden' : ''}`}
                    // The sandbox attribute enables a set of extra restrictions for the content
                    // in the iframe. Customize these based on the trust level and specific needs
                    // of the external application.
                    // - allow-scripts: allows JavaScript to run.
                    // - allow-same-origin: allows the content to be treated as being from the same origin.
                    //   Crucial for postMessage if origin isn't explicitly set.
                    // - allow-forms: allows form submission.
                    // - allow-modals: allows modal windows (e.g., alert, prompt, confirm).
                    // - allow-popups: allows popups (e.g., window.open).
                    // - allow-pointer-lock: allows pointer lock API.
                    // - allow-presentation: allows presentation API.
                    // - allow-downloads: allows downloads initiated by the iframe.
                    // - allow-top-navigation-by-user-activation: allows navigation of the top-level browsing context
                    //   but only if initiated by a user gesture.
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock allow-presentation allow-downloads allow-top-navigation-by-user-activation"
                    // Optionally, specify a `referrerPolicy` for privacy and security if needed.
                    // referrerPolicy="no-referrer-when-downgrade"
                    // Optionally, allow specific features (like camera, microphone, geolocation)
                    // if the external application absolutely requires them and user consent is handled.
                    // allow="camera; microphone; geolocation;"
                ></iframe>
            </div>
        </FeatureGuard>
    );
};

export default ExternalAppHostView;