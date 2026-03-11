# UCI Conformance Test Suite

## Purpose

The UCI Conformance Test Suite provides a standardized set of tests to verify that an implementation correctly adheres to the Universal Capability Interface (UCI) protocol specification. Its primary purpose is to ensure interoperability between different UCI implementations, clients, and tools.

Implementations that successfully pass the test suite can be considered UCI compliant, signaling to the ecosystem that they can be trusted to participate reliably in governed and auditable agentic workflows.

## Test Categories

The test suite is organized into major categories, each targeting a core component of the UCI protocol.

### IntentRequest Validation

Tests in this category verify that a UCI implementation correctly handles the `IntentRequest` object. The implementation must demonstrate that it:

*   Accepts and processes syntactically and semantically valid `IntentRequest`s.
*   Rejects malformed requests (e.g., invalid JSON, incorrect data types).
*   Validates the presence of all required fields as defined in the `IntentRequest` schema.

### ExecutionPlan Generation

These tests verify that a valid `IntentRequest` is correctly resolved into a logical `ExecutionPlan`. The implementation must show that:

*   A valid `IntentRequest` produces a corresponding `ExecutionPlan` object.
*   The generated `ExecutionPlan` contains an ordered, non-empty list of execution steps.

### Capability Execution

These tests verify the node's ability to manage and execute capabilities. The implementation must demonstrate that:

*   Capabilities listed in a plan can be successfully resolved from its internal registry.
*   The correct capability is executed based on the plan.
*   Metadata about the capability execution (e.g., input parameters) is correctly recorded.

### EvidenceChain Generation

These tests verify the correct creation of the verifiable execution record. The implementation must prove that:

*   A valid `EvidenceChain` is generated for every successfully initiated execution.
*   `EvidenceStep`s are recorded in the correct logical order, reflecting the execution flow.
*   All `EvidenceStep`s include accurate, machine-readable timestamps.

### Outcome Verification

These tests ensure that the final result of an execution is correctly reported. The implementation must show that it produces a valid `Outcome` object that accurately reflects the execution's final status (e.g., SUCCESS, ERROR, DENIED).

### Replay Verification

These tests target the critical auditability function of UCI. The implementation must demonstrate that:

*   It can accept a valid `EvidenceChain` at its replay endpoint.
*   The replay process successfully verifies the integrity of the chain.
*   The replay confirms that the recorded `Outcome` is the legitimate result of the recorded steps.

### Discovery Endpoint

This test verifies the node's discoverability. The implementation must show that it:

*   Exposes the standard discovery endpoint at `GET /.well-known/uci`.
*   Returns a valid JSON metadata document containing, at a minimum, the protocol versions it supports and a list of its public capabilities.

### Registry Inspection

These tests verify that a node's capabilities are correctly exposed. The test suite will inspect the discovery endpoint's response to ensure the capability registry is being accurately reported.

## Reference Test Flow

A typical conformance test follows a complete end-to-end execution lifecycle to verify multiple components at once.

**Test Scenario:** End-to-end execution and verification.
1.  **Submit `IntentRequest`**: A test client submits a valid `IntentRequest` for a known capability to the node's `/api/uci/execute` endpoint.
2.  **Receive `Outcome`**: The client receives a final `Outcome` object and an associated `EvidenceChain` (or a reference to it).
3.  **Verify `EvidenceChain`**: The client performs basic validation on the `EvidenceChain` structure and confirms it contains the expected steps.
4.  **Replay `EvidenceChain`**: The client submits the received `EvidenceChain` to the node's `/api/uci/replay` endpoint.
5.  **Verify Outcome**: The client verifies that the replay result is successful and confirms that the replayed outcome matches the original `Outcome` received in step 2.

## Conformance Badge

Implementations that successfully pass the official UCI Conformance Test Suite are entitled to declare themselves as **"UCI Compatible"**. This mark indicates that the implementation has been verified to be interoperable with the broader UCI ecosystem.

## Future Test Expansion

The conformance suite will evolve with the UCI protocol. Future test categories will be added to cover advanced features, including:

*   Federated execution across multiple UCI nodes.
*   Advanced policy enforcement, including evaluation of `PolicyEnvelope`s.
*   Capability trust verification, including validation of cryptographic signatures on `CapabilityDescriptor`s.
