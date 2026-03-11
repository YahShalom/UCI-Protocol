# UCI
Governance & Evidence Profile for the Agentic Stack

## Overview
UCI provides a governance and evidence layer for AI actions. It defines a protocol for handling IntentRequests, which are translated into ExecutionPlans. These plans are then executed by invoking capabilities, and the entire process is recorded in a verifiable Evidence DAG (Directed Acyclic Graph).

## Current Status
UCI v0.1 reference node implemented.

## Implemented Components

### Protocol Objects
- IntentRequest
- ExecutionPlan
- CapabilityDescriptor
- EvidenceStep
- EvidenceChain
- Outcome

### Core Services
- Intent Resolver (`lib/uci/resolver.ts`)
- Capability registry
- Capability execution

### API Endpoints
- `/api/uci/execute` — executes an IntentRequest
- `/.well-known/uci` — protocol discovery endpoint

### Reference Capabilities
- hello-world
- math.add
- directory.list
- file.read
- file.write
- file.delete

### Schemas
**Location:** `schemas/v0.1/`

**Contains:**
- intent-request.schema.json
- evidence-chain.schema.json
- evidence-step.schema.json
- outcome.schema.json
- ExecutionPlan.json

### Spec Documents
**Location:** `spec/`

- SPEC.md
- AAIF_PROPOSAL_DRAFT.md

## Architecture

IntentRequest  
↓  
Intent Resolver  
↓  
ExecutionPlan  
↓  
Capability Execution  
↓  
EvidenceChain (DAG)  
↓  
Outcome

## Discovery

Protocol discovery endpoint:

`/.well-known/uci`

**Example:**

`http://localhost:9003/.well-known/uci`

## Development Phase

UCI v0.1 reference node complete.

Next phases include:
- governance policy layer
- conformance test suite
- MCP bridge hardening
- A2A bridge

## Policy Envelope

UCI supports portable policy enforcement using PolicyEnvelope.

A PolicyEnvelope defines:

- execution constraints
- capability restrictions
- delegation rules
- signature verification

PolicyEnvelopes allow IntentRequests to carry governance rules across systems.

## Federated Capability Resolution

UCI supports the discovery of remote capabilities hosted on other UCI nodes, enabling a federated capability network.

## Capability Trust Verification

UCI supports the verification of capability providers to establish trust in distributed capability marketplaces.

## Signed Capability Manifests

UCI capabilities are published as signed manifests. In v0.1 this implementation uses deterministic mock signatures to exercise manifest loading, trust evaluation, and publisher verification semantics without depending on full PKI infrastructure.

## Deterministic Execution Replay

UCI stores evidence chains for executed runs and exposes a replay endpoint at `/api/uci/replay` so runs can be re-evaluated against recorded evidence. This enables auditability and deterministic verification of outcomes.

## Federation

UCI supports discovery-first federation. Nodes can advertise federation support, resolve remote capability descriptors, and produce remote execution plan steps. Full remote invocation is a future extension, but node-to-node planning semantics are present in this reference implementation.

## Capability Adapters

UCI includes an MCP adapter module that demonstrates how external tool definitions can be normalized into UCI `CapabilityDescriptor` objects.
