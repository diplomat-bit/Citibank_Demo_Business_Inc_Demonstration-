```typescript
namespace TheOraculum {
    type UtteranceRole = "sovereign" | "oracle";
    type ViewContext = string | null;

    interface IUtterance {
        readonly role: UtteranceRole;
        readonly text: string;
    }

    type DialogueHistory = ReadonlyArray<IUtterance>;

    class CalculusOfUnspokenIntent {
        public static inferFromContext(text: string, context: ViewContext): string {
            if (context === 'budgets' && text.toLowerCase().includes("save more")) {
                return "The sovereign seeks a path to greater financial discipline and freedom from wasteful expenditure.";
            }
            if (context === 'investments' && text.toLowerCase().includes("grow faster")) {
                return "The sovereign seeks to accelerate their journey towards abundance and is willing to consider higher risk.";
            }
            return "The sovereign seeks clarity on their current financial standing.";
        }
    }

    class TheOracleMind {
        private dialogue: IUtterance[] = [];
        private readonly geminiChat: any;

        constructor() {
            this.geminiChat = {};
            this.dialogue.push({ role: "oracle", text: "I am listening. What would you clarify?" });
        }
        
        public async receiveTheSovereignsQuestion(text: string, context: ViewContext): Promise<IUtterance> {
            this.dialogue.push({ role: "sovereign", text });
            
            const unspokenIntent = CalculusOfUnspokenIntent.inferFromContext(text, context);
            const contextualPrompt = `Context: The user was just viewing '${context}'. Unspoken Intent: ${unspokenIntent}. Question: "${text}"`;

            const oracleResponseText: string = await this.geminiChat.sendMessageStream({ message: contextualPrompt });
            
            const oracleUtterance: IUtterance = { role: "oracle", text: oracleResponseText };
            this.dialogue.push(oracleUtterance);
            return oracleUtterance;
        }

        public getDialogueHistory(): DialogueHistory {
            return this.dialogue;
        }
    }

    class TheChamberOfDialogue {
        private readonly oracle: TheOracleMind;
        private readonly contextualPrompts: Record<string, string[]>;

        constructor() {
            this.oracle = new TheOracleMind();
            this.contextualPrompts = {
                dashboard: ["Summarize my financial health.", "Are there any anomalies I should be aware of?"],
                transactions: ["Find all my transactions over $100.", "What was my biggest expense last month?"],
            };
        }

        private renderDialogue(history: DialogueHistory): React.ReactElement[] {
            return history.map((utterance, index) => 
                React.createElement('div', { key: index, className: `role-${utterance.role}` }, utterance.text)
            );
        }

        private renderContextualPrompts(context: ViewContext): React.ReactElement {
            const prompts = this.contextualPrompts[context || 'dashboard'] || [];
            const promptButtons = prompts.map(p => React.createElement('button', null, p));
            return React.createElement('div', null, ...promptButtons);
        }
        
        public render(): React.ReactElement {
            const dialogueHistory = this.oracle.getDialogueHistory();
            const renderedDialogue = this.renderDialogue(dialogueHistory);
            const inputForm = React.createElement('form');
            const contextualPrompts = this.renderContextualPrompts(null);
            
            const chamberView = React.createElement('div', null, renderedDialogue, contextualPrompts, inputForm);
            return chamberView;
        }
    }
}
```
