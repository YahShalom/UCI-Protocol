# UCI Conformance Specification

## 1. Introduction

Conformance to the Universal Capability Interface (UCI) specification is essential for ensuring that independent implementations can interoperate reliably within the broader AI agent ecosystem. This document defines the set of rules and requirements that an implementation MUST adhere to in order to be considered UCI compliant.

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

-   **MUST**: This word, or the terms "REQUIRED" or "SHALL", means that the definition is an absolute requirement of the specification.
-   **SHOULD**: This word, or the adjective "RECOMMENDED", means that there may exist valid reasons in particular circumstances to ignore a particular item, but the full implications must be understood and carefully weighed before choosing a different course.
-   **MAY**: This word, or the adjective "OPTIONAL", means that an item is truly optional. One vendor may choose to include the item because a particular marketplace requires it or because it enhances the product while another vendor may omit the same item.

## 3. Core Compliance Requirements

A compliant UCI implementation **MUST** perform the following core functions to manage the execution lifecycle:

-   It **MUST** accept a valid `IntentRequest` object as the primary input for initiating an action.
-   It **MUST** validate the structure and syntax of a received `IntentRequest` against the protocol specification.
-   It **MUST**, upon successful validation and policy approval of an `IntentRequest`, generate a machine-readable `ExecutionPlan`.
-   It **MUST** produce an `EvidenceChain` containing a verifiable record of the steps taken during the execution of an `ExecutionPlan`.
-   It **MUST** produce a final `Outcome` object that reports the status (e.g., SUCCESS, ERROR, DENIED) and any result of the execution.
-   It **MUST** expose a UCI execution endpoint (e.g., `/api/uci/execute`) for receiving `IntentRequest` objects.

## 4. Evidence Requirements

To ensure auditability and verifiability, a compliant UCI node **MUST** adhere to the following evidence generation requirements:

-   It **MUST** produce one or more `EvidenceStep` objects for any non-trivial execution.
-   Each `EvidenceStep` **MUST** record an accurate, machine-readable timestamp (e.g., ISO 8601) of when the event occurred.
-   Any `EvidenceStep` related to the execution of a capability **MUST** include the unique identifier of that capability.
-   It **MUST** ensure the cryptographic integrity of the `EvidenceChain` and its constituent `EvidenceStep`s, typically through digital signatures. Tampering with a persisted chain **MUST** be detectable.

## 5. Deterministic Replay

A compliant UCI node **MUST** provide a mechanism for the deterministic replay verification of a persisted `EvidenceChain`.

-   This mechanism, typically an API endpoint (e.g., `/api/uci/replay`), **MUST** accept an `EvidenceChain` or a run identifier as input.
-   The replay process **MUST NOT** re-execute the original capabilities' side effects.
-   The replay **MUST** cryptographically verify the integrity of the `EvidenceChain` and its steps.
-   The replay **MUST** confirm that the logical flow of evidence from the initial `IntentRequest` to the final `Outcome` is consistent and that the recorded outcome matches the result derived from the evidence.

## 6. Capability Verification

To maintain a secure and trusted ecosystem, `CapabilityDescriptor`s **MUST** be handled as follows:

-   A compliant node **MUST** be able to parse `CapabilityDescriptor`s to identify their origin (e.g., publisher identity) and interface.
-   `CapabilityDescriptor`s **MUST** support optional cryptographic signatures. A compliant node **MUST** be able to process both signed and unsigned descriptors.
-   If a signature is present on a `CapabilityDescriptor`, a compliant node **MUST** be able to perform integrity validation by verifying the signature against a configured trust store.

## 7. Discovery Requirements

For interoperability, a compliant UCI node **MUST** support service discovery.

-   A compliant node **MUST** expose a discovery document at the well-known URI: `/.well-known/uci`.
-   This endpoint **MUST** return a machine-readable document (e.g., a JSON object) containing metadata about the node.
-   The returned metadata **MUST** include the node's unique identifier, the version(s) of the UCI protocol it supports, and a list of the public capabilities it exposes.

## 8. Conformance Test Suite

To facilitate and verify compliance, a public UCI conformance test suite will be made available.

-   A UCI implementation **SHOULD** pass all applicable tests in this suite to be considered fully compliant and to ensure robust interoperability with the wider ecosystem.

## 9. Versioning

To manage the evolution of the protocol, UCI uses a versioning scheme.

-   A compliant node **MUST** declare the specific version(s) of the UCI protocol it conforms to.
-   This version information **MUST** be included in the metadata returned from the `/.well-known/uci` discovery endpoint. This allows clients and other nodes to determine compatibility before initiating communication.
