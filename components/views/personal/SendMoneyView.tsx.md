
# The Sending: The Direction of Energy

**(This is not a form. It is a conduit for the will. It is the chamber where potential energy is transformed into kinetic energy, an act not of spending, but of focused, deliberate transmission.)**

The `SendMoneyView`, or Remitrax, is where your financial power becomes an active force in the world. It is the art of directing a stream of your own accumulated energy from your sphere of influence into another's. This is a profound act, and the Instrument treats it with the gravity it deserves. It is not a casual expense; it is a transfer, a projection of your resources.

This view is a testament to the idea of a multi-rail world. It recognizes that value flows through different channels, each with its own protocol and culture. The choice between `quantumpay` and `cashapp` is not merely a technical one. It is a choice of language. QuantumPay, with its reference to `ISO 20022`, speaks the formal, structured language of global finance, a language of precision, remittance data, and institutional interoperability. Cash App speaks the fluid, social language of the peer-to-peer economy, a language of cashtags and immediate connection. The Remitrax is bilingual, fluent in both.

The true heart of this component is the `BiometricModal`. This is the final, sacred seal upon the act of sending. It is the ultimate expression of the principle that your financial will is inseparable from your physical self. By requiring your face, your living identity, to authorize the transfer, the Instrument makes the act of sending deeply personal and undeniably intentional. The animation of the `QuantumLedger` is not mere decoration; it is a ritual, a visualization of the transaction being inscribed into the immutable digital reality, secured by a power beyond any single institution.

The entire flow, from choosing a rail to the final biometric confirmation, is designed to be deliberate. It transforms a simple payment into a conscious act. You are not just "spending money." You are choosing a protocol, defining a recipient, and sealing the directive with your own identity. It is the commander's console for directing the flow of your resources across the world.

***

### **The Doctrine of Sealed Intent**

**Jurisprential Precedent:** Be it established that any transfer of monetary value initiated through the `SendMoneyView` must be ratified by a "Biometric Seal" provided by the User. This seal, captured and verified by the `BiometricModal`, shall constitute a non-repudiable, legally binding confirmation of the User's intent. Once an intent is so sealed, the resulting transaction is considered final and irrevocable (*actus non facit reum nisi mens sit rea*—the act does not make a person guilty unless the mind is also guilty, and the seal proves the mind). The System is mandated to log the cryptographic proof of this biometric seal in the permanent audit trail alongside the transaction record, serving as absolute proof of authorization.

```ts
// The Edict of the Seal
import { Intent, Transaction, BiometricSignature, Ledger } from '@world/concepts';

// Let it be known that a command must be sealed by the commander's own image.
class TheRoyalSealer {

  // The rite of sealing an intent.
  public static sealIntent(intent: Intent, signature: BiometricSignature): Transaction {
    if (!signature.isAuthentic()) {
      throw new ForgeryError("The biometric seal is not authentic. Intent is void.");
    }
    
    // The seal transforms a mere intent into an irrevocable act.
    const transaction = new Transaction(intent);
    transaction.applySeal(signature.getProof());

    return transaction;
  }
  
  // The sealed act is then inscribed into the history of the world.
  public static inscribeSealedAct(ledger: Ledger, transaction: Transaction): void {
    if (!transaction.isSealed()) {
      throw new UnsealedActError("Cannot inscribe an unsealed act into the Great Ledger.");
    }
    ledger.append(transaction);
  }
}
```

**Observation:** The commoner is told that biometric confirmation is the pinnacle of security, protecting them from unauthorized transactions. This is a powerful security feature. They are not prompted to reflect on the consequence of this absolute, non-repudiable act. The Doctrine of Sealed Intent makes every transfer final and irrevocable. There is no room for error, no possibility of appeal, no "undo" button for a mistaken payment. The law that provides perfect security also removes the possibility of grace. The system protects the user from others, but it offers no protection from their own simple, human mistakes. The seal is absolute, and so is the consequence of any error made in its application.
