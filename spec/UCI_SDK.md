UCI SDK

Purpose

The UCI Software Development Kit (SDK) provides a set of developer-friendly libraries for building applications, agents, and services that interact with UCI nodes. The SDK abstracts away the low-level details of the UCI protocol, such as manual HTTP requests and object serialization.

Its goal is to simplify the developer experience by providing high-level functions for creating "IntentRequest"s, submitting them for execution, and parsing the resulting "EvidenceChain"s and "Outcome"s.

---

Core SDK Capabilities

The official UCI SDK provides the following primary features:

- IntentRequest Builder
  A fluent API for programmatically constructing valid "IntentRequest" objects.

  - Execution Submission
    A simple client for sending "IntentRequest"s to a UCI node's execution endpoint and handling the response.

    - EvidenceChain Parsing
      Utilities for parsing a returned "EvidenceChain", validating its structure, and extracting specific "EvidenceStep"s.

      - Replay Verification
        A client for submitting an "EvidenceChain" to a UCI node's replay endpoint to verify its integrity.

        - Capability Discovery
          A client for querying a UCI node's discovery endpoint to retrieve its metadata and list of available capabilities.

          ---

          SDK Architecture

          The SDK is composed of several logical components, each responsible for a specific part of the UCI interaction flow.

          Intent Builder

          The Intent Builder provides a clean, chainable interface to construct a valid "IntentRequest". It helps ensure all required fields are present and correctly formatted before submission.

          ---

          Execution Client

          This client handles all communication with a UCI node's primary execution endpoint.

          POST /api/uci/execute

          It manages sending the "IntentRequest" and receiving the final "Outcome" and associated "EvidenceChain".

          ---

          Replay Client

          The Replay Client provides a simple method for submitting a previously generated "EvidenceChain" to a node's replay endpoint.

          POST /api/uci/replay

          It returns a verification result confirming the integrity of the execution record.

          ---

          Discovery Client

          The Discovery Client queries a UCI node's discovery endpoint.

          GET /.well-known/uci

          It retrieves and parses the node's metadata, providing easy access to:

          - supported protocol versions
          - registered capabilities
          - node identity metadata

          ---

          Evidence Parser

          The Evidence Parser is a utility library that takes a raw "EvidenceChain" object and provides helper functions to:

          - navigate execution steps
          - extract specific evidence records
          - validate chain integrity

          ---

          Example SDK Flow

          A typical developer workflow using the SDK would be:

          1. Create IntentRequest
             Use the "IntentBuilder" to define the goal, actor, and capability.

             2. Submit Request
                Use the "ExecutionClient" to send the "IntentRequest" to a UCI node.

                3. Receive Response
                   The node returns the "Outcome" and the full "EvidenceChain".

                   4. Inspect Outcome
                      The application checks whether the action succeeded.

                      5. Replay EvidenceChain (Optional)
                         Use the "ReplayClient" to verify the execution evidence.

                         ---

                         Supported Languages

                         Official UCI SDKs will be developed and maintained for major programming languages.

                         Initial targets include:

                         - JavaScript / TypeScript
                         - Python
                         - Go
                         - Rust

                         Community SDKs for other languages are encouraged.

                         ---

                         Example Usage

                         The following conceptual example demonstrates how a developer might use the SDK.

                         // 1. Create a client instance
                         const uciClient = new UciClient({
                           nodeUrl: "http://localhost:3000"
                           });

                           // 2. Build the IntentRequest
                           const intent = new IntentBuilder()
                             .setActor("user:jane.doe")
                               .setCapability("database.customers.update")
                                 .withParameter("customerId", "acme-123")
                                   .withParameter("data", { status: "active" })
                                     .build();

                                     // 3. Execute the intent
                                     const { outcome, evidenceChain } = await uciClient.execute(intent);

                                     // 4. Check the result
                                     if (outcome.status === "SUCCESS") {
                                       console.log("Execution successful!");
                                         // The evidenceChain can now be stored for auditing
                                         }

                                         ---

                                         SDK Design Principles

                                         The design of the UCI SDK follows several guiding principles:

                                         - Developer Simplicity
                                           The SDK should be intuitive and easy to use.

                                           - Protocol Correctness
                                             All SDK operations must generate valid UCI protocol objects.

                                             - Interoperability
                                               Applications built with the SDK must work with any UCI-compliant node.

                                               - Extensibility
                                                 The SDK architecture must allow new features and protocol upgrades.

                                                 ---

                                                 Future SDK Extensions

                                                 As the UCI ecosystem evolves, the SDK may include additional capabilities such as:

                                                 - Policy Helpers
                                                   Tools for constructing and validating "PolicyEnvelope" objects.

                                                   - Capability Registries
                                                     Clients for interacting with distributed capability registries.

                                                     - Federated Execution Clients
                                                       Advanced clients capable of coordinating execution across multiple UCI nodes.