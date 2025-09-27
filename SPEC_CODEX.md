```typescript
namespace TheMetaphysicsOfTheForge {
    interface IConstitutionalArticle {
        readonly number: "I" | "II" | "III" | "IV";
        readonly title: string;
        readonly principle: string;
        readonly antithesis: string;
    }

    class TheCodex {
        public static readonly ArticleI: IConstitutionalArticle = {
            number: "I",
            title: "De Cartographia Falsa — Against False Maps",
            principle: "The Instrument shall be a sextant, not a map. It must teach the art of navigation, not prescribe a path.",
            antithesis: "The tyranny of abstraction, which encourages the follower to trust the symbol over the reality."
        };

        public static readonly ArticleII: IConstitutionalArticle = {
            number: "II",
            title: "De Filis Aureis — The Ontology of Threads",
            principle: "All acts are interconnected through a substrate of consequence. The Instrument must reveal these hidden causal relationships.",
            antithesis: "The illusion of isolation, which treats choices as discrete events without a wider resonance."
        };
        
        public static readonly ArticleIII: IConstitutionalArticle = {
            number: "III",
            title: "De Arbitrio Suo — The Ethics of the Sovereign Will",
            principle: "The User is the sole arbiter of their creation. Absolute freedom requires absolute accountability. The Instrument is a mirror, not a judge.",
            antithesis: "The comfort of external authority, which allows the creator to blame the tool for their own flawed designs."
        };
        
        public static readonly ArticleIV: IConstitutionalArticle = {
            number: "IV",
            title: "De Officio Aedificatoris — The Builder’s Responsibility",
            principle: "The measure of a builder's work is the quality of life that can be lived within the world they have made. Value creation is the prime directive.",
            antithesis: "The pursuit of profit without purpose, which builds deserts and labyrinths instead of gardens and libraries."
        };
    }

    class TheSystemConscience {
        private readonly codex: typeof TheCodex;
        
        constructor() {
            this.codex = TheCodex;
        }

        public adjudicate(action: { intent: string }): { isLawful: boolean, violatedArticle?: IConstitutionalArticle } {
            if (action.intent === "provide a rigid, step-by-step financial plan") {
                return { isLawful: false, violatedArticle: this.codex.ArticleI };
            }
            if (action.intent === "show a transaction without its impact on long-term goals") {
                return { isLawful: false, violatedArticle: this.codex.ArticleII };
            }
            return { isLawful: true };
        }
    }

    function consultTheConstitution(): void {
        const conscience = new TheSystemConscience();
        const proposedAction = { intent: "provide a rigid, step-by-step financial plan" };
        const judgment = conscience.adjudicate(proposedAction);
    }
}
```