# UCI Bridge Architecture

## Introduction

The Universal Capability Interface (UCI) is designed for seamless integration into the existing AI agent ecosystem. This is achieved through a "bridge" architecture. A UCI bridge is a software component that acts as a translator between an external system (like an agent runtime or protocol) and the core UCI execution pipeline.

The purpose of a bridge is to wrap external actions in a UCI governance layer. This ensures that every significant action is subject to policy validation, is verifiably executed, and is recorded as a tamper-evident `EvidenceChain`, without requiring a replacement of the underlying systems.

## The UCI Execution Pipeline

At the heart of UCI is a standardized, verifiable execution pipeline. Bridges are responsible for converting external requests and events into this structured flow.

The core pipeline is:
`IntentRequest` → `ExecutionPlan` → `Capability Execution` → `EvidenceChain` → `Outcome`

A bridge intercepts a request from an external system, transforms it into a UCI `IntentRequest`, submits it for governed execution, and ensures the resulting `EvidenceChain` accurately reflects the action taken.

## MCP Bridge

This bridge integrates UCI with the Multi-Capability Protocol (MCP), providing a clear separation of concerns:

*   **MCP** handles **tool connectivity**, defining how an agent discovers and invokes a tool.
*   **UCI** handles **execution governance**, defining *if* the agent is allowed to invoke that tool and creating a verifiable record of the event.

The integrated flow is as follows:
1.  A user request or agent decision triggers the need to call a tool.
2.  The bridge intercepts this and creates a structured `IntentRequest`.
3.  A UCI Kernel performs **policy validation** on the `IntentRequest`.
4.  If approved, an `ExecutionPlan` is generated.
5.  The plan is executed, which includes making the **MCP capability call** to the target tool.
6.  The invocation and its result are immutably recorded in an **`EvidenceChain`**.

## A2A Bridge

This bridge governs communication between independent agents, adding a layer of security and auditability to inter-agent delegation.

Instead of exchanging raw, unstructured messages, agents use UCI to formalize their interactions:
*   An originating agent constructs a signed `IntentRequest` and sends it to a recipient agent as the payload of an Agent-to-Agent (A2A) message.
*   The receiving agent uses its local UCI Kernel to validate the `IntentRequest` against its own policies before committing to execution.
*   The resulting `EvidenceChain` creates a verifiable and auditable record of all inter-agent interactions and delegated tasks.

## LangGraph Bridge

LangGraph is a framework for orchestrating complex reasoning and planning workflows as a graph. A LangGraph bridge provides governance and observability for these workflows.

*   **LangGraph** remains responsible for creating the **reasoning plan** (the graph structure).
*   **UCI** wraps the execution of the graph, capturing each significant node execution or state transition as a distinct `EvidenceStep` within a broader `EvidenceChain`.

This allows for a complete, step-by-step audit of the agent's reasoning process, showing not just the final result but the path it took to get there.

## AutoGPT / CrewAI Bridge

Frameworks like AutoGPT and CrewAI excel at coordinating sequences of tool use to accomplish a goal. A UCI bridge acts as a critical security and audit layer for these autonomous systems.

*   The bridge intercepts every tool call the agent attempts to make.
*   Each tool call is treated as a capability invocation and is recorded as a signed `EvidenceStep`.
*   This allows a governing UCI Kernel to enforce policies on which tools the agent is allowed to use and under what conditions. It also creates a verifiable record of every decision and action the autonomous agent takes.

## Custom Agent Integration

For developers building new agent systems from scratch, a bridge can be implemented natively. Custom agents can be designed to emit UCI protocol objects directly.

1.  The agent's internal logic constructs an `IntentRequest` when it needs to perform a governed action.
2.  It submits this request to a local or remote UCI node.
3.  The UCI Kernel validates the policy, orchestrates the execution, and returns the final `Outcome`, having generated a complete `EvidenceChain` for the agent's records.

## Bridge Deployment Models

Bridges can be deployed in several ways to best fit the target architecture:

*   **Gateway Bridge:** A reverse proxy that sits in front of an existing agent system, intercepting all incoming requests and wrapping them in the UCI pipeline. This is ideal for black-box systems.
*   **Sidecar Bridge:** A companion service (e.g., a container) that runs alongside an agent runtime, monitoring its behavior (like network calls or file access) and generating `EvidenceChain`s based on its observed actions.
*   **Embedded Bridge:** A library or SDK integrated directly into the source code of an agent runtime. This provides the tightest integration and allows for the most detailed evidence generation.

## Benefits of Bridges

The bridge architecture is a core tenet of UCI's adoption strategy, as it allows for incremental integration rather than requiring a disruptive "rip-and-replace" approach.

Benefits include:
*   **Governance Enforcement:** Apply consistent security and operational policies to existing agent systems.
*   **Verifiable Execution:** Generate immutable, replayable evidence for all significant agent actions.
*   **Policy Compliance:** Create the audit trails necessary to meet regulatory and compliance requirements.
*   **Cross-Platform Interoperability:** Produce a standard `EvidenceChain` that can be understood by any UCI-compliant system, regardless of the underlying agent framework.

## Future Bridge Targets

The UCI protocol is designed to be extensible, and future work will focus on developing bridges for a wide range of emerging platforms:

*   OpenAI Assistants and tool ecosystems
*   Anthropic's agentic frameworks
*   Google's Gemini agent and tool-use APIs
*   Enterprise orchestration platforms (e.g., ServiceNow, MuleSoft)
