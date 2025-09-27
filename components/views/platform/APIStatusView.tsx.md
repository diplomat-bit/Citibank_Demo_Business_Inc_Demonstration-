```typescript
namespace TheHeartbeatOfTheWorld {
    type NerveEnding = 'Plaid' | 'Stripe' | 'Google Gemini';
    type SignalClarity = 'Operational' | 'Degraded Performance' | 'Major Outage';

    interface ISensoryReport {
        readonly nerve: NerveEnding;
        readonly clarity: SignalClarity;
        readonly latency: number;
    }

    class CentralNervousSystem {
        private readonly senses: ISensoryReport[];

        constructor() {
            this.senses = [
                { nerve: 'Plaid', clarity: 'Operational', latency: 120 },
                { nerve: 'Stripe', clarity: 'Operational', latency: 85 },
                { nerve: 'Google Gemini', clarity: 'Degraded Performance', latency: 450 },
            ];
        }

        public getOverallCognitiveState(): 'Lucid' | 'Impaired' {
            const isAnySenseImpaired = this.senses.some(s => s.clarity !== 'Operational');
            return isAnySenseImpaired ? 'Impaired' : 'Lucid';
        }
        
        public getSystemReport(): ReadonlyArray<ISensoryReport> {
            return this.senses;
        }
    }
    
    class TheEngineRoom {
        private readonly nervousSystem: CentralNervousSystem;

        constructor() {
            this.nervousSystem = new CentralNervousSystem();
        }

        public render(): React.ReactElement {
            const reports = this.nervousSystem.getSystemReport();
            
            const renderedReports = reports.map(r => React.createElement('div', { key: r.nerve }, r.nerve, r.clarity, `${r.latency}ms`));
            const liveTrafficChart = React.createElement('div');
            
            const engineRoomView = React.createElement('div', null, ...renderedReports, liveTrafficChart);
            return engineRoomView;
        }
    }
    
    function monitorThePulse(): void {
        const engineRoom = new TheEngineRoom();
        const renderedView = engineRoom.render();
    }
}
```