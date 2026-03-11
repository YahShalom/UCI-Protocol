# UCI Minimal Specification v0.1

## Purpose

This document defines the minimal viable specification for the Universal Capability Interface (UCI) protocol, version 0.1. Its purpose is to establish the smallest set of primitives required to implement a functioning UCI node and ensure interoperability between independent implementations.

This version intentionally limits scope to the core primitives required for execution governance and evidence recording, deferring more advanced features like complex policy enforcement and federated trust to future versions.

---

## Core Concepts

UCI is founded on four primitive data structures that model the lifecycle of a governed action.

*   **`IntentRequest`**: A structured object representing an actor's goal.
*   **`ExecutionPlan`**: A sequence of steps a UCI node will take to fulfill the intent.
*   **`EvidenceChain`**: An immutable, verifiable record of the execution process.
*   **`Outcome`**: The final result of the execution.

---

## IntentRequest

The `IntentRequest` is the entry point for all UCI executions. It is a machine-readable object that declares the desired action and its context.

A compliant `IntentRequest` MUST include the following fields:

*   **`id`** (string): A unique identifier for this request, typically a UUID.
*   **`actor`** (string): An identifier for the entity (user or system) initiating the request.
*   **`capability`** (string): The unique identifier of the capability to be invoked.
*   **`parameters`** (object): A JSON object containing the arguments for the capability.
*   **`constraints`** (object, optional): A set of conditions or policies that must be met for execution. For v0.1, this is optional and may be ignored by a minimal node.
*   **`timestamp`** (string): An ISO 8601 timestamp indicating when the request was created.

---

## ExecutionPlan

Upon receiving and validating an `IntentRequest`, a UCI node MUST generate an `ExecutionPlan`. This plan represents the node's internal strategy for satisfying the intent. For v0.1, this plan may be a simple, single-step execution.

A compliant `ExecutionPlan` MUST contain:

*   **`plan_id`** (string): A unique identifier for this plan.
*   **`intent_id`** (string): The ID of the `IntentRequest` this plan corresponds to.
*   **`steps`** (array): An ordered list of action steps the node will perform.

---

## EvidenceChain

The `EvidenceChain` is the core artifact of a UCI execution. It is a tamper-evident log structured as a cryptographically linked list of events.

Each step in the chain MUST contain:

*   **`step_id`** (string): A unique identifier for this step.
*   **`timestamp`** (string): An ISO 8601 timestamp for when the event occurred.
*   **`action`** (string): A description of the action taken (e.g., "VALIDATE_INTENT", "EXECUTE_CAPABILITY").
*   **`result`** (object): The outcome of the action.
*   **`hash_previous`** (string): The cryptographic hash (e.g., SHA-256) of the preceding step in the chain. The first step's `hash_previous` is `null`.

This structure allows for deterministic replay and verification, as any modification to a step would invalidate the hashes of all subsequent steps.

---

## Outcome

The `Outcome` is the final object returned to the client upon completion of an execution. It provides a summary of the result and a reference to the evidence.

A compliant `Outcome` object MUST include:

*   **`status`** (string): The final status of the execution (e.g., "SUCCESS", "ERROR", "DENIED").
*   **`result`** (object, optional): Any data returned by the capability upon successful execution.
*   **`evidence_chain_id`** (string): The unique identifier of the full `EvidenceChain` associated with this execution.

---

## Protocol Endpoints

A compliant UCI v0.1 node MUST expose the following HTTP endpoints.

*   **`POST /api/uci/execute`**: Accepts an `IntentRequest` and initiates execution. It MUST return an `Outcome` object upon completion.
*   **`POST /api/uci/replay`**: Accepts an `EvidenceChain` (or its ID) and performs replay verification. It MUST return a verification status.
*   **`GET /.well-known/uci`**: The discovery endpoint. It MUST return a JSON document describing the node.

---

## Discovery Document

The discovery endpoint (`/.well-known/uci`) MUST return a JSON object containing metadata about the node.

The document MUST include:

*   **`node_id`** (string): A unique identifier for this UCI node.
*   **`protocol_version`** (array): A list of UCI protocol versions supported by the node (e.g., `["0.1"]`).
*   **`supported_capabilities`** (array): A list of capability identifiers that this node exposes.

---

## Deterministic Replay

A key feature of UCI is the ability to verify an `EvidenceChain`. A compliant node's replay endpoint MUST be able to receive an `EvidenceChain` and programmatically verify its integrity.

The verification process involves recalculating the hash of each step and ensuring it matches the `hash_previous` field of the next step, confirming that the chain has not been tampered with.

---

## Versioning

UCI follows Semantic Versioning (SemVer). This document defines version 0.1 of the protocol. Minor and patch releases in the 0.x series will be backward-compatible. A 1.0 release will mark the first stable, production-ready version of the protocol.

---

## Implementation Notes

Developers implementing a UCI v0.1 node should adhere to the following principles:

*   **Stateless Endpoints:** All HTTP endpoints should be stateless. All information required to process a request should be contained within the request itself.
*   **JSON Transport:** All protocol objects (`IntentRequest`, `Outcome`, etc.) MUST be transported as JSON.
*   **Language-Agnostic Design:** The protocol is defined by its data structures and HTTP interfaces, not by a specific programming language.

---

## Summary

UCI v0.1 establishes the foundational primitives for verifiable agent execution: a structured way to express intent, a mechanism for planning and execution, an immutable evidence record, and a final outcome. This minimal specification provides a solid, interoperable foundation upon which the future of the agent ecosystem can be built.
