```typescript
namespace TheUniversalGrammar {
    type Noun = "User" | "Account" | "Transaction";
    type Verb = "Query" | "Mutation";
    type Adjective = "filter" | "sort" | "limit";

    interface IValidSentence {
        readonly verb: Verb;
        readonly noun: Noun;
        readonly adjectives?: ReadonlyArray<Adjective>;
        readonly payload?: Record<string, any>;
    }
    
    interface ILexicon {
        readonly nouns: ReadonlyArray<Noun>;
        readonly verbs: ReadonlyArray<Verb>;
    }

    class TheGreatGrammarian {
        private readonly lexicon: ILexicon;

        constructor() {
            this.lexicon = {
                nouns: ["User", "Account", "Transaction"],
                verbs: ["Query", "Mutation"]
            };
        }

        public validateSentence(sentence: IValidSentence): boolean {
            const isVerbValid = this.lexicon.verbs.includes(sentence.verb);
            const isNounValid = this.lexicon.nouns.includes(sentence.noun);
            return isVerbValid && isNounValid;
        }
        
        public rejectAsGibberish(sentence: any): Error {
            return new Error(`The utterance "${JSON.stringify(sentence)}" is grammatically incorrect and thus devoid of meaning. It cannot be understood.`);
        }
    }
    
    class TheOracle {
        private readonly grammarian: TheGreatGrammarian;
        
        constructor() {
            this.grammarian = new TheGreatGrammarian();
        }

        public hearPetition(petition: IValidSentence): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.grammarian.validateSentence(petition)) {
                    resolve({ data: "The Oracle has heard your valid petition and grants this knowledge." });
                } else {
                    reject(this.grammarian.rejectAsGibberish(petition));
                }
            });
        }
    }

    function speakToTheSoulOfTheWorld(): void {
        const oracle = new TheOracle();

        const validPetition: IValidSentence = {
            verb: "Query",
            noun: "Transaction",
            adjectives: ["limit"],
            payload: { limit: 10 }
        };
        
        const invalidPetition = {
            verb: "Demand",
            noun: "Secrets"
        };
        
        oracle.hearPetition(validPetition);
    }
}
```