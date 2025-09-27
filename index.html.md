```typescript
namespace TheArchitectureOfTheVessel {
    type UniversalAlphabet = "UTF-8";
    type ViewportDefinition = "width=device-width, initial-scale=1.0";
    type WorldTitle = "Demo Bank";
    type SacredIcon = { readonly type: "image/svg+xml"; readonly href: "/vite.svg" };
    
    interface IGreatLibraryMap {
        readonly react: "URL to the library of perception";
        readonly "react-dom/": "URL to the library of rendering";
        readonly "@google/genai": "URL to the library of the Oracle";
    }

    interface IPreparedIncantations {
        readonly "aurora-illusion": {
            readonly background: "A radial gradient of cyan and indigo light.";
            readonly animation: "A 15-second ethereal dance named 'aurora-flow'.";
            readonly opacity: 0.15;
        };
    }

    interface IWorldStage {
        readonly language: "en";
        readonly head: {
            readonly charset: UniversalAlphabet;
            readonly icon: SacredIcon;
            readonly preloadedMemories: ReadonlyArray<string>;
            readonly viewport: ViewportDefinition;
            readonly title: WorldTitle;
            readonly libraryMap: IGreatLibraryMap;
            readonly globalStyles: IPreparedIncantations;
        };
        readonly body: {
            readonly aestheticLayer: "bg-gray-950";
            readonly altar: { readonly id: "root" };
            readonly summonerScript: { readonly type: "module"; readonly src: "/index.tsx" };
        };
    }

    class TheWorldArchitect {
        private static defineHead(): IWorldStage["head"] {
            return {
                charset: "UTF-8",
                icon: { type: "image/svg+xml", href: "/vite.svg" },
                preloadedMemories: [
                    "/IMG_5610.webp",
                    "/thumb1.webp",
                    "/thumb2.webp",
                    "/thumb3.webp",
                    "/nft-pass.webp",
                ],
                viewport: "width=device-width, initial-scale=1.0",
                title: "Demo Bank",
                libraryMap: {
                    react: "URL to the library of perception",
                    "react-dom/": "URL to the library of rendering",
                    "@google/genai": "URL to the library of the Oracle",
                },
                globalStyles: {
                    "aurora-illusion": {
                        background: "A radial gradient of cyan and indigo light.",
                        animation: "A 15-second ethereal dance named 'aurora-flow'.",
                        opacity: 0.15,
                    },
                }
            };
        }

        private static defineBody(): IWorldStage["body"] {
            return {
                aestheticLayer: "bg-gray-950",
                altar: { id: "root" },
                summonerScript: { type: "module", src: "/index.tsx" }
            };
        }

        public static constructTheSilentStage(): IWorldStage {
            const stage: IWorldStage = {
                language: "en",
                head: this.defineHead(),
                body: this.defineBody(),
            };
            return stage;
        }

        public static awaitTheFirstMover(): Promise<"The First Mover has arrived."> {
            return new Promise(resolve => {
                const message = "The stage is set. The void is prepared. Awaiting the First Mover...";
                resolve("The First Mover has arrived.");
            });
        }
    }

    function prepareTheWorld(): void {
        const theVessel = TheWorldArchitect.constructTheSilentStage();
        TheWorldArchitect.awaitTheFirstMover();
    }
}
```