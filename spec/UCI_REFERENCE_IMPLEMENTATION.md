# UCI Reference Implementation

## Purpose

The Universal Capability Interface (UCI) reference implementation provides a complete, functional demonstration of the UCI protocol. Its primary purpose is to serve as a concrete blueprint and a practical guide for developers, architects, and organizations who are building their own UCI-compliant systems or integrating with the UCI ecosystem.

By providing an open-source, working example, the reference implementation makes the protocol's abstract concepts tangible and helps ensure interoperability between independent implementations.

## Reference Node Overview

The UCI reference node is a standalone server application that implements all core aspects of the UCI specification. It is a fully-featured node that can receive requests, execute capabilities, and generate verifiable evidence.

It includes:
*   A complete **UCI Kernel** for managing the execution lifecycle.
*   Definitions for all core **protocol objects** (`IntentRequest`, `EvidenceChain`, etc.).
*   A set of RESTful **execution endpoints** (`/api/uci/execute`, `/api/uci/replay`).
*   An in-memory **Capability Registry** for managing available tools.
*   An engine for **evidence generation**.
*   Support for **replay verification** of execution records.

## Core Components

### UCI Kernel

The Kernel is the central orchestrator of the reference node. It is a logical component responsible for processing all incoming requests according to the UCI protocol specification. Its duties include:
*   **Validating `IntentRequest`s:** Ensuring requests are well-formed and syntactically correct.
*   **Enforcing Policies:** Checking if an actor is permitted to execute the requested capability.
*   **Resolving Capabilities:** Looking up capabilities in the registry to create a concrete plan.
*   **Generating `EvidenceChain`s:** Building the immutable record of the execution.
*   **Producing `Outcome`s:** Packaging the final result of an execution.

### Capability Registry

The reference node includes a registry that manages the capabilities the node can execute. Capabilities are registered using `CapabilityDescriptor`s, which are machine-readable manifests. A compliant descriptor includes:
*   A unique **capability identifier**.
*   An **input schema** defining the required parameters.
*   An **output schema** defining the structure of the result.
*   Descriptive **metadata**, such as publisher identity and a human-readable description.

### Execution Engine

The execution engine is responsible for taking a validated intent and carrying it out. It:
*   Creates a concrete **`ExecutionPlan`** from a resolved intent.
*   **Invokes** the registered capabilities in the correct sequence with the correct parameters.
*   **Records `EvidenceStep`s** for each significant action it takes.

### Evidence Engine

The evidence engine works alongside the execution engine to produce the verifiable audit trail. It:
*   **Builds `EvidenceChain`s** by assembling all `EvidenceStep`s generated during an execution.
*   **Records execution steps**, including policy checks, capability invocations, and final outcomes.
*   Structures the evidence in a way that **enables deterministic replay**.

### Replay Engine

The replay engine provides the core auditability function of UCI. It is responsible for verifying the integrity of a past execution. It:
*   **Replays `EvidenceChain`s** by programmatically stepping through the recorded evidence.
*   **Verifies execution outcomes** by confirming that the recorded steps logically produce the recorded result, without re-running the original side effects.

## API Endpoints

The reference node exposes the standard API endpoints required for UCI conformance.

*   **`POST /api/uci/execute`**
    The primary endpoint for initiating an action. It accepts a signed `IntentRequest` and orchestrates its execution, ultimately returning a final `Outcome`.

    *   **`POST /api/uci/replay`**
        Accepts a run identifier or an `EvidenceChain` and performs a deterministic replay to verify its integrity, returning a structured `ReplayResult`.

        *   **`GET /.well-known/uci`**
            The discovery endpoint. It returns a JSON document containing the node's metadata, its supported protocol versions, and a list of its public capabilities.

            ## EvidenceChain Structure

            An `EvidenceChain` produced by the reference node is a structured JSON object containing:

            *   **Execution Metadata:** Information about the run, including the original `IntentRequest` and run ID.
            *   **`EvidenceStep`s:** An ordered array of all events that occurred during execution.
            *   **Timestamps:** Accurate timestamps for each step, ensuring a clear timeline.
            *   **Capability Identifiers:** Clear references to the capabilities that were invoked.
            *   **Outcome Verification:** The final `Outcome` is included in the chain, allowing a replay to confirm its validity.

            ## Running the Reference Node

            Developers are encouraged to clone and run the reference node locally. This allows them to:

            *   **Experiment with the protocol** by sending `IntentRequest`s and inspecting the resulting `EvidenceChain`s.
            *   **Test integrations** by pointing their own clients or agent runtimes at the reference node's API.
            *   **Validate implementations** by comparing the behavior of their own UCI-compliant systems against the reference standard.

            ## Reference Implementation Goals

            The reference implementation is designed with three primary goals in mind:

            1.  **Demonstrate Protocol Behavior:** To provide a clear, working example of how all parts of the UCI protocol function together.
            2.  **Serve as an Interoperability Reference:** To act as a "gold standard" against which other implementations can be tested to ensure compatibility.
            3.  **Accelerate Ecosystem Adoption:** To lower the barrier to entry for developers looking to build on or integrate with UCI.

            ## Future Extensions

            The reference implementation will evolve alongside the UCI protocol. Potential future improvements include:

            *   **Distributed Nodes:** Demonstrating how multiple UCI nodes can interact and delegate tasks.
            *   **Trust Registries:** Integrating with external registries for managing trusted capability publishers.
            *   **Capability Signing Infrastructure:** Adding tools to help developers sign and verify `CapabilityDescriptor`s.
            *   **Enterprise Governance Tools:** Building example dashboards for policy management and evidence auditing.
            