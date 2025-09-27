```typescript
namespace TheConstellationOfFutures {
    type Conviction = {
        readonly name: "Stocks" | "Bonds" | "Crypto" | "Real Estate";
        readonly value: number;
        readonly beliefSystem: "corporate growth" | "institutional stability" | "decentralized future" | "tangible assets";
        readonly velocity: number;
        readonly aura: string;
    };

    type Portfolio = ReadonlyArray<Conviction>;

    interface IGalaxyOfBelief {
        readonly totalValue: number;
        readonly composition: ReadonlyArray<{ name: string; percentage: number }>;
        readonly weightedVelocity: number;
        readonly theologicalCoherence: "Harmonious" | "Dissonant" | "Balanced";
    }

    class TheologicalCoherenceAnalyzer {
        private static analyzeBeliefSystems(portfolio: Portfolio): IGalaxyOfBelief["theologicalCoherence"] {
            const beliefCounts = portfolio.reduce((acc, conviction) => {
                acc[conviction.beliefSystem] = (acc[conviction.beliefSystem] || 0) + conviction.value;
                return acc;
            }, {} as Record<string, number>);
            
            const highRiskValue = (beliefCounts["corporate growth"] || 0) + (beliefCounts["decentralized future"] || 0);
            const lowRiskValue = (beliefCounts["institutional stability"] || 0) + (beliefCounts["tangible assets"] || 0);
            
            if (highRiskValue / (highRiskValue + lowRiskValue) > 0.8) return "Dissonant";
            if (lowRiskValue / (highRiskValue + lowRiskValue) > 0.8) return "Harmonious";
            return "Balanced";
        }

        public static forgeGalaxyFromPortfolio(portfolio: Portfolio): IGalaxyOfBelief {
            const totalValue = portfolio.reduce((sum, c) => sum + c.value, 0);
            
            const galaxy: IGalaxyOfBelief = {
                totalValue: totalValue,
                composition: portfolio.map(c => ({
                    name: c.name,
                    percentage: (c.value / totalValue) * 100
                })),
                weightedVelocity: totalValue > 0 ? portfolio.reduce((sum, c) => sum + c.value * c.velocity, 0) / totalValue : 0,
                theologicalCoherence: this.analyzeBeliefSystems(portfolio)
            };
            
            return galaxy;
        }
    }

    class TheCelestialObservatory {
        private galaxy: IGalaxyOfBelief;
        
        constructor(portfolio: Portfolio) {
            this.galaxy = TheologicalCoherenceAnalyzer.forgeGalaxyFromPortfolio(portfolio);
        }

        public render(): React.ReactElement {
            const pieChart = React.createElement('div', { 'aria-label': 'Pie Chart of Asset Composition' });
            const valueDisplay = React.createElement('div', null, `Total Value: $${this.galaxy.totalValue.toLocaleString()}`);
            const performanceDisplay = React.createElement('div', null, `YTD Performance: ${this.galaxy.weightedVelocity.toFixed(2)}%`);
            const coherenceDisplay = React.createElement('div', null, `Coherence: ${this.galaxy.theologicalCoherence}`);
            
            const observatoryView = React.createElement('div', null, pieChart, valueDisplay, performanceDisplay, coherenceDisplay);
            return observatoryView;
        }
    }
    
    function mapTheUserConvictions(): void {
        const userPortfolio: Portfolio = [
            { name: "Stocks", value: 40000, beliefSystem: "corporate growth", velocity: 15.2, aura: "#06b6d4" },
            { name: "Crypto", value: 15000, beliefSystem: "decentralized future", velocity: 45.8, aura: "#f59e0b" },
            { name: "Bonds", value: 25000, beliefSystem: "institutional stability", velocity: 4.1, aura: "#6366f1" },
            { name: "Real Estate", value: 20000, beliefSystem: "tangible assets", velocity: 8.5, aura: "#10b981" },
        ];
        
        const observatory = new TheCelestialObservatory(userPortfolio);
        const renderedObservatory = observatory.render();
    }
}
```