# UCI Protocol v0.1

## 1. Introduction

The Universal Capability Interface (UCI) is a protocol for interoperability between AI agents and systems. It provides a governance and evidence layer that sits above existing agent-to-agent (A2A) and multi-capability-protocol (MCP) communication. UCI enables a standardized way to request actions, record evidence of their execution, and enforce policies, providing a semantic, policy, and evidence profile layer.

## 2. Protocol Objects

UCI v0.1 defines five core data structures that represent the key elements of a governed execution.

### IntentRequest

The `IntentRequest` is the primary input to the UCI kernel. It represents a user's goal in a structured format, including the actor who initiated it and any contextual hints for execution.

- **Schema:** [schemas/v0.1/IntentRequest.json](./schemas/v0.1/IntentRequest.json)

### CapabilityDescriptor

A `CapabilityDescriptor` is a machine-readable definition of a specific capability. It describes the capability's unique identifier, its purpose, and the JSON schemas for its inputs and outputs. This allows a UCI-compliant system to understand and correctly invoke a capability.

- **Schema:** [schemas/v0.1/CapabilityDescriptor.json](./schemas/v0.1/CapabilityDescriptor.json)

### EvidenceStep

An `EvidenceStep` is a single, atomic entry in the evidence record of an execution. It represents a discrete action or observation, such as a tool call, an LLM request, or a state change. Each step is timestamped and linked to its predecessors, forming a verifiable log.

- **Schema:** [schemas/v0.1/evidence-step.schema.json](./schemas/v0.1/evidence-step.schema.json)

### EvidenceChain

An `EvidenceChain` is the complete, ordered collection of `EvidenceStep` objects that constitute the full record of a capability's execution. It is structured as a Directed Acyclic Graph (DAG) to capture the causal relationships between steps.

### Outcome

The `Outcome` is the final object produced at the end of a UCI execution. It summarizes the run, indicating its final status (e.g., 'completed', 'failed'), linking to the corresponding intent and evidence chain, and providing the final result.

- **Schema:** [schemas/v0.1/outcome.schema.json](./schemas/v0.1/outcome.schema.json)

## 3. Execution Model

The UCI execution lifecycle provides a clear, auditable path from user intent to final outcome.

1.  **IntentRequest:** An actor submits an `IntentRequest` to the UCI kernel, specifying a goal.
2.  **Capability Resolution:** The kernel uses the `capability_hint` from the `IntentRequest` to look up the appropriate `CapabilityDescriptor` from its registry.
3.  **Execution:** The kernel invokes the resolved capability with the provided inputs.
4.  **Evidence DAG:** As the capability executes, it emits `EvidenceStep` objects that are collected into an `EvidenceChain` (DAG), forming a real-time, auditable trace of the process.
5.  **Outcome:** Upon completion, the kernel generates a final `Outcome` object containing the result of the execution and a reference to the `EvidenceChain`.

## 4. Evidence DAG

The core of UCI's evidence model is the Directed Acyclic Graph (DAG). The evidence of an execution is not a simple linear log but a graph that captures parallel operations and causal dependencies.

- Each node in the graph is an `EvidenceStep` object.
- The `parent_step_ids` field within each `EvidenceStep` creates the directed edges, linking a step to the one or more steps that preceded it.
- This graph structure provides a robust, verifiable, and tamper-evident record of the entire execution, which is critical for governance, security, and compliance.

## 5. Interoperability

UCI is not designed to replace existing agent interoperability protocols but to enhance them with a governance and evidence layer.

- **UCI sits above MCP and A2A:** UCI acts as a higher-level profile that can orchestrate and record actions that may be fulfilled by capabilities exposed over lower-level protocols like MCP or through agent-to-agent communication.
- **Complementary, Not Competitive:** UCI complements these protocols by providing a standardized way to express intent, normalize capabilities, and generate auditable execution traces, preserving provenance across different protocol boundaries.

## Federated Capability Resolution

UCI v0.1 supports a federated model for capability discovery and resolution, enabling a decentralized network of capabilities.

### Local vs. Remote Resolution
- **Local Resolution:** When a capability hint is provided in an `IntentRequest`, the UCI node first attempts to resolve it against its local capability registry. If a match is found, execution proceeds locally.
- **Remote Resolution:** If the capability is not found locally, the node consults its federated capability catalog. If a remote node is known to host the capability, the resolver produces an `ExecutionPlan` that marks the step for remote execution.

### Discovery-Driven Federation
The federation model is discovery-driven. Each UCI node exposes a discovery document at `/.well-known/uci` which lists its capabilities and announces its support for federation. This allows nodes to dynamically learn about each other's capabilities.

### Future Remote Execution Support
In v0.1, the focus is on discovery and planning. The `ExecutionPlan` can identify that a capability should be executed remotely and on which node. Future versions of the protocol will define the standards for securely invoking these remote capabilities and retrieving the corresponding evidence chains.

## 6. Trust Model

UCI capability publication is anchored in signed manifests. A `SignedCapabilityManifest` contains a serialized manifest payload and one or more signatures. In this v0.1 reference implementation, signatures are deterministic mock signatures intended to validate protocol flow and trust semantics; they are not full production cryptography.

A UCI node evaluates a manifest against a trust root containing trusted publisher identities and key identifiers. This allows a node to determine whether a capability should be treated as trusted, unverified, or official.

## 7. Signed Capability Manifests

A signed manifest packages the following capability metadata:

- capability identifier
- namespace
- publisher identity
- input schema
- output schema
- trust profile

Nodes expose manifests through `/api/uci/manifests` and advertise manifest support in discovery metadata.

## 8. Replay

UCI evidence chains are intended to support deterministic replay. The reference implementation exposes `/api/uci/replay`, which takes a run identifier, loads the stored evidence chain, re-executes local capability steps where possible, and returns a structured `ReplayResult` describing matches and mismatches.

## 9. Capability Adapters

External tool ecosystems can be normalized into UCI capability descriptors through adapter modules. The reference implementation includes an MCP adapter that converts MCP tool metadata into `CapabilityDescriptor` objects, establishing the pattern for future adapters.

## 10. Federation

UCI nodes may advertise federation support and remote capability resolution support through discovery metadata. A resolver can produce `ExecutionPlan` steps marked with `execution_mode: "remote"` and a `remote_node_url`, allowing remote execution to be planned while preserving evidence of the resolution process.
