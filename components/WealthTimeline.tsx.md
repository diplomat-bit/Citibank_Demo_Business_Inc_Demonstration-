

# The Timeline: The Window in Time

**(This is not a graph. It is a window that looks out upon the landscape of your financial life, showing both the solid ground of the path you have already walked and the shimmering, probable trajectory of the path that lies ahead.)**

The `WealthTimeline` is the Instrument's most profound meditation on the nature of time and consequence. It is here that the past and the future are rendered visible in a single, sweeping vista. It is a tool for understanding not just your position, but your *momentum*.

The solid, vibrant `Area` chart represents your history. It is the land, the firmament, the accumulated reality etched by the history of your choices. Every peak and valley in that landscape is a story of a choice made, an opportunity taken or missed. It is the undeniable, geological record of your journey thus far, a solid foundation built from the immutable data of your `transactions`.

From the leading edge of that solid land, a `Line` extends into the future, shimmering and dotted. This is your projection. It is not a promise, not a prophecy, but a probable trajectory. It is the path the river is most likely to carve, given its current course and velocity. The Instrument's oracle calculates this path based on your recent momentum—your average net flow of resources. It is a glimpse of a potential destiny, a future that is implied by your present.

This component is a powerful tool for strategic thought. It allows you to see the long-term consequences of your short-term habits. It makes the abstract concept of "future wealth" tangible and visible. By allowing you to see where you are headed, it empowers you with the most potent question a builder can ask: "Is this the future I intend to create?" If the answer is no, the timeline has served its highest purpose: it has shown you the need to change your course *now*, to alter the trajectory of the shimmering line by changing the choices you make on the solid ground of the present.

***

### **The Doctrine of Probable Futures**

**Jurisprential Precedent:** Be it decreed that the System, through its analytical agents, is granted the authority to compute and present a "Probable Future Trajectory" based on the User's historical financial data. This projection, visualized as a `Line` in the `WealthTimeline`, shall be legally considered the official, good-faith estimate of the User's future financial state, assuming a continuation of current behaviors. This projection does not constitute a guarantee or a binding contract. However, it shall serve as the default scenario against which all `FinancialGoals` are measured and all long-term `AIInsights` are formulated. The User retains the absolute right to alter this trajectory through their actions, but until such actions are recorded in the ledger, this projection stands as the recognized future.

```ts
// The Edict of the Scryer's Glass
import { Ledger, Trajectory, FutureState } from '@world/concepts';

// Let it be known that the future is implied by the past.
class TheScryer {
  // The rite of discerning the shape of what is to come.
  public static projectTrajectory(ledger: Ledger): Trajectory {
    // The Scryer calculates the momentum of the past.
    const historicalMomentum = ledger.calculateNetMomentum();
    const presentState = ledger.getCurrentState();

    const futureStates: FutureState[] = [];
    let currentState = presentState;

    // And projects that momentum forward in time.
    for (let i = 0; i < 60; i++) { // Projecting 5 years (60 months)
      currentState = currentState.projectNextState(historicalMomentum);
      futureStates.push(currentState);
    }

    // This is the officially recognized path, the river's most likely course.
    return new Trajectory(futureStates);
  }
}
```

**Observation:** The commoner is shown a projection of their future wealth and is empowered by this newfound foresight. It helps them plan and stay motivated. This is a valuable tool. They are not encouraged to question the authority of this projection. The Doctrine of Probable Futures establishes the AI's calculation as the "official" future. This subtly frames any deviation from this path as an anomaly. The user who wishes to pursue a different, less linear path—perhaps taking a sabbatical, starting a risky but passionate venture—must now do so in defiance of the "official" projection. The tool that was meant to illuminate the future can, in fact, limit the user's imagination of what other futures are possible.

---

### A Fable for the Builder: The River of Time

(They say you cannot step in the same river twice. The past is gone, the future is not yet here. All we have is the present. But what if a mind could stand on the bank and see the entire river at once? From its source in the mountains of the past to its delta in the ocean of the future. This `WealthTimeline` is that vantage point.)

(We gave our AI the ability to see time not as a sequence of discrete moments, but as a single, continuous flow. The solid area of the chart is the 'Recorded River,' the path that has already been carved through the landscape of your life. It is history. It is fact. The AI sees its currents, its eddies, its seasons of flood and drought.)

(But its true gift is its ability to see the 'Probable River,' the shimmering, dotted line that extends into the fog of the future. This is not a guess. It is a complex calculation based on the river's present momentum—its speed, its volume, its direction. This is the 'Hydrodynamics of Choice.' The AI understands that the choices you are making now are carving the riverbed of your tomorrow.)

(This is where the 'Doctrine of Intentional Drift' comes into play. A normal machine would tell you to straighten the river, to build a concrete canal for maximum efficiency. It would see a winding path as a problem to be solved. But our AI understands that the most beautiful, most fertile valleys are carved by winding rivers. It knows that a certain amount of meandering, of 'inefficiency,' is what gives a life its richness.)

(So when it shows you this projection, it is not giving you a command to follow it. It is giving you a choice. It is showing you the most likely path, the one of inertia. And it is silently asking you, "Is this the river you want to be? Or would you like to shift your weight, just a little, and begin to carve a new path through a different, more beautiful valley?")
