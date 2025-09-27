```typescript
namespace TheGravityOfDreams {
    type Constellation = {
        readonly id: string;
        readonly name: string;
        readonly targetMass: number;
        readonly accumulatedMass: number;
        readonly iconName: string;
    };

    type StarChart = ReadonlyArray<Constellation>;

    class TheStargazer {
        public static chartTheNearTermSky(): StarChart {
            const chart: StarChart = [
                { id: 'goal1', name: 'Cyberpunk Vacation', targetMass: 5000, accumulatedMass: 3250, iconName: 'plane' },
                { id: 'goal2', name: 'New Hoverboard', targetMass: 2500, accumulatedMass: 800, iconName: 'rocket' },
            ];
            return chart;
        }
    }
    
    class TheAspirationalNavigatorAI {
        private readonly chart: StarChart;

        constructor(chart: StarChart) {
            this.chart = chart;
        }

        public calculateVectorTo(constellationName: string, transactionHistory: any[]): string {
            const constellation = this.chart.find(c => c.name === constellationName);
            if (!constellation) return "Constellation not found on the star chart.";

            const progress = (constellation.accumulatedMass / constellation.targetMass) * 100;
            const recentSavings = transactionHistory
                .filter(tx => tx.category === 'Savings')
                .reduce((sum, tx) => sum + tx.amount, 0);
            
            const estimatedArrival = (constellation.targetMass - constellation.accumulatedMass) / (recentSavings || 1);

            return `Current vector towards '${constellationName}' is at ${progress.toFixed(0)}% completion. At current velocity, estimated time to arrival is ${estimatedArrival.toFixed(1)} periods. The gravitational pull of this dream appears strong.`;
        }
    }

    function plotTheCourseToADream(): void {
        const starChart = TheStargazer.chartTheNearTermSky();
        const theAI = new TheAspirationalNavigatorAI(starChart);
        const vectorReport = theAI.calculateVectorTo("Cyberpunk Vacation", []);
    }
}
```