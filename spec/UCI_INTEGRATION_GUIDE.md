# UCI Integration Guide

## 1. Introduction

The Universal Capability Interface (UCI) is a protocol that provides a governance and evidence layer for AI agent systems. Its purpose is to ensure that all agent actions are compliant with defined policies, fully auditable through immutable evidence chains, and deterministically replayable for verification.

This guide is for engineers and architects who want to integrate UCI with existing AI agent frameworks, runtimes, and protocols. UCI is designed to be a complementary layer that integrates with, rather than replaces, the tools you already use. It acts as a control plane for governance, sitting above agent runtimes and connectivity protocols.

## 2. Integration Models

There are three primary models for integrating UCI into an existing system. The choice of model depends on architectural requirements, performance needs, and the desired level of intrusiveness.

*   **UCI Gateway**
    A UCI Gateway is a standalone service that acts as a reverse proxy, placed in front of one or more agent systems. It intercepts all incoming requests, transforms them into UCI `IntentRequest` objects, and enforces policy before forwarding approved actions to the agent runtime. This is the least intrusive method and is ideal for retrofitting governance onto existing black-box systems.

    *   **UCI Sidecar**
        In containerized environments like Kubernetes, UCI can be deployed as a sidecar container running alongside an agent container. The sidecar can monitor the agent's execution, such as its network calls or tool invocations, and produce a corresponding `EvidenceChain`. This model provides detailed observability without modifying the agent's core code.

        *   **Embedded UCI Runtime**
            For the tightest integration and highest performance, the UCI Kernel can be embedded directly into an agent runtime as a library or package. This allows the agent to natively create `IntentRequest` objects and generate `EvidenceChain`s. This model is best for new systems or when developers have full control over the agent's source code.

            ## 3. Integrating UCI with MCP

            UCI and the Multi-Capability Protocol (MCP) are complementary protocols with distinct roles.

            *   **MCP** is a **connectivity protocol**. It defines *how* an agent discovers and calls a tool.
            *   **UCI** is a **governance protocol**. It defines *if* an agent is allowed to call a tool and creates a verifiable record of that call.

            The integration flow is as follows:

            1.  An agent decides to invoke a tool.
            2.  Instead of calling the tool's MCP endpoint directly, it constructs a UCI `IntentRequest` for that capability.
            3.  The `IntentRequest` is sent to a UCI Kernel, which performs **policy validation** against the actor, capability, and input parameters.
            4.  If approved, the Kernel generates an `ExecutionPlan`.
            5.  The Kernel executes the plan, which involves making the **MCP capability call** to the target tool.
            6.  The result of the MCP call is recorded as a signed `EvidenceStep`, and **`EvidenceChain` generation** is completed.

            ## 4. Integrating UCI with A2A (Agent-to-Agent)

            UCI provides a formal mechanism for governing inter-agent communication and delegation. When one agent (Agent A) needs to request an action from another (Agent B), it can use UCI to create a verifiable and auditable request.

            1.  Agent A creates a signed `IntentRequest` object that describes the task it wants Agent B to perform.
            2.  This `IntentRequest` is transmitted to Agent B as the payload of an A2A message.
            3.  Agent B's embedded or gateway **UCI Kernel receives and validates the request**. It checks Agent A's signature and evaluates the request against its own internal policies.
            4.  If the request is approved, Agent B executes the task, with its UCI Kernel generating an **`EvidenceChain`** that links back to the original `IntentRequest` from Agent A.

            ## 5. Integrating UCI with Agent Frameworks

            UCI can be integrated with popular agent frameworks to provide governance and observability.

            *   **LangGraph**
                A UCI Gateway or Sidecar can wrap the LangGraph runtime. As the graph executes, the UCI layer can intercept the transitions between nodes, treating each node's action as a capability. This captures the entire execution path as a verifiable `EvidenceChain`, providing an audit trail for the agent's reasoning process.

                *   **AutoGPT / CrewAI**
                    For autonomous agent frameworks that rely on dynamic tool use, UCI serves as a critical security guardrail. A UCI Gateway can intercept all outgoing tool calls, formulating them as `IntentRequest`s. This allows the gateway to enforce policies on which tools the agent can use, with what parameters, and to produce a complete `EvidenceChain` of the agent's actions.

                    *   **Custom Agents**
                        For custom-built agents, developers can use an embedded UCI library to **emit UCI objects directly**. The agent's logic can be modified to wrap external calls (e.g., database queries, API requests) in an `IntentRequest` and log the results as `EvidenceStep`s, producing a native, UCI-compliant audit trail.

                        ## 6. Minimal Integration Example

                        This simplified flow demonstrates the core integration pattern using a UCI Gateway.

                        1.  **User Request:** A user sends a plain request to an application, e.g., `POST /api/update_customer` with a JSON body.
                        2.  **Convert to `IntentRequest`:** The UCI Gateway intercepts this request and transforms it into a structured `IntentRequest`. It identifies the actor (e.g., from an auth token), the capability (`customer.update`), and the parameters.
                        3.  **Send to `/api/uci/execute`:** The gateway submits this `IntentRequest` to its own internal UCI Kernel.
                        4.  **UCI Validates Policy:** The Kernel checks if the actor is allowed to perform the `customer.update` action.
                        5.  **UCI Executes Capability:** If validated, the Kernel forwards the original request to the upstream agent runtime or application API.
                        6.  **`EvidenceChain` Returned:** The Kernel observes the application's response, records it in the `EvidenceChain`, and returns the final `Outcome` to the gateway, which can then be logged or returned to the original caller.

                        ## 7. Required UCI Endpoints

                        A UCI-compliant node MUST implement the following API endpoints.

                        *   **`POST /api/uci/execute`**
                            This is the primary endpoint for executing an action. It accepts a signed `IntentRequest` object and returns a final `Outcome` after the execution is complete. The full `EvidenceChain` should be persisted by the node and may be included in the response.

                            *   **`POST /api/uci/replay`**
                                This endpoint accepts an `EvidenceChain` and performs a deterministic replay to verify its integrity, returning a verification result. It does not re-execute the capabilities.

                                *   **`GET /.well-known/uci`**
                                    This discovery endpoint returns metadata about the UCI node, including its version, unique ID, and a list of the public capabilities it exposes.

                                    ## 8. Evidence Consumption

                                    The `EvidenceChain` is a primary output of the UCI protocol and is designed for consumption by downstream systems for critical business and security functions:

                                    *   **Security Audits:** Security teams can parse `EvidenceChain`s to get a complete, immutable record of all actions performed by agents, verifying that no unauthorized operations occurred.
                                    *   **Debugging:** When an agent produces an unexpected result, the `EvidenceChain` provides a step-by-step trace of its execution, allowing developers to pinpoint the exact source of the error.
                                    *   **Compliance Verification:** In regulated industries, `EvidenceChain`s serve as proof that all automated actions complied with legal and regulatory requirements.
                                    *   **Replay Validation:** Systems can programmatically and periodically replay chains to ensure the integrity of the audit log has been maintained.

                                    ## 9. Best Practices

                                    *   **Use Signed Capabilities:** Always sign `CapabilityDescriptor`s and verify their signatures against a trusted key store before execution. This prevents the execution of unauthorized or tampered-with tools.
                                    *   **Store EvidenceChains Persistently:** `EvidenceChain`s are your system of record. Store them in an immutable or write-once data store (e.g., a secured object store, a database with append-only tables).
                                    *   **Validate Policy Envelopes:** Always validate `PolicyEnvelope`s attached to incoming `IntentRequest`s to ensure they do not attempt to grant themselves unauthorized permissions.
                                    *   **Use Deterministic Replay:** Regularly use the `/api/uci/replay` functionality to audit and verify the integrity of your stored evidence.

                                    ## 10. Example Architecture

                                    A typical production deployment using the Gateway model might look like this:
    +-----------+ +-----------------+ +----------------+ +-----------------+ | | --> | | --> | | --> | | | Client | | UCI Gateway | | Agent Runtime | | MCP Tool Layer | | | | (Policy & Evid.)| | (LangGraph etc)| | (APIs, DBs)|        +-----------+ +-------+---------+ +----------------+ +-----------------+ | | v +-----------------+ | | | Evidence Store | | (Immutable Log) | +-----------------+
In this architecture, the UCI Gateway provides a centralized point of governance and audit, adding a robust security layer without requiring modifications to the core agent runtime.
                         