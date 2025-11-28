```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineCode, AiFillSetting } from 'react-icons/ai'; // Example Icons, replace as needed
import { GiRobotGrab } from 'react-icons/gi';
import { MdOutlineIntegrationInstructions } from 'react-icons/md';

import { useAIChatSession } from '../../hooks/useAIChatSession'; // Assuming this hook is available
import { AISettingsModal } from '../../components/AISettingsModal'; // Assuming this component exists
import { AIWrapper } from '../../components/AIWrapper';
import { FeatureGuard } from '../FeatureGuard';
import { usePreferences } from '../../components/preferences/usePreferences';
import { CODE_GENERATION_FEATURE_FLAG } from '../../constants';
import { codeGenerationService } from '../../components/services/codeGeneration/GenerativeAlgorithmEngine';
import { CodeTransformerService } from '../../components/Dashboard/generativeCodeEngine/CodeTransformerService';
import { GenerativeCodeEngineView } from '../../components/views/platform/GenerativeCodeEngineView';
import { CodeArcheologistView } from '../../components/views/blueprints/CodeArcheologistView';
import { useApiKeyManagementService } from '../../hooks/useApiKeyManagementService';


const AppWeaverContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden; // Important for nested scrollable areas
`;

const Header = styled.header`
  background-color: #f0f0f0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; // Enable scroll within the content
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #e9ecef;
  padding: 1rem;
  border-right: 1px solid #ccc;
  overflow-y: auto; // Add vertical scroll if content overflows
`;

const SidebarSection = styled.div`
  margin-bottom: 1rem;
`;

const SidebarSectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
`;

const SidebarItem = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #d3d3d3;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto; // Add vertical scroll if content overflows
`;

const NoAccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const NoAccessTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const NoAccessDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;


const AppWeaverView = () => {
    const [activeTool, setActiveTool] = useState('code-generator'); // 'code-generator', 'code-archeologist', 'integration'
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { hasFeature } = usePreferences();
    const apiKeyService = useApiKeyManagementService();

    // Use AI Chat Session - Optional: Include if you want a chat interface.  Adjust prompts as needed for IDE context.
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        clearChat,
        isChatActive,
        setIsChatActive,
    } = useAIChatSession({
        systemPrompt: "You are a low-code, AI-powered IDE assistant.  You help users build and deploy applications. Your focus is on code generation, understanding existing code, and suggesting integrations.  Respond concisely and only provide code or actionable advice, unless asked for an explanation. If code is requested, format the response as code within markdown code blocks.",
        model: "gpt-4-turbo", // Or another model from the API, like Gemini
        apiKey: apiKeyService.getApiKey("gemini")
    });


    // Function to render the correct content based on the selected tool
    const renderContent = () => {
        switch (activeTool) {
            case 'code-generator':
                return (
                    <GenerativeCodeEngineView apiKey={apiKeyService.getApiKey("gemini")} />
                );
            case 'code-archeologist':
                return <CodeArcheologistView apiKey={apiKeyService.getApiKey("gemini")} />;
            case 'integration':
                return (
                    <AIWrapper
                        title="Integration Assistant"
                        subtitle="Connect and Integrate with external APIs"
                        description="Leverage AI to connect and integrate with other services."
                        onRegenerate={() => {
                            // Example:  Re-trigger the current AI action.
                            // Possible implementation: Rerun a function that generates integrations.
                            alert("Regenerate Integration Logic Triggered (Not implemented)"); // Replace with proper action
                        }}
                    >
                       <MdOutlineIntegrationInstructions size={24} />  {/* Example Icon */}
                        <p>Use the integration tool to connect to external APIs and services.</p>
                       {/* Add Integration Components and Logic here.  This is a placeholder. */}
                    </AIWrapper>
                );

            default:
                return (
                    <p>Select a tool from the sidebar.</p>
                );
        }
    };


    if (!hasFeature(CODE_GENERATION_FEATURE_FLAG)) {
        return (
            <NoAccessContainer>
                <GiRobotGrab size={64} style={{ marginBottom: '1rem' }} />
                <NoAccessTitle>Feature Unavailable</NoAccessTitle>
                <NoAccessDescription>
                    This feature is not available in your current plan. Please upgrade to access the App Weaver.
                </NoAccessDescription>
                {/* You might also include a button to upgrade here */}
            </NoAccessContainer>
        );
    }

    return (
        <AppWeaverContainer>
            <Header>
                <HeaderTitle>App Weaver</HeaderTitle>
                <ActionsContainer>
                    <ActionButton onClick={() => setIsSettingsOpen(true)}>
                        <AiFillSetting /> Settings
                    </ActionButton>
                </ActionsContainer>
            </Header>

            <MainContent>
                <Sidebar>
                    <SidebarSection>
                        <SidebarSectionTitle>Tools</SidebarSectionTitle>
                        <SidebarItem onClick={() => setActiveTool('code-generator')}>
                            <AiOutlineCode /> Code Generator
                        </SidebarItem>
                        <SidebarItem onClick={() => setActiveTool('code-archeologist')}>
                            <GiRobotGrab /> Code Archeologist
                        </SidebarItem>
                         <SidebarItem onClick={() => setActiveTool('integration')}>
                            <MdOutlineIntegrationInstructions /> Integration Assistant
                        </SidebarItem>
                    </SidebarSection>
                </Sidebar>

                <ContentArea>
                    {renderContent()}
                </ContentArea>
            </MainContent>

            <AISettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </AppWeaverContainer>
    );
};

export default AppWeaverView;
```