// components/views/blueprints/AutonomousScientistView.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
// The original import for Card and GoogleGenAI are replaced with local implementations
// to make the file self-contained as per instructions.

// --- Local Card Component (replaces external dependency) ---
interface LocalCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}
const LocalCard: React.FC<LocalCardProps> = ({ title, children, className }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 ${className || ''}`}>
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
        {children}
    </div>
);

// --- Mock GoogleGenAI (replaces external dependency) ---
// This class simulates the behavior of the Google GenAI SDK without
// making actual network requests, allowing the application to be self-contained.
export class MockGenerativeModel {
    private modelName: string;
    constructor(modelName: string) {
        this.modelName = modelName;
    }

    async generateContent(params: { model: string; contents: string }): Promise<{ text: string }> {
        // Simulate different responses based on prompts to create dynamic interaction
        const prompt = params.contents.toLowerCase();
        let response = `(Mock AI response from ${this.modelName} for: "${prompt.substring(0, 100)}...")\n\n`;

        // Extensive conditional logic to provide varied and detailed mock responses
        if (prompt.includes('graphene battery anode limitations')) {
            response = 'Graphene anodes suffer from significant volume expansion during lithiation/delithiation cycles, leading to structural degradation and pulverization. This destabilizes the Solid Electrolyte Interphase (SEI), resulting in continuous electrolyte consumption and irreversible capacity loss. Furthermore, intrinsic limitations in Li+ diffusion kinetics at high current densities hinder rapid charging. Strategies to mitigate these issues include doping with heteroatoms, surface functionalization with polymers or oxides, and forming composites with mechanically robust materials.';
        } else if (prompt.includes('novel, testable hypothesis to mitigate this issue')) {
            response = 'Hypothesis: Incorporating a few-layer boron nitride nanosheet (BNNS) interlayered structure within a nitrogen-doped (N-doped) graphene anode composite will significantly enhance anode stability and electrochemical performance. The BNNS interlayer will act as a mechanical buffer, suppressing graphene pulverization, while the N-doping will provide more active sites for Li+ intercalation, improving kinetics and overall capacity retention. This architecture is hypothesized to reduce volume expansion by >20% and improve cycle life by >30% over N-doped graphene alone.';
        } else if (prompt.includes('design a molecular dynamics simulation')) {
            response = 'Simulation Design: Utilize LAMMPS (Large-scale Atomic/Molecular Massively Parallel Simulator) for Molecular Dynamics (MD) simulations. The system will comprise an N-doped graphene lattice, with a defined percentage of nitrogen substitutions (e.g., 3-5 at.%), and vertically aligned BNNS interlayers. Li+ ions and a model electrolyte (e.g., ethylene carbonate/dimethyl carbonate) will be included. Key parameters to vary: N-doping concentration, BNNS layer thickness and spacing, and temperature (298-333 K). Metrics to measure: lattice strain evolution during Li+ intercalation, Li+ diffusion coefficient, binding energy of Li+ to active sites, and structural integrity after multiple simulated cycles. Compare results against pristine graphene and only N-doped graphene models. The output will include atomic trajectories, energy profiles, and mean square displacement calculations.';
        } else if (prompt.includes('simulated experiment results')) {
             response = 'Simulated Experiment Results Summary: The MD simulations revealed that the N-doped graphene with BNNS interlayers exhibited a remarkable 28.5% reduction in average lattice strain compared to N-doped graphene without BNNS after 200 simulated lithiation cycles. The Li+ diffusion coefficient in the composite structure was measured at 0.35 x 10^-7 cm²/s, a 20% increase over the N-doped counterpart, attributed to optimized diffusion pathways. Capacity retention after 500 equivalent cycles was projected at 91%, far surpassing the 75% for N-doped graphene. These findings strongly suggest improved durability and enhanced kinetics.';
        } else if (prompt.includes('brief abstract summarizing our experiment')) {
            response = 'Abstract: This computational study explores a novel anode material strategy for lithium-ion batteries, integrating nitrogen-doped graphene with boron nitride nanosheet interlayers. Through molecular dynamics simulations, we demonstrate that this composite architecture significantly mitigates lattice strain (28.5% reduction) and enhances Li+ diffusion kinetics (20% increase) compared to conventional N-doped graphene. The projected electrochemical performance indicates superior cycle life and stability, positioning this design as a promising candidate for next-generation high-performance battery anodes. Our findings underscore the critical role of multi-material heterostructures in overcoming inherent limitations of 2D materials.';
        } else if (prompt.includes('break down the goal')) {
            response = `Sub-objectives for "${params.contents.replace('break down the goal: ', '')}":\n1. Conduct an exhaustive literature review on current battery anode materials and their limitations.\n2. Propose novel material hypotheses based on identified challenges and opportunities.\n3. Design and simulate computational experiments (MD, DFT, electrochemical models) to test hypotheses.\n4. Analyze simulation data to extract key performance metrics and structural insights.\n5. Refine hypotheses and experimental designs iteratively based on results.\n6. Synthesize promising materials (simulated) and characterize their properties.\n7. Generate a comprehensive scientific report detailing findings, conclusions, and future directions.`;
        } else if (prompt.includes('material properties of')) {
            const material = prompt.match(/material properties of ([\w\s]+)/)?.[1] || 'unknown material';
            const randomDensity = (Math.random() * 5 + 1).toFixed(2);
            const randomConductivity = (Math.random() * 1000 + 10).toFixed(2);
            const randomBandGap = (Math.random() * 5).toFixed(2);
            const randomStrength = (Math.random() * 100 + 10).toFixed(2);
            response = `Simulated properties for ${material}:\n- Density: ${randomDensity} g/cm³\n- Electrical Conductivity: ${randomConductivity} S/cm\n- Band Gap: ${randomBandGap} eV\n- Mechanical Strength: ${randomStrength} GPa.\nThese values are based on typical ranges for similar materials and adjusted for potential doping effects.`;
        } else if (prompt.includes('propose a new material candidate')) {
            response = 'New Material Candidate: Lithium Manganese Iron Phosphate (LMFP) doped with Vanadium (V) and coated with a thin layer of reduced Graphene Oxide (rGO). Rationale: LMFP offers high voltage, good safety, and abundant elements; V-doping enhances intrinsic conductivity and rate capability; rGO coating improves electronic pathways and mitigates capacity fade from particle aggregation. This combination aims for a cathode with superior energy density, power density, and cycle stability.';
        } else if (prompt.includes('optimal synthesis parameters for')) {
            const material = prompt.match(/optimal synthesis parameters for ([\w\s]+)/)?.[1] || 'unknown material';
            response = `Optimal synthesis parameters for ${material} via a solvothermal route:\n- Temperature: 180-220°C\n- Duration: 18-24 hours\n- Solvent: N,N-dimethylformamide (DMF) or ethanol/water mixture\n- Precursor ratios: Specific to desired stoichiometry (e.g., Li:Mn:Fe:P = 1:0.5:0.5:1, V = 2% molar)\n- Post-annealing: 700°C for 5h under reducing (Ar/H2) atmosphere to enhance crystallinity and remove residual carbon.`;
        } else if (prompt.includes('identify key experimental metrics')) {
            response = 'Key Experimental Metrics for Battery Anodes:\n1. Specific Capacity (mAh/g): Initial and reversible capacity.\n2. Initial Coulombic Efficiency (%): Ratio of discharge to charge capacity in the first cycle.\n3. Cycle Life (Capacity Retention over cycles): Percentage of initial capacity retained after a specified number of cycles (e.g., 500, 1000).\n4. Rate Capability: Capacity performance at various C-rates (e.g., 0.1C, 0.5C, 1C, 2C).\n5. Impedance Spectroscopy (EIS): To analyze charge transfer resistance and SEI properties.\n6. Volume Expansion (%): Measured via operando techniques.\n7. Structural Integrity: Monitored with XRD, TEM, SEM post-cycling.';
        } else if (prompt.includes('analyze simulated data for trends')) {
             response = 'Data Analysis Result: A clear inverse relationship was identified between BNNS interlayer thickness and observed lattice strain, with optimal performance at 2-3 layers. Higher N-doping concentrations (above 5 at.%) showed marginal improvements in Li+ diffusion but led to increased defect formation and localized strain points. The analysis suggests a sweet spot for both BNNS content and N-doping to achieve maximum benefit, with a trade-off between kinetics and structural robustness. Specific capacity appears to peak at an intermediate doping level.';
        } else if (prompt.includes('refine hypothesis')) {
            response = 'Refined Hypothesis: The optimal nitrogen doping concentration for graphene-BNNS composites for battery anodes should be precisely tuned between 3-4 at.% with 2-3 BNNS interlayers to achieve the best balance of enhanced Li+ diffusion kinetics and long-term structural integrity. Further refinement could explore surface functionalization of BNNS or graphene edges with electron-donating groups to further reduce interfacial impedance.';
        } else if (prompt.includes('generate comprehensive report')) {
            response = `Comprehensive Report Summary: This research cycle successfully demonstrated the efficacy of a BNNS-interlayered, N-doped graphene composite for advanced Li-ion battery anodes. Key findings include improved strain resilience, superior Li+ diffusivity, and projected enhanced cycle life. Recommendations for future work involve optimizing doping profiles and exploring alternative intercalation chemistries.\n\nAbstract:\nThis report details an autonomous research campaign targeting novel high-performance battery anode materials. Utilizing a multi-stage AI agent, the research explored N-doped graphene/BNNS composites through advanced computational simulations...\n\nIntroduction:\nThe demand for high energy density and long-lasting batteries necessitates the discovery of next-generation electrode materials...\n\nHypotheses:\n1. N-doped graphene with BNNS interlayers will improve cycle life.\n2. Specific doping concentrations optimize Li+ kinetics.\n\nMethodology & Experiments:\nPerformed MD and DFT simulations on various composite configurations. Material characterization was simulated...\n\nResults:\nSimulations confirmed reduced strain (28.5%) and enhanced Li+ diffusion (20%). Capacity retention projected at 91%...\n\nDiscussion:\nThe findings validate the initial hypothesis, highlighting the synergistic effects of doping and nanostructuring...\n\nConclusion:\nN-doped graphene/BNNS composites represent a significant advancement for Li-ion anodes, offering improved stability and kinetics...\n\nFuture Work:\nExplore different heteroatom dopants, optimize synthesis parameters, and conduct full-cell simulations.\n\nCitations:\n[1] A. Smith et al., "Graphene Degradation Mechanisms," J. Mat. Sci., 2020.\n[2] B. Jones et al., "Boron Nitride in Batteries," Adv. Energy Mat., 2021.`;
        } else if (prompt.includes('identify potential safety risks')) {
            response = 'Potential Safety Risks:\n1. Thermal Runaway: Exacerbated by dendrite formation on the anode, leading to short circuits and exothermic reactions.\n2. Electrolyte Decomposition: High voltages or temperatures can cause irreversible breakdown of the electrolyte, generating flammable gases.\n3. Material Toxicity: Some precursor chemicals used in synthesis (e.g., nitrogen sources) or byproducts might be toxic.\n4. Mechanical Stress: Swelling and contraction of anode materials can lead to cell casing rupture.\n5. Overcharging/Overdischarging: Can lead to irreversible damage, gas generation, or thermal events.';
        } else if (prompt.includes('suggest characterization techniques')) {
            response = 'Suggested Characterization Techniques:\n- X-ray Diffraction (XRD): For crystal structure, phase identification, and lattice parameter determination.\n- Transmission Electron Microscopy (TEM) / Scanning Electron Microscopy (SEM): For morphology, particle size, and elemental mapping (EDX).\n- X-ray Photoelectron Spectroscopy (XPS): For surface elemental composition and chemical states (e.g., confirming N-doping).\n- Cyclic Voltammetry (CV) / Galvanostatic Charge-Discharge (GCD) / Electrochemical Impedance Spectroscopy (EIS): For comprehensive electrochemical performance assessment.\n- Raman Spectroscopy: To assess carbon lattice quality, defects, and doping effects.\n- Thermogravimetric Analysis (TGA): To evaluate thermal stability and composition.';
        } else if (prompt.includes('design a new experiment based on')) {
            response = `New Experiment Design: Design an *operando* X-ray Diffraction (XRD) experiment to directly monitor the structural evolution of the N-doped graphene/BNNS composite anode during lithiation/delithiation cycles. This will provide real-time insight into lattice strain, phase transitions, and volume changes. Parameters: Synchrotron light source, C-rate 0.1C to 1C, temperature range 25-50°C. Complement with *ex-situ* TEM/SEM analysis after 100 and 500 cycles to observe morphological changes and SEI stability.`;
        } else if (prompt.includes('evaluate simulated cost implications')) {
            response = 'Simulated Cost Implications: The introduction of boron nitride nanosheets adds an estimated 15-25% to the raw material cost per kg of anode material, depending on the synthesis route for BNNS. However, the projected 30% improvement in cycle life and capacity retention could lead to a 10-15% reduction in the total cost of ownership over the battery\'s lifespan, due to increased durability and fewer replacement cycles. Production scale-up of BNNS remains a key cost challenge.';
        } else if (prompt.includes('predict performance under extreme conditions')) {
            response = 'Performance Prediction under Extreme Conditions:\n- Extreme Cold (-20°C): Predicted to retain ~70% of room temperature capacity at 0.1C due to reduced Li+ kinetics and increased electrolyte viscosity. Internal resistance will increase by ~30%.\n- High Heat (60°C): Predicted to maintain >90% capacity retention at 0.5C, but accelerated SEI growth and potential electrolyte decomposition are concerns over extended cycling. Close monitoring for thermal runaway indicators is essential.\n- High C-Rate (5C): Expected to deliver ~60% of 0.1C capacity, demonstrating decent power capability but with increased polarization.';
        } else if (prompt.includes('formulate a counter-hypothesis')) {
            response = 'Counter-Hypothesis: The observed reduction in lattice strain in the N-doped graphene/BNNS composite is primarily a physical stiffening effect from the inert BNNS layers, which merely delays fracture rather than enhancing fundamental electrochemical activity. This suggests the composite might achieve mechanical stability but without significant improvements in intrinsic specific capacity or charge transfer beyond simple N-doping, potentially leading to lower practical energy densities if the BNNS layers are too thick or dense.';
        } else if (prompt.includes('critique the experimental setup')) {
            response = 'Critique of Experimental Setup: While the MD simulations provided valuable insights into strain and diffusion, they simplify the complex electrochemical environment. Key limitations include:\n1. Simplified Electrolyte Model: A more realistic electrolyte model, incorporating ionic liquids or solid electrolytes, would better capture interfacial phenomena.\n2. SEI Formation: The dynamic and heterogeneous formation of the Solid Electrolyte Interphase (SEI) was not fully captured, which is critical for long-term stability.\n3. Quantum Effects: MD is classical; quantum effects, especially at interfaces, might play a role not accounted for.\n4. Scale: Atomistic simulations are limited to nanoscale; mesoscale or continuum models would be needed for larger structures.';
        } else if (prompt.includes('suggest optimization strategies')) {
             response = 'Optimization Strategies: \n1. Bayesian Optimization: For intelligently exploring the multi-dimensional parameter space (N-doping, BNNS thickness, electrolyte composition) to find optimal material configurations. \n2. Genetic Algorithms: To evolve material compositions and nanostructures for improved performance against defined fitness functions (e.g., high capacity, long cycle life). \n3. Active Learning: Integrating simulation results with machine learning models to guide subsequent simulations and reduce computational cost.';
        } else if (prompt.includes('material selection criteria for anode')) {
             response = 'Material Selection Criteria for Anodes:\n1. High Theoretical Specific Capacity: To maximize energy density.\n2. Low Volume Expansion: To ensure structural stability during cycling.\n3. Good Li+ Diffusion Kinetics: For high power density and fast charging.\n4. Stable Solid Electrolyte Interphase (SEI) Formation: To prevent continuous electrolyte consumption and improve safety.\n5. Low Average Operating Voltage vs. Li/Li+: To maximize cell voltage.\n6. Abundance and Low Cost of Constituent Elements: For commercial viability.\n7. Good Electronic Conductivity: To minimize internal resistance.\n8. Safety: Non-toxic, thermally stable.';
        } else if (prompt.includes('explain the phenomenon of')) {
            const phenomenon = prompt.match(/explain the phenomenon of ([\w\s]+)\./)?.[1] || 'an unspecified scientific phenomenon';
            if (phenomenon.includes('dendrite formation')) {
                response = 'Dendrite formation in lithium-ion batteries refers to the uncontrolled, tree-like growth of metallic lithium on the anode surface, typically during charging. This occurs when Li+ ions plate unevenly onto the anode, often at defects or areas of high current density. Dendrites can pierce the separator, leading to internal short circuits, thermal runaway, and ultimately cell failure. It\'s a major safety concern, especially with high-capacity anodes.';
            } else if (phenomenon.includes('solid electrolyte interphase')) {
                response = 'The Solid Electrolyte Interphase (SEI) is a passivating layer formed on the surface of the anode (and sometimes cathode) of a lithium-ion battery during the initial charge-discharge cycles. It results from the decomposition of electrolyte components due to their electrochemical instability at the electrode surface. A stable SEI is crucial for battery performance as it allows Li+ ions to pass through while preventing further electrolyte decomposition, thereby protecting the electrode and ensuring long cycle life. An unstable SEI can lead to continuous growth, consuming active lithium and electrolyte, and causing capacity fade.';
            } else {
                response = `Simulated explanation for ${phenomenon}: This phenomenon is complex and involves interactions at multiple scales. In essence, it describes the process where X leads to Y, often mediated by Z. Further research is needed for a comprehensive understanding.`;
            }
        }

        // Add some variability and simulated processing time
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
        return { text: response };
    }
}

export class MockGoogleGenAI {
    public models: {
        generateContent: (params: { model: string; contents: string }) => Promise<{ text: string }>;
    };

    constructor(params: { apiKey: string }) {
        // API Key is ignored for mock purposes
        this.models = {
            generateContent: (params) => new MockGenerativeModel(params.model).generateContent(params),
        };
    }
}
// END Mock GoogleGenAI

// --- Data Structures for the Autonomous Scientist ---

export enum ResearchPhase {
    IDLE = 'IDLE',
    GOAL_DEFINITION = 'GOAL_DEFINITION',
    LITERATURE_REVIEW = 'LITERATURE_REVIEW',
    HYPOTHESIS_GENERATION = 'HYPOTHESIS_GENERATION',
    EXPERIMENT_DESIGN = 'EXPERIMENT_DESIGN',
    SIMULATION_EXECUTION = 'SIMULATION_EXECUTION',
    DATA_ANALYSIS = 'DATA_ANALYSIS',
    HYPOTHESIS_REFINEMENT = 'HYPOTHESIS_REFINEMENT',
    REPORT_GENERATION = 'REPORT_GENERATION',
    ITERATION_CYCLE = 'ITERATION_CYCLE', // Represents a full loop
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    SELF_CORRECTION = 'SELF_CORRECTION',
    RESOURCE_MANAGEMENT = 'RESOURCE_MANAGEMENT',
}

export interface MaterialProperty {
    name: string;
    value: number | string | boolean;
    unit?: string;
    description?: string;
    source?: 'simulated' | 'experimental' | 'literature';
}

export interface MaterialComposition {
    elements: { [key: string]: number }; // e.g., { 'Li': 1, 'Mn': 2, 'O': 4 }
    structure?: string; // e.g., 'layered', 'spinel', 'graphene heterostructure'
    dopants?: { [key: string]: number }; // e.g., { 'N': 0.05 } for 5% nitrogen doping
}

export interface Material {
    id: string;
    name: string;
    composition: MaterialComposition;
    properties: MaterialProperty[];
    discoveryDate: string;
    synthesisMethod?: string;
    potentialApplications: string[];
    stabilityScore?: number; // 0-100
    performanceScore?: number; // 0-100
}

export interface Hypothesis {
    id: string;
    text: string;
    targetProperty: string; // e.g., 'battery capacity', 'strength'
    predictedEffect: string;
    evidence: string[]; // references to literature or previous experiments
    status: 'proposed' | 'tested' | 'supported' | 'refuted' | 'refined' | 'pending_retest';
    priority: 'high' | 'medium' | 'low';
}

export interface ExperimentParameter {
    name: string;
    value: number | string | boolean;
    unit?: string;
    range?: [number, number]; // For parameter sweeps
    optimizationTarget?: 'maximize' | 'minimize' | 'stabilize';
}

export interface Experiment {
    id: string;
    name: string;
    type: 'simulation' | 'synthesis' | 'characterization' | 'validation' | 'optimization';
    hypothesisId: string; // The hypothesis this experiment aims to test
    materialId?: string; // The material being tested/synthesized
    parameters: ExperimentParameter[];
    status: 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'aborted';
    results: ExperimentResult | null;
    designRationale: string;
    costEstimate: number; // simulated cost in USD
    timeEstimate: number; // simulated hours
    priority: 'high' | 'medium' | 'low';
    associatedAPICalls: string[]; // e.g., ['runMolecularDynamics', 'characterizeMaterial']
}

export interface ExperimentResultMetric {
    name: string;
    value: number | string;
    unit?: string;
    deviation?: number; // from expected
    trend?: 'increasing' | 'decreasing' | 'stable' | 'anomalous';
    interpretation?: string;
}

export interface ExperimentResult {
    id: string;
    experimentId: string;
    dataPoints: { [key: string]: number[] | string[] }; // e.g., { 'cycle_number': [...], 'capacity': [...] }
    metrics: ExperimentResultMetric[];
    analysisSummary: string;
    rawLog?: string; // Simulated raw output from a computational engine or lab instrument
    interpretation: string;
    conclusion: 'supported' | 'refuted' | 'inconclusive' | 'partial_support';
    confidenceScore: number; // 0-1
}

export interface AgentDecision {
    timestamp: string;
    phase: ResearchPhase;
    description: string;
    details: any;
    outcome?: 'success' | 'failure' | 'neutral';
    reasoning?: string;
}

export interface ResearchReport {
    id: string;
    title: string;
    author: string; // 'Autonomous Scientist'
    date: string;
    abstract: string;
    introduction: string;
    hypotheses: Hypothesis[];
    experiments: Experiment[];
    resultsSummary: string;
    discussion: string;
    conclusion: string;
    futureWork: string;
    citations: string[];
    generatedByAI: boolean;
    recommendations: string[];
}

// --- Simulated Database / Knowledge Base ---
export class MaterialDatabase {
    private static materials: Material[] = [
        {
            id: 'mat-001', name: 'Graphene', composition: { elements: { 'C': 1 } },
            properties: [{ name: 'Density', value: 2.2, unit: 'g/cm³' }, { name: 'Conductivity', value: 10000, unit: 'S/cm' }, { name: 'Band Gap', value: 0, unit: 'eV' }],
            discoveryDate: '2004-10-22', synthesisMethod: 'Mechanical exfoliation, CVD', potentialApplications: ['batteries', 'composites', 'electronics'], stabilityScore: 70, performanceScore: 65,
        },
        {
            id: 'mat-002', name: 'Lithium Cobalt Oxide (LCO)', composition: { elements: { 'Li': 1, 'Co': 1, 'O': 2 } },
            properties: [{ name: 'Density', value: 4.9, unit: 'g/cm³' }, { name: 'Theoretical Capacity', value: 274, unit: 'mAh/g' }, { name: 'Voltage Range', value: '3.6-4.2', unit: 'V' }],
            discoveryDate: '1980-01-01', synthesisMethod: 'Solid-state reaction', potentialApplications: ['cathode material', 'portable electronics'], stabilityScore: 80, performanceScore: 75,
        },
        {
            id: 'mat-003', name: 'Boron Nitride Nanosheets (BNNS)', composition: { elements: { 'B': 1, 'N': 1 } },
            properties: [{ name: 'Density', value: 2.2, unit: 'g/cm³' }, { name: 'Thermal Conductivity', value: 2000, unit: 'W/mK' }, { name: 'Band Gap', value: 5.9, unit: 'eV' }],
            discoveryDate: '1990-01-01', synthesisMethod: 'Chemical Vapor Deposition', potentialApplications: ['dielectrics', 'composites', 'thermal management'], stabilityScore: 90, performanceScore: 50,
        },
        {
            id: 'mat-004', name: 'Silicon Anode', composition: { elements: { 'Si': 1 } },
            properties: [{ name: 'Theoretical Capacity', value: 4200, unit: 'mAh/g' }, { name: 'Volume Expansion', value: 300, unit: '%' }],
            discoveryDate: '1980-01-01', synthesisMethod: 'Various', potentialApplications: ['high-capacity anodes'], stabilityScore: 40, performanceScore: 90,
        },
        {
            id: 'mat-005', name: 'Lithium Iron Phosphate (LFP)', composition: { elements: { 'Li': 1, 'Fe': 1, 'P': 1, 'O': 4 } },
            properties: [{ name: 'Voltage', value: 3.3, unit: 'V' }, { name: 'Safety', value: 'High' }],
            discoveryDate: '1997-01-01', synthesisMethod: 'Hydrothermal, Solid-state', potentialApplications: ['cathode material', 'EV batteries'], stabilityScore: 95, performanceScore: 60,
        },
        {
            id: 'mat-006', name: 'Nickel-Manganese-Cobalt (NMC) 811', composition: { elements: { 'Ni': 0.8, 'Mn': 0.1, 'Co': 0.1, 'O': 2 } },
            properties: [{ name: 'Energy Density', value: 250, unit: 'Wh/kg' }, { name: 'Cycle Stability', value: 'Moderate' }],
            discoveryDate: '2015-01-01', synthesisMethod: 'Co-precipitation', potentialApplications: ['EV batteries', 'high energy cathodes'], stabilityScore: 75, performanceScore: 85,
        },
        {
            id: 'mat-007', name: 'Tin Sulfide (SnS2)', composition: { elements: { 'Sn': 1, 'S': 2 } },
            properties: [{ name: 'Band Gap', value: 2.2, unit: 'eV' }, { name: 'Theoretical Capacity', value: 645, unit: 'mAh/g' }],
            discoveryDate: '2000-01-01', synthesisMethod: 'Hydrothermal', potentialApplications: ['anode material', 'photocatalysis'], stabilityScore: 60, performanceScore: 70,
        },
        {
            id: 'mat-008', name: 'Perovskite (CH3NH3PbI3)', composition: { elements: { 'C': 1, 'H': 3, 'N': 1, 'Pb': 1, 'I': 3 } },
            properties: [{ name: 'Power Conversion Efficiency', value: 25, unit: '%' }, { name: 'Band Gap', value: 1.57, unit: 'eV' }],
            discoveryDate: '2009-01-01', synthesisMethod: 'Solution processing', potentialApplications: ['solar cells', 'LEDs'], stabilityScore: 30, performanceScore: 90,
        },
        {
            id: 'mat-009', name: 'Sodium-ion Battery Cathode (NaxMnO2)', composition: { elements: { 'Na': 0.7, 'Mn': 1, 'O': 2 } },
            properties: [{ name: 'Voltage', value: 2.7, unit: 'V' }, { name: 'Cost', value: 'Low' }],
            discoveryDate: '2010-01-01', synthesisMethod: 'Solid-state', potentialApplications: ['sodium-ion batteries'], stabilityScore: 80, performanceScore: 60,
        },
        {
            id: 'mat-010', name: 'Solid Electrolyte (LLZO)', composition: { elements: { 'Li': 7, 'La': 3, 'Zr': 2, 'O': 12 } },
            properties: [{ name: 'Ionic Conductivity', value: 1e-4, unit: 'S/cm' }, { name: 'Electrochemical Stability', value: 'High' }],
            discoveryDate: '2007-01-01', synthesisMethod: 'Solid-state reaction', potentialApplications: ['solid-state batteries'], stabilityScore: 90, performanceScore: 70,
        },
        // Adding more diverse materials for richer simulation data
        { id: 'mat-011', name: 'Titanium Dioxide (TiO2)', composition: { elements: { 'Ti': 1, 'O': 2 } }, properties: [{ name: 'Band Gap', value: 3.2, unit: 'eV' }], discoveryDate: '1910-01-01', potentialApplications: ['pigments', 'photocatalysis', 'anodes'], stabilityScore: 90, performanceScore: 40, },
        { id: 'mat-012', name: 'Molybdenum Disulfide (MoS2)', composition: { elements: { 'Mo': 1, 'S': 2 } }, properties: [{ name: 'Band Gap', value: 1.8, unit: 'eV' }], discoveryDate: '1960-01-01', potentialApplications: ['lubricants', 'electronics', 'batteries'], stabilityScore: 75, performanceScore: 60, },
        { id: 'mat-013', name: 'MXene (Ti3C2Tx)', composition: { elements: { 'Ti': 3, 'C': 2 } }, properties: [{ name: 'Conductivity', value: 7000, unit: 'S/cm' }], discoveryDate: '2011-01-01', potentialApplications: ['supercapacitors', 'batteries'], stabilityScore: 65, performanceScore: 80, },
        { id: 'mat-014', name: 'Lithium Sulfide (Li2S)', composition: { elements: { 'Li': 2, 'S': 1 } }, properties: [{ name: 'Theoretical Capacity', value: 1166, unit: 'mAh/g' }], discoveryDate: '1980-01-01', potentialApplications: ['Li-S batteries (cathode)'], stabilityScore: 50, performanceScore: 85, },
        { id: 'mat-015', name: 'Black Phosphorus', composition: { elements: { 'P': 1 } }, properties: [{ name: 'Band Gap', value: 0.3, unit: 'eV' }], discoveryDate: '1865-01-01', potentialApplications: ['transistors', 'batteries'], stabilityScore: 45, performanceScore: 75, },
        { id: 'mat-016', name: 'Graphitic Carbon Nitride (g-C3N4)', composition: { elements: { 'C': 3, 'N': 4 } }, properties: [{ name: 'Band Gap', value: 2.7, unit: 'eV' }], discoveryDate: '1990-01-01', potentialApplications: ['photocatalysis', 'energy storage'], stabilityScore: 80, performanceScore: 55, },
        { id: 'mat-017', name: 'Vanadium Oxide (V2O5)', composition: { elements: { 'V': 2, 'O': 5 } }, properties: [{ name: 'Capacity', value: 294, unit: 'mAh/g' }], discoveryDate: '1830-01-01', potentialApplications: ['cathodes', 'supercapacitors'], stabilityScore: 70, performanceScore: 60, },
        { id: 'mat-018', name: 'Zinc Oxide (ZnO)', composition: { elements: { 'Zn': 1, 'O': 1 } }, properties: [{ name: 'Band Gap', value: 3.37, unit: 'eV' }], discoveryDate: '1800-01-01', potentialApplications: ['electronics', 'sensors'], stabilityScore: 90, performanceScore: 30, },
        { id: 'mat-019', name: 'Iron Sulfide (FeS2)', composition: { elements: { 'Fe': 1, 'S': 2 } }, properties: [{ name: 'Theoretical Capacity', value: 894, unit: 'mAh/g' }], discoveryDate: '1700-01-01', potentialApplications: ['secondary batteries'], stabilityScore: 60, performanceScore: 70, },
        { id: 'mat-020', name: 'Aluminum (Al)', composition: { elements: { 'Al': 1 } }, properties: [{ name: 'Density', value: 2.7, unit: 'g/cm³' }], discoveryDate: '1825-01-01', potentialApplications: ['current collectors', 'structural'], stabilityScore: 99, performanceScore: 10, },
    ];

    static async fetchMaterialById(id: string): Promise<Material | undefined> {
        await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Simulate async
        return MaterialDatabase.materials.find(m => m.id === id);
    }

    static async searchMaterials(query: string, limit: number = 10): Promise<Material[]> {
        await new Promise(r => setTimeout(r, 100 + Math.random() * 100)); // Simulate async
        const lowerQuery = query.toLowerCase();
        return MaterialDatabase.materials
            .filter(m =>
                m.name.toLowerCase().includes(lowerQuery) ||
                m.potentialApplications.some(app => app.toLowerCase().includes(lowerQuery)) ||
                Object.keys(m.composition.elements).some(el => el.toLowerCase().includes(lowerQuery)) ||
                (m.composition.dopants && Object.keys(m.composition.dopants).some(d => d.toLowerCase().includes(lowerQuery)))
            )
            .slice(0, limit);
    }

    static async addMaterial(material: Material): Promise<void> {
        await new Promise(r => setTimeout(r, 20));
        if (!MaterialDatabase.materials.find(m => m.id === material.id)) {
            MaterialDatabase.materials.push(material);
        } else {
            console.warn(`Material with ID ${material.id} already exists.`);
        }
    }

    static async updateMaterial(material: Material): Promise<void> {
        await new Promise(r => setTimeout(r, 20));
        const index = MaterialDatabase.materials.findIndex(m => m.id === material.id);
        if (index !== -1) {
            MaterialDatabase.materials[index] = { ...MaterialDatabase.materials[index], ...material };
        } else {
            throw new Error(`Material with ID ${material.id} not found for update.`);
        }
    }
}

// --- Simulated API for External Services (now internal functions) ---
// These functions mimic API calls to various scientific and computational services.
// They generate plausible, though simulated, results.
export interface SimulatedAPIS {
    literatureSearch: (query: string, maxResults: number) => Promise<string[]>;
    simulationEngine: {
        runMolecularDynamics: (materialComposition: MaterialComposition, parameters: ExperimentParameter[]) => Promise<ExperimentResult>;
        runDFT: (materialComposition: MaterialComposition, propertiesToCalculate: string[]) => Promise<ExperimentResult>;
        runElectrochemicalModel: (materialId: string, cellDesign: any, parameters: ExperimentParameter[]) => Promise<ExperimentResult>;
        runThermalStabilitySimulation: (materialComposition: MaterialComposition, parameters: ExperimentParameter[]) => Promise<ExperimentResult>;
    };
    labRobotics: {
        synthesizeMaterial: (recipe: any) => Promise<string>; // Returns material ID
        characterizeMaterial: (materialId: string, techniques: string[]) => Promise<ExperimentResult>;
    };
    optimizationEngine: {
        runBayesianOptimization: (targetProperty: string, materialBase: MaterialComposition, tunableParams: ExperimentParameter[], numIterations: number) => Promise<{ optimalParams: ExperimentParameter[], predictedValue: number, results: ExperimentResult[] }>;
    };
    safetyAssessment: (materialId: string, application: string) => Promise<ExperimentResultMetric[]>;
    economicAnalysis: (materialId: string, productionScale: string) => Promise<ExperimentResultMetric[]>;
}

export const simulatedAPIs: SimulatedAPIS = {
    literatureSearch: async (query, maxResults) => {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
        const allPapers = [
            `Paper 1: "Advanced Graphene-based Anodes: Degradation Mechanisms and Mitigation Strategies" - Key Finding: Graphene volume expansion issues and SEI instability are primary challenges. Doping improves kinetics.`,
            `Paper 2: "Nitrogen Doping in Carbon Materials for Li-ion Batteries: A Comprehensive Review" - Key Finding: N-doping introduces defects, enhances electrical conductivity, and creates active sites for Li+ storage, but excessive doping can reduce structural integrity.`,
            `Paper 3: "Boron Nitride Nanosheets as Protective Layers and Mechanical Reinforcements in Battery Electrodes" - Key Finding: BNNS provides excellent mechanical stability, thermal conductivity, and acts as an inert barrier, suppressing dendrite growth and pulverization.`,
            `Paper 4: "Effect of Doping on Ion Intercalation Kinetics in 2D Materials: A First-Principles Study" - Key Finding: Specific dopant configurations significantly alter Li+ diffusion barriers. Higher electronegativity dopants create more favorable binding sites.`,
            `Paper 5: "Computational Study of Graphene-BN Heterostructures for Energy Storage Applications" - Key Finding: Hybrid structures leverage synergistic properties, enhancing both mechanical strength and electrochemical performance at optimized interfaces.`,
            `Paper 6: "Review: Solid Electrolyte Interphase (SEI) Formation and Stability on Carbonaceous Anodes" - Key Finding: SEI stability is paramount for long cycle life. Composition and uniformity of SEI heavily influence performance.`,
            `Paper 7: "Machine Learning for Accelerated Battery Material Discovery and Optimization" - Key Finding: ML models can predict material properties and guide experimental design, drastically reducing research cycles.`,
            `Paper 8: "Beyond Graphene: Emerging 2D Materials for Anode Applications" - Key Finding: MoS2, Black Phosphorus, and MXenes show promise but face challenges like poor conductivity or rapid degradation.`,
            `Paper 9: "Cost-Benefit Analysis of Advanced Battery Materials in Electric Vehicles" - Key Finding: High initial material cost can be offset by superior performance and longer lifespan.`,
            `Paper 10: "Safety Considerations for High-Energy Density Lithium-ion Batteries" - Key Finding: Thermal runaway prevention is critical; material choices influence intrinsic safety.`,
            `Paper 11: "In-situ Characterization Techniques for Battery Electrode Dynamics" - Key Finding: Operando XRD and TEM provide real-time insights into structural changes during cycling.`,
            `Paper 12: "Designing Stable Cathode Materials for Next-Generation Lithium-ion Batteries" - Key Finding: Layered and spinel structures are common; doping and surface coatings improve stability.`,
            `Paper 13: "Electrolyte Engineering for High Voltage and Fast Charging Batteries" - Key Finding: Additives, concentrated electrolytes, and solid electrolytes mitigate decomposition and dendrite issues.`,
            `Paper 14: "Atomic-scale Insights into Lithiation Mechanisms of Silicon Anodes" - Key Finding: Si experiences massive volume expansion, leading to fracture; nanostructuring and polymer binders help.`
        ];
        const filteredPapers = allPapers.filter(p => p.toLowerCase().includes(query.toLowerCase()));
        return filteredPapers.slice(0, maxResults);
    },
    simulationEngine: {
        runMolecularDynamics: async (composition, parameters) => {
            await new Promise(r => setTimeout(r, 3000 + Math.random() * 1000));
            const nDoping = composition.dopants?.N || 0;
            const hasBNNS = composition.structure?.includes('BNNS') || false;

            let strainReductionBase = 20;
            let liDiffusionBase = 0.2;
            let capacityRetentionBase = 80;

            if (nDoping > 0) {
                strainReductionBase += nDoping * 50; // Higher doping = more reduction initially
                liDiffusionBase += nDoping * 0.5;
            }
            if (hasBNNS) {
                strainReductionBase += 15; // BNNS adds more
                capacityRetentionBase += 10;
                liDiffusionBase -= 0.05; // Might slightly impede diffusion if too dense
            }

            // Apply parameter specific adjustments
            const targetStrain = parameters.find(p => p.name === 'strainReductionTarget')?.value as number || 0;
            if (targetStrain > 0) strainReductionBase += (Math.random() * 10 - 5); // Add some variability
            const temp = parameters.find(p => p.name === 'temperature')?.value as number || 300;
            if (temp > 300) liDiffusionBase += 0.02; // Higher temp, faster diffusion

            const strainReduction = Math.max(10, Math.min(60, strainReductionBase + (Math.random() * 10 - 5))).toFixed(2);
            const liDiffusion = Math.max(0.1, Math.min(0.6, liDiffusionBase + (Math.random() * 0.1 - 0.05))).toFixed(3);
            const capacityRetention = Math.max(60, Math.min(95, capacityRetentionBase + (Math.random() * 10 - 5))).toFixed(2);

            const isSuccess = parseFloat(strainReduction) > 25 && parseFloat(liDiffusion) > 0.25 && parseFloat(capacityRetention) > 85;

            const cycleNumbers = Array.from({ length: 500 }, (_, i) => i + 1);
            const capacityData = cycleNumbers.map(i => {
                const dropRate = isSuccess ? 0.0001 : 0.0003;
                return parseFloat(capacityRetention) - (i * dropRate * (100 - parseFloat(capacityRetention))) + (Math.random() * 2 - 1);
            });

            return {
                id: `sim-md-${Date.now()}`,
                experimentId: 'dummy-md-exp',
                dataPoints: { cycle_number: cycleNumbers, capacity_retention_percent: capacityData },
                metrics: [
                    { name: 'Lattice Strain Reduction', value: strainReduction, unit: '%' },
                    { name: 'Li+ Diffusion Coefficient', value: liDiffusion, unit: '10^-7 cm²/s' },
                    { name: 'Projected Capacity Retention @ 500 cycles', value: capacityRetention, unit: '%' }
                ],
                analysisSummary: `Molecular Dynamics simulation completed. Results show ${strainReduction}% reduction in lattice strain, a Li+ diffusion coefficient of ${liDiffusion} x 10^-7 cm²/s, and projected ${capacityRetention}% capacity retention after 500 cycles.`,
                interpretation: isSuccess ? 'Strong support for material design, demonstrating enhanced stability and kinetics.' : 'Partial support, material shows some promise but requires further optimization.',
                conclusion: isSuccess ? 'supported' : 'partial_support',
                confidenceScore: isSuccess ? 0.85 : 0.65,
                rawLog: `Simulated LAMMPS output: Energy minimized. Strain tensors computed. Diffusion pathways analyzed. CPU time: 12000s. Configuration: ${JSON.stringify(composition)}. Parameters: ${JSON.stringify(parameters)}`
            };
        },
        runDFT: async (composition, propertiesToCalculate) => {
            await new Promise(r => setTimeout(r, 2500 + Math.random() * 700));
            const bandGap = propertiesToCalculate.includes('band_gap') ? (Math.random() * 3 + 1).toFixed(2) : 'N/A';
            const formationEnergy = propertiesToCalculate.includes('formation_energy') ? (-0.5 - Math.random() * 0.5).toFixed(3) : 'N/A';
            const liBindingEnergy = propertiesToCalculate.includes('li_binding_energy') ? (-2.0 - Math.random() * 1.0).toFixed(2) : 'N/A'; // eV
            
            const metrics: ExperimentResultMetric[] = [];
            if (bandGap !== 'N/A') metrics.push({ name: 'Band Gap', value: bandGap, unit: 'eV' });
            if (formationEnergy !== 'N/A') metrics.push({ name: 'Formation Energy', value: formationEnergy, unit: 'eV/atom' });
            if (liBindingEnergy !== 'N/A') metrics.push({ name: 'Li Binding Energy', value: liBindingEnergy, unit: 'eV' });

            const isStable = parseFloat(formationEnergy as string) < -0.6; // More negative = more stable
            const isGoodBinder = parseFloat(liBindingEnergy as string) < -2.5; // More negative = stronger binding

            let conclusion: ExperimentResult['conclusion'] = 'inconclusive';
            let confidence = 0.5;
            if (isStable && isGoodBinder) {
                conclusion = 'supported';
                confidence = 0.9;
            } else if (isStable || isGoodBinder) {
                conclusion = 'partial_support';
                confidence = 0.7;
            } else {
                conclusion = 'refuted';
                confidence = 0.4;
            }

            return {
                id: `sim-dft-${Date.now()}`,
                experimentId: 'dummy-dft-exp',
                dataPoints: {},
                metrics,
                analysisSummary: `DFT calculation for ${JSON.stringify(composition.elements)} completed. Key properties: Band Gap=${bandGap} eV, Formation Energy=${formationEnergy} eV/atom, Li Binding Energy=${liBindingEnergy} eV.`,
                interpretation: isStable ? 'Material shows good thermodynamic stability.' : 'Material might be less stable than desired. ' + (isGoodBinder ? 'However, Li binding is strong.' : 'Li binding is also weak.'),
                conclusion: conclusion,
                confidenceScore: confidence,
                rawLog: `Simulated VASP output: K-points converged. Self-consistent field reached. DOS calculated. Total Energy: XXX. Structure optimized.`
            };
        },
        runElectrochemicalModel: async (materialId, cellDesign, parameters) => {
            await new Promise(r => setTimeout(r, 4000 + Math.random() * 1000));
            const cycleRate = parameters.find(p => p.name === 'cycle_rate')?.value as number || 0.5;
            const totalCycles = parameters.find(p => p.name === 'cycles')?.value as number || 500;

            const material = await MaterialDatabase.fetchMaterialById(materialId);
            const baseCapacity = material?.performanceScore ? material.performanceScore * 3 : 200; // Base from score
            const baseEfficiency = material?.stabilityScore ? material.stabilityScore * 0.9 + 10 : 90;
            let baseRetention = material?.stabilityScore ? material.stabilityScore * 0.8 : 70;

            // Adjust based on composite structure (assuming better performance for novel materials)
            if (material?.composition.structure?.includes('heterostructure') || material?.composition.dopants) {
                baseRetention += 15;
            }

            const capacity = (baseCapacity + Math.random() * 50 - 25).toFixed(2);
            const efficiency = (baseEfficiency + Math.random() * 5 - 2.5).toFixed(2);
            const cycleRetention = (baseRetention - (cycleRate * 5) + Math.random() * 10 - 5).toFixed(2);

            const isHighPerformance = parseFloat(capacity) > 250 && parseFloat(efficiency) > 95 && parseFloat(cycleRetention) > 85;

            const voltagePoints = Array.from({ length: 100 }, (_, i) => 3.0 + i * 0.01 + Math.sin(i / 10) * 0.1);
            const currentPoints = Array.from({ length: 100 }, (_, i) => 0.1 + i * 0.005 + Math.cos(i / 20) * 0.02);

            return {
                id: `sim-electro-${Date.now()}`,
                experimentId: 'dummy-electro-exp',
                dataPoints: { voltage: voltagePoints, current: currentPoints },
                metrics: [
                    { name: 'Specific Capacity', value: capacity, unit: 'mAh/g' },
                    { name: 'Initial Coulombic Efficiency', value: efficiency, unit: '%' },
                    { name: 'Capacity Retention @ ' + totalCycles + ' cycles', value: cycleRetention, unit: '%' }
                ],
                analysisSummary: `Electrochemical model for material ${materialId} simulated. Achieved ${capacity} mAh/g capacity and ${efficiency}% efficiency. Capacity retention at ${totalCycles} cycles: ${cycleRetention}%.`,
                interpretation: isHighPerformance ? 'Excellent electrochemical performance predicted, meeting or exceeding target metrics.' : 'Performance needs improvement, particularly in cycle life or rate capability.',
                conclusion: isHighPerformance ? 'supported' : 'inconclusive',
                confidenceScore: isHighPerformance ? 0.9 : 0.6,
                rawLog: `Simulated COMSOL output: Electrochemical cell dynamics solved. Ionic flux and charge distribution mapped. Cell design: ${JSON.stringify(cellDesign)}`
            };
        },
        runThermalStabilitySimulation: async (composition, parameters) => {
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 800));
            const onsetTemp = (180 + Math.random() * 50).toFixed(1); // °C
            const peakTemp = (250 + Math.random() * 70).toFixed(1); // °C
            const heatRelease = (500 + Math.random() * 300).toFixed(1); // J/g

            const isStable = parseFloat(onsetTemp) > 200 && parseFloat(heatRelease) < 600;

            return {
                id: `sim-thermal-${Date.now()}`,
                experimentId: 'dummy-thermal-exp',
                dataPoints: { temperature: Array.from({ length: 50 }, (_, i) => 50 + i * 5), heat_flow: Array.from({ length: 50 }, (_, i) => 10 + Math.sin(i / 5) * 5 + Math.exp(i / 25) * 0.5) },
                metrics: [
                    { name: 'Thermal Onset Temperature', value: onsetTemp, unit: '°C' },
                    { name: 'Peak Exothermic Temperature', value: peakTemp, unit: '°C' },
                    { name: 'Total Heat Release', value: heatRelease, unit: 'J/g' }
                ],
                analysisSummary: `Thermal stability simulation completed. Onset of exothermic reaction at ${onsetTemp}°C, with a total heat release of ${heatRelease} J/g.`,
                interpretation: isStable ? 'Material exhibits good thermal stability, suitable for safe battery operation.' : 'Thermal stability is a concern; may require further mitigation strategies or material modifications.',
                conclusion: isStable ? 'supported' : 'refuted',
                confidenceScore: isStable ? 0.8 : 0.5,
                rawLog: `Simulated DSC/TGA output: Heat flow vs temperature curve generated. Mass loss profile analyzed.`
            };
        }
    },
    labRobotics: {
        synthesizeMaterial: async (recipe) => {
            await new Promise(r => setTimeout(r, 5000 + Math.random() * 2000));
            const newMaterialId = `mat-${Date.now()}`;
            const purity = 90 + Math.random() * 8;
            const yieldPercent = 70 + Math.random() * 20;

            const newMaterial: Material = {
                id: newMaterialId,
                name: recipe.name || `Custom Material ${newMaterialId.substring(4)}`,
                composition: recipe.composition || { elements: {} },
                properties: [
                    { name: 'Synthesized Purity', value: purity.toFixed(2), unit: '%' },
                    { name: 'Yield', value: yieldPercent.toFixed(2), unit: '%' }
                ],
                discoveryDate: new Date().toISOString().split('T')[0],
                synthesisMethod: recipe.method || 'Automated solvothermal synthesis',
                potentialApplications: recipe.applications || ['battery material research'],
                stabilityScore: Math.round(purity * 0.8),
                performanceScore: Math.round(yieldPercent * 0.7)
            };
            await MaterialDatabase.addMaterial(newMaterial);
            return newMaterialId;
        },
        characterizeMaterial: async (materialId, techniques) => {
            await new Promise(r => setTimeout(r, 4000 + Math.random() * 1500));
            const material = await MaterialDatabase.fetchMaterialById(materialId);
            if (!material) throw new Error('Material not found for characterization');

            const metrics: ExperimentResultMetric[] = [];
            const dataPoints: { [key: string]: number[] | string[] } = {};
            let charConclusion: ExperimentResult['conclusion'] = 'supported';
            let charConfidence = 0.8;

            if (techniques.includes('XRD')) {
                const crystalStructure = Math.random() > 0.5 ? 'Hexagonal' : 'Rhombohedral';
                metrics.push({ name: 'Crystal Structure', value: crystalStructure, description: 'Simulated XRD pattern matching.' });
                metrics.push({ name: 'Crystallinity Index', value: (0.7 + Math.random() * 0.2).toFixed(2), unit: '' });
                dataPoints['XRD_2theta'] = Array.from({ length: 100 }, (_, i) => 10 + i * 0.5);
                dataPoints['XRD_intensity'] = Array.from({ length: 100 }, (_, i) => Math.sin(i / 5) * Math.exp(-i / 50) * 100 + 150);
                if (crystalStructure === 'Rhombohedral' && material.name.toLowerCase().includes('graphene')) charConclusion = 'inconclusive'; // Graphene usually hexagonal
            }
            if (techniques.includes('TEM') || techniques.includes('SEM')) {
                const particleSize = 50 + Math.random() * 20;
                const morphology = material.composition.structure?.includes('nanosheet') ? 'Nanosheets' : 'Nanoparticles';
                metrics.push({ name: 'Particle Size', value: particleSize.toFixed(1), unit: 'nm' });
                metrics.push({ name: 'Morphology', value: morphology, description: 'Simulated TEM/SEM image analysis.' });
                dataPoints['TEM_image_data'] = ['simulated_image_nanosheets.png'];
            }
            if (techniques.includes('XPS')) {
                const nDopingLevel = (material.composition.dopants?.N || 0) * 100;
                metrics.push({ name: 'Surface Composition (N-doping)', value: (nDopingLevel + Math.random() * 1).toFixed(2), unit: '%' });
                dataPoints['XPS_spectra_peaks'] = ['C1s', 'N1s', 'O1s', 'B1s'];
            }
            if (techniques.includes('EIS')) {
                metrics.push({ name: 'Charge Transfer Resistance', value: (10 + Math.random() * 5).toFixed(2), unit: 'Ohm' });
                metrics.push({ name: 'Ionic Conductivity', value: (1e-4 + Math.random() * 1e-5).toExponential(2), unit: 'S/cm' });
                dataPoints['EIS_nyquist_real'] = Array.from({ length: 50 }, (_, i) => 5 + i * 0.1);
                dataPoints['EIS_nyquist_imag'] = Array.from({ length: 50 }, (_, i) => - (10 - i * 0.1) * (10 - i * 0.1) / 10 + 5);
            }
            if (techniques.includes('Cycling') && material.performanceScore) {
                const cycles = 500;
                const initialCapacity = material.performanceScore * 3.5 + Math.random() * 50;
                const retention = material.stabilityScore * 0.8 + Math.random() * 10;
                metrics.push({ name: 'Initial Specific Capacity', value: initialCapacity.toFixed(2), unit: 'mAh/g' });
                metrics.push({ name: 'Capacity Retention @ ' + cycles + ' cycles', value: retention.toFixed(2), unit: '%' });
                 const cycleNumbers = Array.from({ length: cycles }, (_, i) => i + 1);
                 const capacityData = cycleNumbers.map(i => initialCapacity * (1 - (i / cycles) * (100 - retention) / 100) + (Math.random() * 5 - 2.5));
                dataPoints['Cycling_capacity'] = capacityData;
                dataPoints['Cycling_cycles'] = cycleNumbers;
            }

            // Update material properties with characterization results
            const updatedProperties = [...material.properties];
            metrics.forEach(m => {
                const existing = updatedProperties.find(p => p.name === m.name);
                if (existing) {
                    existing.value = m.value;
                    existing.unit = m.unit;
                    existing.description = m.interpretation || m.description;
                    existing.source = 'experimental';
                } else {
                    updatedProperties.push({
                        name: m.name,
                        value: m.value,
                        unit: m.unit,
                        description: m.interpretation || m.description,
                        source: 'experimental',
                    });
                }
            });
            await MaterialDatabase.updateMaterial({ ...material, properties: updatedProperties });


            return {
                id: `char-${Date.now()}`,
                experimentId: `char-exp-${materialId}`,
                dataPoints,
                metrics,
                analysisSummary: `Material ${material.name} characterized using ${techniques.join(', ')}. Key findings include ${metrics.map(m => `${m.name}: ${m.value}${m.unit ? ` ${m.unit}` : ''}`).join(', ')}.`,
                interpretation: `Characterization confirms expected structural and compositional properties. ${charConclusion === 'inconclusive' ? 'Further investigation into inconsistencies is required.' : ''}`,
                conclusion: charConclusion,
                confidenceScore: charConfidence,
                rawLog: `Simulated instrument output: XRD scan finished. TEM images processed. XPS spectra analyzed.`
            };
        }
    },
    optimizationEngine: {
        runBayesianOptimization: async (targetProperty, materialBase, tunableParams, numIterations) => {
            await new Promise(r => setTimeout(r, 6000 + Math.random() * 2000));
            const optimizedParams: ExperimentParameter[] = [];
            let bestValue = targetProperty.toLowerCase().includes('capacity') ? 200 : 0.1;
            const results: ExperimentResult[] = [];

            for (let i = 0; i < numIterations; i++) {
                // Simulate exploration and exploitation
                const currentIterationParams = tunableParams.map(p => {
                    let newValue = p.value as number;
                    if (p.range) {
                        // Gaussian walk around current best, or random if starting
                        const currentBest = optimizedParams.find(op => op.name === p.name)?.value as number || (p.range[0] + p.range[1]) / 2;
                        newValue = Math.max(p.range[0], Math.min(p.range[1], currentBest + (Math.random() - 0.5) * (p.range[1] - p.range[0]) / 5));
                    } else if (typeof p.value === 'number') {
                        newValue = (p.value as number) + (Math.random() * 0.1 - 0.05);
                    }
                    return { ...p, value: parseFloat(newValue.toFixed(2)) };
                });

                // Simulate running an experiment with these parameters
                const simResult = await simulatedAPIs.simulationEngine.runElectrochemicalModel(
                    materialBase.id || 'mat-001', // Needs a real material ID for full simulation
                    { anode: materialBase.name || 'Optimized Anode' },
                    currentIterationParams
                );
                results.push(simResult);

                const primaryMetric = simResult.metrics.find(m => m.name.toLowerCase().includes(targetProperty.toLowerCase()));
                if (primaryMetric && typeof primaryMetric.value === 'string') {
                    const currentValue = parseFloat(primaryMetric.value);
                    if (targetProperty.toLowerCase().includes('capacity') && currentValue > bestValue) {
                        bestValue = currentValue;
                        optimizedParams.splice(0, optimizedParams.length, ...currentIterationParams);
                    } else if (targetProperty.toLowerCase().includes('strain') && currentValue < bestValue) {
                        bestValue = currentValue;
                        optimizedParams.splice(0, optimizedParams.length, ...currentIterationParams);
                    } else if (targetProperty.toLowerCase().includes('diffusion') && currentValue > bestValue) {
                        bestValue = currentValue;
                        optimizedParams.splice(0, optimizedParams.length, ...currentIterationParams);
                    }
                }
            }

            return {
                optimalParams: optimizedParams.length > 0 ? optimizedParams : tunableParams.map(p => ({...p, value: (p.range ? (p.range[0] + p.range[1]) / 2 : p.value)})), // fallback to midpoint or initial
                predictedValue: parseFloat(bestValue.toFixed(2)),
                results: results
            };
        }
    },
    safetyAssessment: async (materialId, application) => {
        await new Promise(r => setTimeout(r, 1500));
        const material = await MaterialDatabase.fetchMaterialById(materialId);
        if (!material) return [{ name: 'Safety Risk', value: 'High', interpretation: 'Material not found.' }];

        const risks: ExperimentResultMetric[] = [];
        const baseRisk = 100 - (material.stabilityScore || 50); // Higher stability = lower base risk
        let overallRisk = baseRisk;

        if (material.name.toLowerCase().includes('silicon')) {
            risks.push({ name: 'Volume Expansion Risk', value: 'High', interpretation: 'Significant volume changes can lead to mechanical failure and short circuits.' });
            overallRisk += 20;
        }
        if (material.composition.elements.Co) {
            risks.push({ name: 'Thermal Runaway Potential (Co)', value: 'Moderate', interpretation: 'Cobalt-rich cathodes have higher thermal instability.' });
            overallRisk += 10;
        }
        if (application.toLowerCase().includes('ev')) {
            risks.push({ name: 'Fast Charge Dendrite Risk', value: 'Elevated', interpretation: 'High current densities increase risk of lithium plating.' });
            overallRisk += 15;
        }

        risks.push({ name: 'Overall Safety Score', value: Math.max(0, Math.min(100, 100 - overallRisk)).toFixed(1), unit: '/100', interpretation: 'Higher score means safer.' });
        return risks;
    },
    economicAnalysis: async (materialId, productionScale) => {
        await new Promise(r => setTimeout(r, 1200));
        const material = await MaterialDatabase.fetchMaterialById(materialId);
        if (!material) return [{ name: 'Cost/kg', value: 'N/A', interpretation: 'Material not found.' }];

        let baseCostPerKg = 50 + Math.random() * 100; // Base material cost
        if (material.composition.elements.Co) baseCostPerKg += 200; // Cobalt is expensive
        if (material.composition.elements.Li && material.composition.structure?.includes('nanosheet')) baseCostPerKg += 150; // Nano materials are complex

        let scaleFactor = 1;
        if (productionScale.toLowerCase() === 'pilot') scaleFactor = 2;
        if (productionScale.toLowerCase() === 'mass') scaleFactor = 0.8;

        const costPerKg = (baseCostPerKg * scaleFactor + Math.random() * 20 - 10).toFixed(2);
        const lifecycleCostReduction = (material.performanceScore && material.stabilityScore) ? (material.performanceScore + material.stabilityScore) / 200 * 30 : 15; // Placeholder
        const potentialROI = (lifecycleCostReduction * 2 - baseCostPerKg / 100).toFixed(2);

        return [
            { name: 'Raw Material Cost', value: costPerKg, unit: 'USD/kg', interpretation: 'Estimated cost of raw materials for production.' },
            { name: 'Projected Manufacturing Cost', value: (parseFloat(costPerKg) * 1.5).toFixed(2), unit: 'USD/kg', interpretation: 'Includes processing and labor.' },
            { name: 'Lifecycle Cost Reduction', value: lifecycleCostReduction.toFixed(1), unit: '%', interpretation: 'Reduction in total cost of ownership due to improved performance/lifespan.' },
            { name: 'Potential ROI (5 years)', value: potentialROI, unit: '%', interpretation: 'Simulated Return on Investment over 5 years.' }
        ];
    }
};

// --- Core Autonomous Scientist Logic ---

export interface ResearchContext {
    goal: string;
    currentPhase: ResearchPhase;
    hypotheses: Hypothesis[];
    experiments: Experiment[];
    materialsDiscovered: Material[];
    logEntries: LogEntry[];
    decisions: AgentDecision[];
    iterationCount: number;
    maxIterations: number;
    focusMaterialId?: string;
    ai: MockGoogleGenAI; // Keep AI instance
    researchReport?: ResearchReport; // Final report
    budget: number; // Simulated budget
    timeElapsed: number; // Simulated time in hours
}

// Utility for adding log entries consistently
const createLogEntry = (type: LogEntry['type'], content: string): LogEntry => ({
    type,
    content: `${new Date().toLocaleTimeString()} - ${content}`
});

// A central "Agent" class to encapsulate complex decision making and state transitions
export class AutonomousScientistAgent {
    private context: ResearchContext;
    private addLog: (entry: LogEntry) => void;
    private updateContext: (updater: (prev: ResearchContext) => ResearchContext) => void;

    constructor(
        initialContext: ResearchContext,
        addLogFunc: (entry: LogEntry) => void,
        updateContextFunc: (updater: (prev: ResearchContext) => ResearchContext) => void
    ) {
        this.context = initialContext;
        this.addLog = addLogFunc;
        this.updateContext = updateContextFunc;
    }

    private updateInternalContext(newContext: Partial<ResearchContext>) {
        this.context = { ...this.context, ...newContext };
        this.updateContext(() => this.context); // Update React state
    }

    private logDecision(phase: ResearchPhase, description: string, details: any = {}, outcome: AgentDecision['outcome'] = 'neutral', reasoning?: string) {
        const decision: AgentDecision = {
            timestamp: new Date().toISOString(),
            phase,
            description,
            details,
            outcome,
            reasoning,
        };
        this.updateInternalContext({
            decisions: [...this.context.decisions, decision]
        });
        this.addLog(createLogEntry('thought', `Decision: ${description}. Outcome: ${outcome.toUpperCase()}${reasoning ? ` Reasoning: ${reasoning}` : ''}`));
    }

    private updateCurrentPhase(newPhase: ResearchPhase) {
        this.updateInternalContext({ currentPhase: newPhase });
        this.addLog(createLogEntry('thought', `Transitioning to phase: ${newPhase.replace(/_/g, ' ')}`));
    }

    private spendResources(cost: number, time: number) {
        this.updateInternalContext({
            budget: this.context.budget - cost,
            timeElapsed: this.context.timeElapsed + time,
        });
        this.addLog(createLogEntry('action', `Consumed resources: $${cost.toFixed(2)} and ${time.toFixed(1)} hours. Remaining budget: $${this.context.budget.toFixed(2)}.`));
        if (this.context.budget < 0) {
            this.addLog(createLogEntry('result', 'Budget exceeded! Critical resource constraint hit.'));
            throw new Error('Budget exceeded');
        }
    }

    public async runResearchCycle() {
        this.updateCurrentPhase(ResearchPhase.GOAL_DEFINITION);
        this.logDecision(ResearchPhase.GOAL_DEFINITION, `Starting research cycle for goal: "${this.context.goal}"`, { goal: this.context.goal }, 'success');

        try {
            // --- Phase 1: Goal Decomposition & Initial Literature Review ---
            this.updateCurrentPhase(ResearchPhase.LITERATURE_REVIEW);
            this.addLog(createLogEntry('action', `Decomposing goal: "${this.context.goal}" into actionable sub-objectives.`));
            this.spendResources(50, 0.5); // Initial thought process

            const goalBreakdownResponse = await this.context.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Break down the goal: ${this.context.goal} into 5-7 actionable sub-objectives, focusing on material science research.`
            });
            const subGoals = goalBreakdownResponse.text.split('\n').filter(s => s.trim() !== '').map(s => s.replace(/^\d+\.\s*/, ''));
            this.addLog(createLogEntry('result', `Goal decomposed into: ${subGoals.join('; ')}`));
            this.logDecision(ResearchPhase.LITERATURE_REVIEW, 'Goal decomposed', { subGoals }, 'success');
            this.spendResources(20, 0.2);

            this.addLog(createLogEntry('action', `Performing initial literature search for "${this.context.goal}" across multiple domains...`));
            const searchQueries = [
                `"${this.context.goal.split(' ')[2]} battery anode limitations"`, // Dynamic query based on goal
                `"novel material compositions ${this.context.goal.split(' ')[0]} performance"`,
                `"solid-state electrolyte advanced research"`,
                `"in-situ characterization battery degradation mechanisms"`,
                `"electrochemical stability of 2D materials"`,
                `"doping effects on Li-ion transport"`
            ];
            let keyFindings: string[] = [];
            for (const query of searchQueries) {
                this.spendResources(10, 0.3); // Cost per search
                const papers = await simulatedAPIs.literatureSearch(query, 3);
                keyFindings.push(...papers);
                this.addLog(createLogEntry('action', `Searched "${query}", found ${papers.length} relevant entries.`));
            }

            const literatureSummaryPrompt = `Synthesize key findings from the following literature entries relevant to "${this.context.goal}". Identify common challenges, promising material classes, and experimental techniques. Summarize in a concise paragraph:\n- ${keyFindings.join('\n- ')}`;
            const literatureSummaryResponse = await this.context.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: literatureSummaryPrompt
            });
            this.addLog(createLogEntry('result', `Literature Summary: ${literatureSummaryResponse.text}`));
            this.logDecision(ResearchPhase.LITERATURE_REVIEW, 'Initial literature review completed', { summary: literatureSummaryResponse.text }, 'success');
            this.spendResources(30, 0.5);

            // --- Iterative Research Loop ---
            for (let i = 0; i < this.context.maxIterations; i++) {
                if (this.context.budget < 500) { // Check budget before starting a new iteration
                    this.addLog(createLogEntry('result', 'Insufficient budget to start a new iteration. Concluding research.'));
                    this.logDecision(ResearchPhase.RESOURCE_MANAGEMENT, 'Budget low, ending iterations', { budget: this.context.budget }, 'failure', 'Budget threshold reached.');
                    break;
                }
                this.updateInternalContext({ iterationCount: i + 1, currentPhase: ResearchPhase.ITERATION_CYCLE });
                this.addLog(createLogEntry('thought', `--- Starting Iteration ${i + 1}/${this.context.maxIterations} ---`));

                // Phase 2: Hypothesis Generation
                this.updateCurrentPhase(ResearchPhase.HYPOTHESIS_GENERATION);
                this.spendResources(80, 1.0);
                const currentKnowledge = `Goal: ${this.context.goal}\nRecent Literature Summary: ${literatureSummaryResponse.text}\nPrevious Hypotheses: ${this.context.hypotheses.map(h => `(${h.status}) ${h.text}`).join('; ')}\nRecent Experiment Results: ${this.context.experiments.filter(e => e.results).slice(-2).map(e => e.results?.analysisSummary).join('; ') || 'None yet.'}`;
                const hypothesisPrompt = `Based on the following knowledge:\n${currentKnowledge}\nFormulate one novel, testable hypothesis to advance the research goal. Focus on specific material modifications or combinations for improved battery performance (e.g., enhanced cycle life, higher capacity, better stability). Specify target property and predicted effect.`;
                this.addLog(createLogEntry('action', 'Generating a novel hypothesis based on current knowledge...'));
                const hypothesisResponse = await this.context.ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: hypothesisPrompt
                });
                const newHypothesisText = hypothesisResponse.text;
                // Attempt to parse structured parts from the AI response
                const targetPropMatch = newHypothesisText.match(/target property:\s*([\w\s]+)/i);
                const predictedEffectMatch = newHypothesisText.match(/predicted effect:\s*([\w\s]+)/i);

                const newHypothesis: Hypothesis = {
                    id: `hyp-${Date.now()}`,
                    text: newHypothesisText,
                    targetProperty: targetPropMatch ? targetPropMatch[1].trim() : 'Battery Performance',
                    predictedEffect: predictedEffectMatch ? predictedEffectMatch[1].trim() : 'Improved stability and energy density',
                    evidence: ['literature review', `iteration ${i + 1}`],
                    status: 'proposed',
                    priority: 'high',
                };
                this.updateInternalContext({ hypotheses: [...this.context.hypotheses, newHypothesis] });
                this.addLog(createLogEntry('result', `New Hypothesis Generated: ${newHypothesisText}`));
                this.logDecision(ResearchPhase.HYPOTHESIS_GENERATION, 'Generated new hypothesis', { hypothesis: newHypothesisText }, 'success');

                // Phase 3: Experiment Design
                this.updateCurrentPhase(ResearchPhase.EXPERIMENT_DESIGN);
                this.spendResources(120, 2.0);
                this.addLog(createLogEntry('action', `Designing a multi-stage simulated experiment to test hypothesis: "${newHypothesisText}"`));
                const experimentDesignPrompt = `Design a detailed, multi-stage computational experiment (e.g., MD, DFT, electrochemical simulation, thermal stability) to rigorously test the hypothesis: "${newHypothesisText}". Specify material composition (e.g., N-doped graphene with BNNS interlayers), precise key parameters (ranges where applicable), expected outcomes, and multiple metrics to measure. Also, suggest relevant simulated characterization techniques. Provide justification for each step.`;
                const experimentDesignResponse = await this.context.ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: experimentDesignPrompt
                });
                const designDetails = experimentDesignResponse.text;
                this.addLog(createLogEntry('result', `Experiment Design Plan: ${designDetails}`));

                // Parse design details into structured experiment and material data
                const materialToSimulate = this.extractMaterialFromDesign(designDetails);
                const simulationParameters = this.extractParametersFromDesign(designDetails);
                const experimentType = this.determineExperimentType(designDetails);
                const charTechniques = this.extractCharacterizationTechniques(designDetails);

                await MaterialDatabase.addMaterial(materialToSimulate); // Add the proposed material to our DB
                this.updateInternalContext({ materialsDiscovered: [...this.context.materialsDiscovered, materialToSimulate] });
                this.logDecision(ResearchPhase.EXPERIMENT_DESIGN, 'Proposed new material for experimentation', { material: materialToSimulate.name }, 'success');

                const newExperiment: Experiment = {
                    id: `exp-${Date.now()}`,
                    name: `Simulated ${experimentType} for ${materialToSimulate.name}`,
                    type: experimentType,
                    hypothesisId: newHypothesis.id,
                    materialId: materialToSimulate.id,
                    parameters: simulationParameters,
                    status: 'pending',
                    results: null,
                    designRationale: designDetails,
                    costEstimate: 1500 + Math.random() * 3000, // Higher cost for more complex sim
                    timeEstimate: 15 + Math.random() * 30, // Longer time
                    priority: 'high',
                    associatedAPICalls: [
                        `simulationEngine.${experimentType === 'simulation' ? this.determineSpecificSimType(designDetails) : (experimentType === 'synthesis' ? 'synthesizeMaterial' : 'characterizeMaterial')}`,
                        ...charTechniques.map(t => `labRobotics.characterizeMaterial.${t}`)
                    ],
                };
                this.updateInternalContext({ experiments: [...this.context.experiments, newExperiment] });
                this.logDecision(ResearchPhase.EXPERIMENT_DESIGN, 'Designed a new experiment', { experiment: newExperiment.name, material: materialToSimulate.name }, 'success');

                // Phase 4: Simulation Execution (and potentially characterization)
                this.updateCurrentPhase(ResearchPhase.SIMULATION_EXECUTION);
                this.spendResources(newExperiment.costEstimate, newExperiment.timeEstimate);
                this.addLog(createLogEntry('action', `Executing ${newExperiment.type} simulation for ${newExperiment.name} on material ${materialToSimulate.name}...`));
                let experimentResult: ExperimentResult | null = null;
                try {
                    switch (newExperiment.type) {
                        case 'simulation':
                            const specificSimType = this.determineSpecificSimType(designDetails);
                            if (specificSimType === 'runMolecularDynamics') {
                                experimentResult = await simulatedAPIs.simulationEngine.runMolecularDynamics(materialToSimulate.composition, simulationParameters);
                            } else if (specificSimType === 'runDFT') {
                                experimentResult = await simulatedAPIs.simulationEngine.runDFT(materialToSimulate.composition, simulationParameters.filter(p => p.value === true).map(p => p.name));
                            } else if (specificSimType === 'runThermalStabilitySimulation') {
                                experimentResult = await simulatedAPIs.simulationEngine.runThermalStabilitySimulation(materialToSimulate.composition, simulationParameters);
                            } else {
                                experimentResult = await simulatedAPIs.simulationEngine.runElectrochemicalModel(materialToSimulate.id, { anode: materialToSimulate.name }, simulationParameters);
                            }
                            break;
                        case 'synthesis':
                            const synthesizedId = await simulatedAPIs.labRobotics.synthesizeMaterial({ name: materialToSimulate.name, composition: materialToSimulate.composition, method: designDetails, applications: materialToSimulate.potentialApplications });
                            this.addLog(createLogEntry('result', `Material ${materialToSimulate.name} synthesized with ID: ${synthesizedId}`));
                            experimentResult = {
                                id: `res-${Date.now()}`, experimentId: newExperiment.id, dataPoints: {}, metrics: [{ name: 'Synthesis Success', value: 'High', unit: '%' }],
                                analysisSummary: `Successfully synthesized material ${synthesizedId}. Purity: ${Math.random() * 5 + 90}%. Yield: ${Math.random() * 10 + 80}%.`,
                                interpretation: 'Material ready for characterization.', conclusion: 'supported', confidenceScore: 0.95,
                            };
                            break;
                        case 'characterization': // Directly run characterization as main experiment
                            experimentResult = await simulatedAPIs.labRobotics.characterizeMaterial(materialToSimulate.id, charTechniques);
                            break;
                        case 'optimization':
                             const optResult = await simulatedAPIs.optimizationEngine.runBayesianOptimization(
                                 newHypothesis.targetProperty,
                                 materialToSimulate.composition,
                                 simulationParameters,
                                 5 // numIterations
                             );
                             experimentResult = {
                                 id: `res-${Date.now()}-opt`,
                                 experimentId: newExperiment.id,
                                 dataPoints: {},
                                 metrics: [{ name: `Optimal ${newHypothesis.targetProperty}`, value: optResult.predictedValue.toFixed(2), unit: newHypothesis.targetProperty.includes('Capacity') ? 'mAh/g' : '' }],
                                 analysisSummary: `Bayesian Optimization identified optimal parameters: ${optResult.optimalParams.map(p => `${p.name}=${p.value}${p.unit ? p.unit : ''}`).join(', ')}. Predicted ${newHypothesis.targetProperty}: ${optResult.predictedValue.toFixed(2)}.`,
                                 interpretation: 'Optimization successfully converged.',
                                 conclusion: 'supported',
                                 confidenceScore: 0.9,
                             };
                             break;
                        case 'validation': // Could be a physical lab validation after simulation
                            experimentResult = await simulatedAPIs.labRobotics.characterizeMaterial(materialToSimulate.id, ['XRD', 'EIS', 'Cycling']);
                            experimentResult.analysisSummary = `Validation experiment for ${materialToSimulate.name} confirmed simulated performance trends.`;
                            break;
                    }

                    if (experimentResult) {
                        this.addLog(createLogEntry('result', `Experiment ${newExperiment.name} completed. Summary: ${experimentResult.analysisSummary}`));
                        this.updateInternalContext({
                            experiments: this.context.experiments.map(exp =>
                                exp.id === newExperiment.id ? { ...exp, status: 'completed', results: experimentResult } : exp
                            ),
                            hypotheses: this.context.hypotheses.map(hyp =>
                                hyp.id === newHypothesis.id ? { ...hyp, status: experimentResult!.conclusion } : hyp
                            )
                        });
                        this.logDecision(ResearchPhase.SIMULATION_EXECUTION, 'Experiment completed', { experimentId: newExperiment.id, conclusion: experimentResult.conclusion, confidence: experimentResult.confidenceScore }, experimentResult.conclusion === 'supported' ? 'success' : 'failure', experimentResult.interpretation);

                        // If it's a synthesis, automatically trigger characterization
                        if (newExperiment.type === 'synthesis' && materialToSimulate.id) {
                            this.addLog(createLogEntry('action', `Synthesized material ${materialToSimulate.name}. Automatically initiating characterization.`));
                            this.spendResources(newExperiment.costEstimate * 0.5, newExperiment.timeEstimate * 0.5); // Additional cost for char
                            const charResult = await simulatedAPIs.labRobotics.characterizeMaterial(materialToSimulate.id, ['XRD', 'TEM', 'XPS', 'EIS', 'Cycling']);
                            this.addLog(createLogEntry('result', `Characterization of ${materialToSimulate.name} completed. Summary: ${charResult.analysisSummary}`));
                            this.updateInternalContext({
                                experiments: [...this.context.experiments, {
                                    id: `exp-${Date.now()}-char`,
                                    name: `Characterization of ${materialToSimulate.name}`,
                                    type: 'characterization',
                                    hypothesisId: newHypothesis.id,
                                    materialId: materialToSimulate.id,
                                    parameters: [],
                                    status: 'completed',
                                    results: charResult,
                                    designRationale: 'Automated characterization post-synthesis.',
                                    costEstimate: newExperiment.costEstimate * 0.4,
                                    timeEstimate: newExperiment.timeEstimate * 0.3,
                                    priority: 'medium',
                                    associatedAPICalls: ['labRobotics.characterizeMaterial'],
                                }]
                            });
                            this.logDecision(ResearchPhase.SIMULATION_EXECUTION, 'Material characterized post-synthesis', { materialId: materialToSimulate.id, charMetrics: charResult.metrics }, charResult.conclusion === 'supported' ? 'success' : 'failure');
                        }

                    } else {
                        throw new Error('Experiment result could not be generated.');
                    }

                } catch (expError: any) {
                    this.addLog(createLogEntry('result', `Experiment ${newExperiment.name} failed: ${expError.message}`));
                    this.updateInternalContext({
                        experiments: this.context.experiments.map(exp =>
                            exp.id === newExperiment.id ? { ...exp, status: 'failed' } : exp
                        )
                    });
                    this.logDecision(ResearchPhase.SIMULATION_EXECUTION, 'Experiment failed', { experimentId: newExperiment.id, error: expError.message }, 'failure', expError.message);
                    continue; // Move to next iteration even if one experiment fails
                }

                // Phase 5: Data Analysis
                this.updateCurrentPhase(ResearchPhase.DATA_ANALYSIS);
                this.spendResources(90, 1.5);
                this.addLog(createLogEntry('action', `Analyzing results from ${newExperiment.name}...`));
                const analysisContext = `Hypothesis: "${newHypothesisText}"\nExperiment Type: ${newExperiment.type}\nKey Metrics: ${JSON.stringify(experimentResult?.metrics, null, 2)}\nData Summary: ${experimentResult?.analysisSummary || 'N/A'}\nInterpretation: ${experimentResult?.interpretation || 'N/A'}\nConclusion: ${experimentResult?.conclusion || 'N/A'}`;
                const analysisPrompt = `Perform a detailed analysis of the following experiment results to identify trends, anomalies, and strong implications for the hypothesis. Evaluate if the results support, refute, or are inconclusive. Also, identify any unexpected outcomes or areas for further investigation:\n${analysisContext}`;
                const analysisResponse = await this.context.ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: analysisPrompt
                });
                this.addLog(createLogEntry('result', `Analysis Report: ${analysisResponse.text}`));
                this.logDecision(ResearchPhase.DATA_ANALYSIS, 'Analyzed experiment data', { analysis: analysisResponse.text, experimentId: newExperiment.id }, 'success');

                // Phase 6: Hypothesis Refinement / Self-Correction
                this.updateCurrentPhase(ResearchPhase.HYPOTHESIS_REFINEMENT);
                this.spendResources(100, 1.8);

                if (experimentResult?.conclusion === 'supported' || experimentResult?.conclusion === 'partial_support') {
                    this.addLog(createLogEntry('thought', `Hypothesis "${newHypothesisText}" was ${experimentResult?.conclusion}. Considering next steps to optimize or expand.`));
                    const refinementPrompt = `The hypothesis "${newHypothesisText}" was ${experimentResult?.conclusion} by experiment results. Based on the detailed analysis:\n${analysisResponse.text}\nSuggest a refinement to the current hypothesis, or propose a new, related hypothesis to further optimize the material/process or explore new applications based on this success. Provide rationale.`;
                    const refinementResponse = await this.context.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: refinementPrompt });
                    this.addLog(createLogEntry('result', `Refinement/Next Hypothesis Suggestion: ${refinementResponse.text}`));
                    this.logDecision(ResearchPhase.HYPOTHESIS_REFINEMENT, 'Hypothesis supported, suggesting refinement', { suggestion: refinementResponse.text }, 'success');
                    // In a real system, this would lead to a new hypothesis being added for next iteration
                } else {
                    this.addLog(createLogEntry('thought', `Hypothesis "${newHypothesisText}" was ${experimentResult?.conclusion}. Initiating self-correction and generating a new hypothesis.`));
                    this.updateCurrentPhase(ResearchPhase.SELF_CORRECTION);
                    this.spendResources(150, 2.5);
                    const correctionPrompt = `The hypothesis "${newHypothesisText}" was ${experimentResult?.conclusion}. Based on the analysis:\n${analysisResponse.text}\nIdentify the most likely reasons for failure/inconclusiveness and formulate a refined or completely new hypothesis that addresses these issues or pivots to a more promising direction. Provide a brief self-critique of the previous design.`;
                    const correctionResponse = await this.context.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: correctionPrompt });
                    this.addLog(createLogEntry('result', `Self-Correction & New Hypothesis: ${correctionResponse.text}`));
                    this.logDecision(ResearchPhase.SELF_CORRECTION, 'Hypothesis not supported, initiating self-correction', { newHypothesis: correctionResponse.text }, 'failure', 'Previous approach was insufficient.');
                }
            }

            // --- Final Phase: Report Generation ---
            this.updateCurrentPhase(ResearchPhase.REPORT_GENERATION);
            this.spendResources(200, 3.0);
            this.addLog(createLogEntry('action', 'Generating comprehensive final research report, including safety and economic assessments...'));

            // Simulated Safety and Economic Analysis
            const finalMaterialId = this.context.materialsDiscovered[this.context.materialsDiscovered.length - 1]?.id || 'mat-001'; // Get the last discovered material
            const safetyMetrics = await simulatedAPIs.safetyAssessment(finalMaterialId, 'EV battery');
            const economicMetrics = await simulatedAPIs.economicAnalysis(finalMaterialId, 'mass');

            const finalReportPrompt = `Generate a comprehensive scientific report summarizing the research on "${this.context.goal}". Include:\n
- An Abstract highlighting key findings and significance.
- An Introduction setting the context.
- All Hypotheses tested and their outcomes.
- Key Experiments performed (design, methodology, and results summary).
- Detailed Results Summary including data from simulations and characterizations.
- A thorough Discussion of the implications of the findings, linking back to the goal.
- A strong Conclusion stating the main achievements.
- Future Work recommendations based on findings and limitations.
- Simulated Safety Assessment Metrics: ${safetyMetrics.map(m => `${m.name}: ${m.value}${m.unit ? ` ${m.unit}` : ''} (${m.interpretation})`).join('; ')}.
- Simulated Economic Analysis Metrics: ${economicMetrics.map(m => `${m.name}: ${m.value}${m.unit ? ` ${m.unit}` : ''} (${m.interpretation})`).join('; ')}.
- Ensure to provide relevant citations from the simulated literature review where appropriate.
Structure the report clearly with headings.`;
            const finalReportResponse = await this.context.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalReportPrompt
            });
            const fullReportContent = finalReportResponse.text;

            // Attempt to parse sections, fallback to full text
            const getSection = (reportText: string, startKey: string, endKey: string) => {
                const start = reportText.indexOf(startKey);
                const end = reportText.indexOf(endKey, start + startKey.length);
                if (start !== -1 && end !== -1) {
                    return reportText.substring(start + startKey.length, end).trim();
                }
                if (start !== -1) { // If endKey not found, take until end or next main header
                    const nextHeaderMatch = reportText.substring(start + startKey.length).match(/^(Abstract|Introduction|Hypotheses|Methodology|Results|Discussion|Conclusion|Future Work|Safety Assessment|Economic Analysis|Citations):\s*$/im);
                    if (nextHeaderMatch) {
                        return reportText.substring(start + startKey.length, start + startKey.length + nextHeaderMatch.index).trim();
                    }
                    return reportText.substring(start + startKey.length).trim();
                }
                return `(Section "${startKey.replace(':', '')}" not found or empty.)`;
            };

            const finalReport: ResearchReport = {
                id: `report-${Date.now()}`,
                title: `Autonomous Research Report: ${this.context.goal}`,
                author: 'Autonomous Scientist AI',
                date: new Date().toISOString().split('T')[0],
                abstract: getSection(fullReportContent, 'Abstract:', 'Introduction:'),
                introduction: getSection(fullReportContent, 'Introduction:', 'Hypotheses:'),
                hypotheses: this.context.hypotheses,
                experiments: this.context.experiments.filter(exp => exp.status === 'completed' && exp.results !== null),
                resultsSummary: getSection(fullReportContent, 'Results Summary:', 'Discussion:'),
                discussion: getSection(fullReportContent, 'Discussion:', 'Conclusion:'),
                conclusion: getSection(fullReportContent, 'Conclusion:', 'Future Work:'),
                futureWork: getSection(fullReportContent, 'Future Work:', 'Citations:') || getSection(fullReportContent, 'Future Work:', 'Safety Assessment Metrics:'),
                citations: getSection(fullReportContent, 'Citations:', '--- END REPORT ---').split('\n').filter(s => s.trim() !== ''),
                generatedByAI: true,
                recommendations: [`Consider validation with real-world experiments.`, `Further optimize parameters using advanced ML.`]
            };
            this.updateInternalContext({ currentPhase: ResearchPhase.COMPLETED, researchReport: finalReport });
            this.addLog(createLogEntry('result', `Research Report Generated:\n${fullReportContent}`));
            this.logDecision(ResearchPhase.REPORT_GENERATION, 'Final comprehensive research report generated', { reportId: finalReport.id }, 'success');

        } catch (error: any) {
            this.addLog(createLogEntry('result', `A critical error occurred during the research cycle: ${error.message}`));
            this.updateInternalContext({ currentPhase: ResearchPhase.FAILED });
            this.logDecision(ResearchPhase.FAILED, 'Research cycle encountered a critical error', { error: error.message }, 'failure');
        } finally {
            this.addLog(createLogEntry('thought', `Research cycle finished. Final phase: ${this.context.currentPhase}`));
            this.addLog(createLogEntry('result', `Total simulated budget spent: $${(100000 - this.context.budget).toFixed(2)}. Total simulated time elapsed: ${this.context.timeElapsed.toFixed(1)} hours.`));
        }
    }

    // Helper functions for parsing AI responses into structured data
    private extractMaterialFromDesign(designDetails: string): Material {
        // More robust parsing for complex material descriptions
        const nameMatch = designDetails.match(/(N-doped graphene with BNNS interlayers|Lithium Manganese Iron Phosphate doped with Vanadium|new material candidate:\s*([\w\s-]+)|([\w\s-]+) anode composite)/i);
        const name = nameMatch ? (nameMatch[2] || nameMatch[3] || nameMatch[1]) : `Proposed Material ${Date.now().toString().slice(-4)}`;
        const cleanedName = name.replace(/anode composite/i, '').trim();

        const elementsMatch = designDetails.match(/composition:\s*{([^}]+)}/i) || designDetails.match(/elements:\s*([\w\s,:]+)/i);
        const elements: { [key: string]: number } = {};
        if (elementsMatch && elementsMatch[1]) {
            elementsMatch[1].split(',').forEach(part => {
                const [key, val] = part.trim().split(':');
                if (key && val) elements[key.trim()] = parseFloat(val.trim()) || 1; // Default to 1 if parsing fails
            });
        }

        const dopantsMatch = designDetails.match(/doping:\s*{([^}]+)}/i) || designDetails.match(/dopants:\s*([\w\s,:]+)/i);
        const dopants: { [key: string]: number } = {};
        if (dopantsMatch && dopantsMatch[1]) {
            dopantsMatch[1].split(',').forEach(part => {
                const [key, val] = part.trim().split(':');
                if (key && val) dopants[key.trim()] = parseFloat(val.trim()) / 100 || 0.05; // Assume percentage for doping
            });
        }

        const structureMatch = designDetails.match(/structure:\s*([\w\s-]+)/i) || designDetails.match(/interlayers:\s*([\w\s-]+)/i);
        const structure = structureMatch ? structureMatch[1].trim() : (cleanedName.toLowerCase().includes('graphene') && cleanedName.toLowerCase().includes('bnns') ? 'graphene-BNNS heterostructure' : undefined);

        const materialId = `mat-${cleanedName.replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
        return {
            id: materialId,
            name: cleanedName,
            composition: { elements, dopants, structure },
            properties: [], // Will be filled by later simulations/characterizations
            discoveryDate: new Date().toISOString().split('T')[0],
            potentialApplications: ['battery anode', 'energy storage'],
            stabilityScore: 50 + Math.random() * 30, // Initial guess
            performanceScore: 50 + Math.random() * 30, // Initial guess
        };
    }

    private extractParametersFromDesign(designDetails: string): ExperimentParameter[] {
        const parameters: ExperimentParameter[] = [];
        const paramRegex = /(?:parameter|metric|variable):\s*([\w\s]+?)(?:(?:\s*=\s*|:\s*)(\d+\.?\d*(?:\s*[%°\w\/]+)?))?(?:,\s*range:\s*\[(\d+\.?\d*),\s*(\d+\.?\d*)\])?/gi;
        let match;
        while ((match = paramRegex.exec(designDetails)) !== null) {
            const name = match[1].trim();
            let value: number | string | boolean = match[2] ? (isNaN(parseFloat(match[2])) ? match[2] : parseFloat(match[2])) : true; // Default to true if no value, useful for DFT properties
            const unit = (match[2] && !isNaN(parseFloat(match[2]))) ? match[2].match(/[^\d\s\.]+/)?.shift() || undefined : undefined;
            const range: [number, number] | undefined = (match[3] && match[4]) ? [parseFloat(match[3]), parseFloat(match[4])] : undefined;

            parameters.push({ name, value, unit, range });
        }
        // Add some default parameters if none are found
        if (parameters.length === 0) {
            if (designDetails.toLowerCase().includes('molecular dynamics') || designDetails.toLowerCase().includes('md')) {
                parameters.push({ name: 'temperature', value: 300, unit: 'K' });
                parameters.push({ name: 'pressure', value: 1, unit: 'atm' });
                parameters.push({ name: 'strainReductionTarget', value: 25, unit: '%' });
                parameters.push({ name: 'liDiffusionImprovement', value: 0.25 });
            } else if (designDetails.toLowerCase().includes('dft') || designDetails.toLowerCase().includes('density functional theory')) {
                 parameters.push({ name: 'band_gap', value: true });
                 parameters.push({ name: 'formation_energy', value: true });
                 parameters.push({ name: 'li_binding_energy', value: true });
            } else if (designDetails.toLowerCase().includes('electrochemical') || designDetails.toLowerCase().includes('electrochemical model')) {
                 parameters.push({ name: 'cycle_rate', value: 0.5, unit: 'C' });
                 parameters.push({ name: 'cycles', value: 500 });
                 parameters.push({ name: 'voltage_window', value: '3.0-4.2', unit: 'V' });
            } else if (designDetails.toLowerCase().includes('thermal stability')) {
                parameters.push({ name: 'heating_rate', value: 10, unit: '°C/min' });
                parameters.push({ name: 'atmosphere', value: 'argon' });
            } else if (designDetails.toLowerCase().includes('optimization')) {
                parameters.push({ name: 'doping_concentration', value: 0.05, unit: '%', range: [0.01, 0.1] });
                parameters.push({ name: 'layer_thickness', value: 5, unit: 'nm', range: [1, 10] });
            }
        }
        return parameters;
    }

    private determineExperimentType(designDetails: string): Experiment['type'] {
        const lowerDesign = designDetails.toLowerCase();
        if (lowerDesign.includes('molecular dynamics') || lowerDesign.includes('md') || lowerDesign.includes('dft') || lowerDesign.includes('density functional theory') || lowerDesign.includes('computational simulation') || lowerDesign.includes('electrochemical model') || lowerDesign.includes('thermal stability simulation')) {
            return 'simulation';
        }
        if (lowerDesign.includes('synthesize') || lowerDesign.includes('synthesis')) {
            return 'synthesis';
        }
        if (lowerDesign.includes('characterize') || lowerDesign.includes('xrd') || lowerDesign.includes('tem') || lowerDesign.includes('xps') || lowerDesign.includes('eis')) {
            return 'characterization';
        }
        if (lowerDesign.includes('optimization') || lowerDesign.includes('bayesian optimization') || lowerDesign.includes('genetic algorithm')) {
            return 'optimization';
        }
        return 'simulation'; // Default to simulation for computational scientist
    }

    private determineSpecificSimType(designDetails: string): keyof SimulatedAPIS['simulationEngine'] {
        const lowerDesign = designDetails.toLowerCase();
        if (lowerDesign.includes('molecular dynamics') || lowerDesign.includes('md')) return 'runMolecularDynamics';
        if (lowerDesign.includes('dft') || lowerDesign.includes('density functional theory')) return 'runDFT';
        if (lowerDesign.includes('thermal stability')) return 'runThermalStabilitySimulation';
        return 'runElectrochemicalModel'; // Default
    }

    private extractCharacterizationTechniques(designDetails: string): string[] {
        const techniques: string[] = [];
        if (designDetails.toLowerCase().includes('xrd')) techniques.push('XRD');
        if (designDetails.toLowerCase().includes('tem')) techniques.push('TEM');
        if (designDetails.toLowerCase().includes('sem')) techniques.push('SEM');
        if (designDetails.toLowerCase().includes('xps')) techniques.push('XPS');
        if (designDetails.toLowerCase().includes('eis')) techniques.push('EIS');
        if (designDetails.toLowerCase().includes('cyclic voltammetry') || designDetails.toLowerCase().includes('cycling')) techniques.push('Cycling');
        if (designDetails.toLowerCase().includes('raman')) techniques.push('Raman');
        if (designDetails.toLowerCase().includes('tga')) techniques.push('TGA');

        if (techniques.length === 0) return ['XRD', 'TEM', 'XPS']; // Default comprehensive set
        return techniques;
    }
}

// --- Main React Component ---

const AutonomousScientistView: React.FC = () => {
    const [goal, setGoal] = useState('Discover novel high-performance anode materials for next-generation solid-state lithium-ion batteries with enhanced cycle life, safety, and energy density.');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState<ResearchContext>({
        goal: '', // Will be updated on start
        currentPhase: ResearchPhase.IDLE,
        hypotheses: [],
        experiments: [],
        materialsDiscovered: [],
        logEntries: [],
        decisions: [],
        iterationCount: 0,
        maxIterations: 4, // Simulate 4 iterations for a more comprehensive demonstration
        ai: new MockGoogleGenAI({ apiKey: 'mock-api-key' }),
        budget: 100000, // Initial simulated budget
        timeElapsed: 0, // Initial simulated time
        researchReport: undefined,
    });

    // Memoize addLog to prevent unnecessary re-renders in child components if passed down
    const addLog = useCallback((entry: LogEntry) => {
        setContext(prev => ({
            ...prev,
            logEntries: [...prev.logEntries, entry]
        }));
    }, []);

    const runSimulation = async () => {
        setIsLoading(true);
        // Reset context for a new simulation run, preserving the goal from input
        setContext(prev => ({
            ...prev,
            goal: goal, // Use the current goal from the textarea
            currentPhase: ResearchPhase.IDLE,
            hypotheses: [],
            experiments: [],
            materialsDiscovered: [],
            logEntries: [],
            decisions: [],
            iterationCount: 0,
            researchReport: undefined, // Clear previous report
            budget: 100000, // Reset budget
            timeElapsed: 0, // Reset time
        }));

        const scientistAgent = new AutonomousScientistAgent(
            {
                ...context,
                goal: goal, // Ensure agent gets the latest goal
                ai: new MockGoogleGenAI({ apiKey: 'mock-api-key' }), // Re-initialize AI for a clean state in the agent
            },
            addLog,
            setContext // Pass the state setter directly to the agent to update context
        );

        await scientistAgent.runResearchCycle();
        setIsLoading(false);
    };

    // Auto-scroll log to the bottom
    const logEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [context.logEntries.length]);

    // Renders a colored badge for the current research phase
    const renderPhaseBadge = (phase: ResearchPhase) => {
        let colorClass = 'bg-gray-500';
        switch (phase) {
            case ResearchPhase.IDLE: colorClass = 'bg-gray-500'; break;
            case ResearchPhase.GOAL_DEFINITION: colorClass = 'bg-blue-600'; break;
            case ResearchPhase.LITERATURE_REVIEW: colorClass = 'bg-indigo-600'; break;
            case ResearchPhase.HYPOTHESIS_GENERATION: colorClass = 'bg-purple-600'; break;
            case ResearchPhase.EXPERIMENT_DESIGN: colorClass = 'bg-pink-600'; break;
            case ResearchPhase.SIMULATION_EXECUTION: colorClass = 'bg-orange-600'; break;
            case ResearchPhase.DATA_ANALYSIS: colorClass = 'bg-teal-600'; break;
            case ResearchPhase.HYPOTHESIS_REFINEMENT: colorClass = 'bg-lime-600'; break;
            case ResearchPhase.REPORT_GENERATION: colorClass = 'bg-emerald-600'; break;
            case ResearchPhase.ITERATION_CYCLE: colorClass = 'bg-cyan-600'; break;
            case ResearchPhase.COMPLETED: colorClass = 'bg-green-600'; break;
            case ResearchPhase.FAILED: colorClass = 'bg-red-600'; break;
            case ResearchPhase.SELF_CORRECTION: colorClass = 'bg-yellow-600'; break;
            case ResearchPhase.RESOURCE_MANAGEMENT: colorClass = 'bg-gray-600'; break;
        }
        return (
            <span className={`${colorClass} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                {phase.replace(/_/g, ' ')}
            </span>
        );
    };

    // Helper to format large numbers
    const formatNumber = (num: number, currency: boolean = false) => {
        if (currency) return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return num.toLocaleString('en-US');
    };

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gradient-to-br from-gray-900 to-black min-h-screen text-gray-100 font-sans">
            <h1 className="text-5xl font-extrabold text-white tracking-tight text-center pb-6 border-b-2 border-cyan-700/50">
                Blueprint 106: Autonomous Scientist AI
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
                The Autonomous Scientist AI is a cutting-edge agent orchestrating a comprehensive scientific research pipeline. From initial goal decomposition and extensive literature review to iterative hypothesis generation, sophisticated experiment design, multi-modal simulation execution, in-depth data analysis, and adaptive self-correction, it drives discovery towards a logical conclusion, culminating in a detailed scientific report. This system operates as a self-contained unit, simulating all external interactions to ensure a predictable and focused research environment.
            </p>

            <LocalCard title="Research Objective" className="bg-gray-800/70 border-cyan-800">
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-700/50 p-4 rounded-lg text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-y border border-gray-600"
                    placeholder="Define a complex scientific research goal here, e.g., 'Discover new high-temperature superconducting materials through computational design and synthesis simulation.'"
                />
                <button
                    onClick={runSimulation}
                    disabled={isLoading}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 rounded-xl text-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl text-white transform hover:scale-102"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {`Researching (Iteration ${context.iterationCount}/${context.maxIterations}) - ${context.currentPhase.replace(/_/g, ' ')}...`}
                        </div>
                    ) : 'Initiate Autonomous Research Cycle'}
                </button>
            </LocalCard>

            <LocalCard title="Research Overview" className="bg-gray-800/70 border-indigo-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-indigo-300 font-semibold">Current Phase:</span>
                        {renderPhaseBadge(context.currentPhase)}
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-purple-300 font-semibold">Iteration:</span>
                        <span className="text-white font-medium">{context.iterationCount} / {context.maxIterations}</span>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-green-300 font-semibold">Budget Remaining:</span>
                        <span className="text-white font-medium">{formatNumber(context.budget, true)}</span>
                    </div>
                     <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-yellow-300 font-semibold">Time Elapsed:</span>
                        <span className="text-white font-medium">{context.timeElapsed.toFixed(1)} hrs</span>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-cyan-300 font-semibold">Hypotheses:</span>
                        <span className="text-white font-medium">{context.hypotheses.length}</span>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between">
                        <span className="text-teal-300 font-semibold">Experiments:</span>
                        <span className="text-white font-medium">{context.experiments.length}</span>
                    </div>
                </div>
            </LocalCard>

            {(isLoading || context.logEntries.length > 0) && (
                <LocalCard title="Agent Activity Log" className="bg-gray-800/70 border-gray-700">
                    <div className="space-y-3 max-h-[70vh] min-h-[20vh] overflow-y-auto p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner">
                        {context.logEntries.map((entry, i) => (
                            <div key={i} className={`p-3 rounded-lg text-sm transition-all duration-100 border-l-4
                                ${entry.type === 'thought' ? 'bg-indigo-900/20 border-indigo-500 text-indigo-200' :
                                entry.type === 'action' ? 'bg-cyan-900/20 border-cyan-500 text-cyan-200' :
                                'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                            >
                                <strong className={`capitalize font-semibold ${entry.type === 'thought' ? 'text-indigo-400' : entry.type === 'action' ? 'text-cyan-400' : 'text-gray-400'}`}>{entry.type}:</strong> <span className="text-gray-200">{entry.content}</span>
                            </div>
                        ))}
                        {isLoading && <div className="text-yellow-400 animate-pulse p-3 rounded-lg bg-gray-700/30 border-l-4 border-yellow-500">Thinking... A complex simulation might take a while.</div>}
                        <div ref={logEndRef} />
                    </div>
                </LocalCard>
            )}

            {context.hypotheses.length > 0 && (
                <LocalCard title="Generated Hypotheses" className="bg-gray-800/70 border-purple-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {context.hypotheses.map(h => (
                            <div key={h.id} className="p-5 bg-gray-900/50 rounded-lg border border-gray-700 shadow-md transition-all duration-200 hover:shadow-lg hover:border-purple-600">
                                <h3 className="font-semibold text-purple-400 text-xl mb-3">Hypothesis {h.id.split('-')[1]}</h3>
                                <p className="text-gray-300 mb-4 leading-relaxed">{h.text}</p>
                                <div className="flex flex-wrap justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-3">
                                    <span className="flex items-center"><strong className="text-purple-300 mr-2">Target:</strong> <span className="text-white">{h.targetProperty}</span></span>
                                    <span className="flex items-center"><strong className="text-purple-300 mr-2">Status:</strong> <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${h.status === 'supported' ? 'bg-green-600/30 text-green-400' : h.status === 'refuted' ? 'bg-red-600/30 text-red-400' : 'bg-yellow-600/30 text-yellow-400'}`}>{h.status.replace(/_/g, ' ')}</span></span>
                                    <span className="flex items-center mt-2 w-full"><strong className="text-purple-300 mr-2">Predicted:</strong> <span className="text-white">{h.predictedEffect}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </LocalCard>
            )}

            {context.experiments.length > 0 && (
                <LocalCard title="Simulated Experiments & Characterizations" className="bg-gray-800/70 border-orange-800">
                    <div className="space-y-6">
                        {context.experiments.map(exp => (
                            <div key={exp.id} className="p-5 bg-gray-900/50 rounded-lg border border-gray-700 shadow-md transition-all duration-200 hover:shadow-lg hover:border-orange-600">
                                <h3 className="font-semibold text-orange-400 text-xl mb-2 flex justify-between items-center">
                                    {exp.name}
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${exp.status === 'completed' ? 'bg-green-600/30 text-green-400' : exp.status === 'failed' ? 'bg-red-600/30 text-red-400' : 'bg-yellow-600/30 text-yellow-400'}`}>
                                        {exp.status.toUpperCase()}
                                    </span>
                                </h3>
                                <p className="text-gray-300 text-sm mb-3">Type: <span className="font-medium text-white">{exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}</span></p>
                                <p className="text-gray-400 text-sm mb-4 italic leading-relaxed">{exp.designRationale.substring(0, 200)}{exp.designRationale.length > 200 ? '...' : ''}</p>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-400 border-t border-gray-700 pt-3">
                                    <span>Cost Est: <span className="text-white font-medium">{formatNumber(exp.costEstimate, true)}</span></span>
                                    <span>Time Est: <span className="text-white font-medium">{exp.timeEstimate.toFixed(1)} hrs</span></span>
                                    <span>Material ID: <span className="text-white font-medium">{exp.materialId || 'N/A'}</span></span>
                                    <span>Hypothesis ID: <span className="text-white font-medium">{exp.hypothesisId.split('-')[1]}</span></span>
                                    <span>Priority: <span className="text-white font-medium capitalize">{exp.priority}</span></span>
                                </div>
                                {exp.results && (
                                    <div className="mt-5 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-inner">
                                        <h4 className="font-semibold text-teal-400 text-lg mb-3">Simulation Results Summary:</h4>
                                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{exp.results.analysisSummary}</p>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                                            {exp.results.metrics.map((metric, idx) => (
                                                <li key={idx}>
                                                    {metric.name}: <span className="text-white font-medium">{metric.value}{metric.unit ? ` ${metric.unit}` : ''}</span>
                                                    {metric.interpretation && <span className="italic text-gray-500 ml-2">({metric.interpretation})</span>}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-right text-xs mt-4">Conclusion: <span className={`font-medium ${exp.results.conclusion === 'supported' ? 'text-green-400' : exp.results.conclusion === 'refuted' ? 'text-red-400' : 'text-yellow-400'}`}>{exp.results.conclusion.replace(/_/g, ' ')}</span> (Confidence: {(exp.results.confidenceScore * 100).toFixed(0)}%)</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </LocalCard>
            )}

            {context.materialsDiscovered.length > 0 && (
                <LocalCard title="Discovered Materials (Simulated)" className="bg-gray-800/70 border-emerald-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {context.materialsDiscovered.map(mat => (
                            <div key={mat.id} className="p-5 bg-gray-900/50 rounded-lg border border-gray-700 shadow-md transition-all duration-200 hover:shadow-lg hover:border-emerald-600">
                                <h3 className="font-semibold text-emerald-400 text-xl mb-2">{mat.name}</h3>
                                <p className="text-gray-300 text-sm mb-3">Composition: <span className="text-white font-medium">{Object.entries(mat.composition.elements).map(([el, val]) => `${el}${val}`).join('')}{mat.composition.dopants && Object.entries(mat.composition.dopants).map(([dop, val]) => `(${dop}:${(val*100).toFixed(1)}%)`)}</span></p>
                                {mat.composition.structure && <p className="text-gray-300 text-xs mb-3">Structure: <span className="text-white font-medium">{mat.composition.structure}</span></p>}
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 border-t border-gray-700 pt-3">
                                    {mat.properties.length > 0 ? mat.properties.map((prop, idx) => (
                                        <li key={idx}>
                                            {prop.name}: <span className="text-white font-medium">{prop.value}{prop.unit ? ` ${prop.unit}` : ''}</span>
                                            {prop.source && <span className="italic text-gray-500 ml-2">({prop.source})</span>}
                                        </li>
                                    )) : <li><span className="text-gray-500">No detailed properties characterized yet.</span></li>}
                                </ul>
                                <div className="flex justify-between items-center text-xs text-gray-500 mt-4 border-t border-gray-700 pt-3">
                                    <span>Discovered: {mat.discoveryDate}</span>
                                    <span>App: {mat.potentialApplications.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </LocalCard>
            )}

            {context.decisions.length > 0 && (
                <LocalCard title="Agent Decision History" className="bg-gray-800/70 border-blue-800">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 rounded-lg bg-gray-900/50 border border-gray-700 shadow-inner">
                        {context.decisions.map((decision, i) => (
                            <div key={i} className={`p-3 rounded-lg text-sm border-l-4
                                ${decision.outcome === 'success' ? 'bg-green-900/20 border-green-500 text-green-200' :
                                decision.outcome === 'failure' ? 'bg-red-900/20 border-red-500 text-red-200' :
                                'bg-blue-900/20 border-blue-500 text-blue-200'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <strong className="text-blue-400">{decision.phase.replace(/_/g, ' ')}</strong>
                                    <span className="text-xs text-gray-400">{new Date(decision.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-gray-200 mb-1">{decision.description}</p>
                                {decision.reasoning && <p className="text-xs italic text-gray-400">Reasoning: {decision.reasoning}</p>}
                                {/* {decision.details && <details className="text-xs text-gray-500 cursor-pointer"><summary>Details</summary><pre className="whitespace-pre-wrap">{JSON.stringify(decision.details, null, 2)}</pre></details>} */}
                            </div>
                        ))}
                    </div>
                </LocalCard>
            )}

            {context.researchReport && context.currentPhase === ResearchPhase.COMPLETED && (
                <LocalCard title="Final Research Report: Publication Draft" className="bg-gray-800/70 border-cyan-800">
                    <h2 className="text-4xl font-bold text-white mb-4 text-center">{context.researchReport.title}</h2>
                    <p className="text-gray-400 text-md mb-6 text-center">By: {context.researchReport.author} | Date: {context.researchReport.date}</p>

                    <div className="space-y-8 text-gray-300 text-base leading-relaxed">
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Abstract</h3>
                            <p className="text-lg">{context.researchReport.abstract}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Introduction</h3>
                            <p>{context.researchReport.introduction}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Hypotheses</h3>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                {context.researchReport.hypotheses.map((h, i) => (
                                    <li key={i}>
                                        <strong className="text-white">H{i + 1}:</strong> {h.text} (Status: <span className={`${h.status === 'supported' ? 'text-green-400' : h.status === 'refuted' ? 'text-red-400' : 'text-yellow-400'}`}>{h.status.replace(/_/g, ' ')}</span>)
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Methodology & Experiments</h3>
                            <div className="space-y-4 pl-4">
                                {context.researchReport.experiments.map((exp, i) => (
                                    <div key={i} className="bg-gray-900/50 p-4 rounded border border-gray-700 shadow-sm">
                                        <h4 className="font-semibold text-purple-300 text-lg">{exp.name} ({exp.type.charAt(0).toUpperCase() + exp.type.slice(1)})</h4>
                                        <p className="text-sm italic text-gray-400 mt-1">{exp.designRationale.substring(0, 150)}...</p>
                                        {exp.results && (
                                            <p className="text-sm mt-2 text-gray-300">Summary: {exp.results.analysisSummary}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Results Summary</h3>
                            <p>{context.researchReport.resultsSummary}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Discussion</h3>
                            <p>{context.researchReport.discussion}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Conclusion</h3>
                            <p>{context.researchReport.conclusion}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Future Work & Recommendations</h3>
                            <p>{context.researchReport.futureWork}</p>
                            <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-400">
                                {context.researchReport.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                        {context.researchReport.citations.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-semibold text-cyan-300 mb-3 border-b border-gray-700 pb-1">Citations</h3>
                                <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                                    {context.researchReport.citations.map((citation, i) => (
                                        <li key={i}>{citation}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </LocalCard>
            )}

            {context.currentPhase === ResearchPhase.FAILED && (
                <LocalCard title="Research Cycle Failed" className="bg-red-900/40 border-red-700 shadow-xl">
                    <p className="text-red-300 text-xl text-center">
                        The autonomous scientist encountered a critical error and could not complete the research goal.
                        Please review the Agent Activity Log and Decision History for details to understand the failure.
                    </p>
                </LocalCard>
            )}

            <div className="text-center text-gray-500 text-sm mt-12 pb-8">
                Autonomous Scientist AI v1.0.1 - Advanced Simulated Research Environment.
            </div>
        </div>
    );
};

export default AutonomousScientistView;