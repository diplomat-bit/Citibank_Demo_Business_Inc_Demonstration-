
# A Calculus of Stateful Interaction for Distributed Systems

## Abstract

This document provides a formal specification of the application's external API, modeling it as a Mealy machine, a type of finite state automaton. In this model, the API's state is defined by the collection of all server-side resources. Each API endpoint is a transition function `δ` that, given the current state and an input (the HTTP request), produces a new state and an output (the HTTP response). The OpenAPI specification is the formal definition of this machine's alphabet, states, and transition functions.

---

## 1. Formal Definition of the API Automaton

The API is a deterministic finite automaton `M` defined by a 6-tuple `(S, S_0, Σ, Λ, T, G)`, where:

-   `S`: A finite set of states, representing the state of all data resources.
-   `S_0 ⊂ S`: The set of initial states.
-   `Σ`: A finite set called the input alphabet, representing all possible valid HTTP requests (method, path, headers, body).
-   `Λ`: A finite set called the output alphabet, representing all possible HTTP responses.
-   `T`: The state transition function, `T: S × Σ → S`.
-   `G`: The output function, `G: S × Σ → Λ`.

---

## 2. API Endpoints as Transition Functions

Each path and method combination in the OpenAPI specification defines a specific transition function.

**Function 2.1: The `GET` Request as an Observation Function**
A `GET` request is an identity transition with an output. The state of the system is unchanged.

Let `σ_get ∈ Σ` be a `GET` request.
`T(s, σ_get) = s`
The output `λ = G(s, σ_get)` is a representation of some subset of the state `s`.

**Function 2.2: The `POST` Request as a Creation Function**
A `POST` request transitions the system to a new state `s'` that includes a new resource.

Let `σ_post ∈ Σ` be a `POST` request for creating a resource `r`.
`T(s, σ_post) = s ∪ {r}`
The output `λ = G(s, σ_post)` typically includes a representation of the newly created resource `r` and a `201 Created` status code.

**Function 2.3: The `PUT` Request as an Update Function**
A `PUT` request transitions a resource `r ∈ s` to a new state `r'`.

Let `σ_put ∈ Σ` be a `PUT` request for updating resource `r`.
`T(s, σ_put) = (s \ {r}) ∪ {r'}`
The output `λ = G(s, σ_put)` is typically a `200 OK` response with the updated resource `r'`.

---

## 3. Constants and Constraints

**Constant 3.1: Idempotency of `PUT` and `DELETE`**
For any `σ_put` or `σ_delete` request, applying the function multiple times yields the same state as applying it once.
`T(T(s, σ), σ) = T(s, σ)`.

**Constant 3.2: Safety of `GET`**
The `GET` method is defined as "safe," meaning `T(s, σ_get) = s` for all `s ∈ S`. This is a fundamental constant of the HTTP protocol as implemented here.

---

## 4. Conclusion

This state machine formalism provides a precise and unambiguous definition of the API's behavior. It allows for formal verification of API properties, such as reachability of states and guaranteed termination of workflows. The OpenAPI specification serves as the human-readable encoding of this underlying mathematical machine.
