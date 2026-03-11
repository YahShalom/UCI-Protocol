# Universal Capability Interface (UCI)

UCI is an open protocol designed to provide governance, policy enforcement, and verifiable execution evidence for AI agent systems.

It introduces a standardized execution model that ensures agent actions are transparent, auditable, and replayable.

---

## Why UCI Exists

The modern AI agent ecosystem is rapidly evolving.

Agent runtimes such as LangGraph, CrewAI, and AutoGPT allow agents to reason and plan actions.

Protocols like MCP standardize how agents interact with tools.

Messaging systems like A2A enable communication between agents.

However, the ecosystem lacks a standard for:

- governance
- policy enforcement
- execution provenance
- verifiable audit trails

UCI fills this gap by acting as the governance and evidence layer for agent execution.

---

## The UCI Execution Model

UCI introduces a structured execution pipeline:

`IntentRequest`
→ `ExecutionPlan`
→ `Capability Execution`
→ `EvidenceChain`
→ `Outcome`

**IntentRequest** captures the goal and constraints.

**ExecutionPlan** defines the steps required to satisfy the intent.

**Capability Execution** performs the requested operations.

**EvidenceChain** records all execution steps in a verifiable format.

**Outcome** contains the final result.

---

## Where UCI Fits in the Agent Stack

UCI does not replace existing frameworks.

Instead it acts as a governance layer above them.

**Agent Runtimes**
(LangGraph, CrewAI, AutoGPT)
handle reasoning and planning.

**Tool Protocols**
(MCP)
handle capability connectivity.

**Agent Messaging**
(A2A)
handles communication between agents.

**UCI** provides governance, verification, and execution evidence across all layers.

---

## Quick Start

See the Quick Start guide:

[QUICKSTART.md](QUICKSTART.md)

This guide explains how to run the UCI reference node and execute IntentRequests.

---

## Protocol Documentation

The full protocol specification is located in the `spec` directory.

Important documents include:

- [SPEC.md](spec/SPEC.md)
- [ARCHITECTURE.md](spec/ARCHITECTURE.md)
- [CONFORMANCE.md](spec/CONFORMANCE.md)
- [UCI_PROTOCOL_OVERVIEW.md](spec/UCI_PROTOCOL_OVERVIEW.md)
- [UCI_INTEGRATION_GUIDE.md](spec/UCI_INTEGRATION_GUIDE.md)
- [UCI_BRIDGES.md](spec/UCI_BRIDGES.md)
- [UCI_REFERENCE_IMPLEMENTATION.md](spec/UCI_REFERENCE_IMPLEMENTATION.md)

These documents describe the architecture, governance model, and integration strategies.

---

## Reference Implementation

This repository includes a working reference implementation of a UCI node.

The reference node exposes endpoints such as:

`POST /api/uci/execute`
`POST /api/uci/replay`
`GET /.well-known/uci`

Developers can use this implementation to experiment with the protocol and build integrations.

---

## Conformance

The UCI protocol includes a conformance model to ensure interoperability.

See:

[tests/UCI_CONFORMANCE_SUITE.md](tests/UCI_CONFORMANCE_SUITE.md)

Implementations that pass the conformance suite may declare themselves **UCI compatible**.

---

## Ecosystem Integration

UCI is designed to integrate with existing systems through protocol bridges.

Examples include:

- MCP bridges
- A2A bridges
- LangGraph integration
- AutoGPT integration
- CrewAI integration

These integrations allow existing agent systems to adopt UCI governance without rewriting their architecture.

---

## Long-Term Vision

UCI aims to become the universal governance layer for AI agent systems.

Future agent stacks may look like this:

**UCI**
Governance and execution evidence

**Agent runtimes**
Planning and reasoning

**MCP**
Tool connectivity

**A2A**
Agent communication

This modular architecture enables secure, interoperable, and trustworthy agent ecosystems.

---

## Contributing

Contributions are welcome.

Developers can contribute by:

- improving the reference implementation
- building bridges to other ecosystems
- expanding the conformance suite
- improving documentation

---

## License

Specify the project's license here.
