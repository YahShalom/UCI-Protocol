# UCI: Governance & Evidence Profile for the Agentic Stack

## Summary
UCI is a higher-layer profile for agentic systems that introduces portable intent, evidence, and governance semantics above lower-layer interoperability standards such as MCP and A2A.

## Positioning
UCI does not replace MCP.
UCI does not replace A2A.
UCI complements them by providing:
- IntentRequest
- EvidenceChain
- capability normalization
- policy-ready execution semantics
- auditable delegation surfaces

## Problem
The ecosystem is converging on:
- MCP for tools/resources/context
- A2A for agent collaboration

But it still lacks a portable governance and evidence layer that can:
- preserve execution provenance across protocol boundaries
- carry intent as a governed object
- normalize heterogeneous capabilities
- provide auditable traces for enterprise and regulated environments

## Proposal
Define UCI as a profile layer with:
- IntentRequest
- EvidenceChain
- CapabilityDeclaration
- future ExecutionPlan
- future PolicyDeclaration

## Near-Term Scope
- v0.1 IntentRequest schema
- v0.1 EvidenceChain schema
- MCP-native bridge
- discovery document
- reference implementation

## Non-Goals
- replacing MCP transport semantics
- replacing A2A collaboration semantics
- introducing a competing low-level tool protocol

## Why AAIF
AAIF is the appropriate venue for open, neutral agentic standards and profiles. UCI is intended as a complementary governance/evidence profile aligned with the existing agentic stack rather than a competing foundational protocol.

## Deliverables
- open reference implementation
- schema repo
- conformance fixtures later
- MCP export/import bridge
- governance and evidence profile draft
