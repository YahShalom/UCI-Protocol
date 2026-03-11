# Blueprint

## Overview

This document outlines the design and features of the UCI (Unified Capability Invocation) protocol reference implementation. This application is a Next.js-based web server that implements the UCI v0.1 specification, providing a framework for resolving and executing intents as a series of capabilities.

## Features, Styles, and Design

### Core Protocol Objects

- **IntentRequest**: The primary input, representing a high-level goal from a user or system.
- **CapabilityDescriptor**: A machine-readable definition of a capability.
- **EvidenceStep**: A single, atomic entry in an execution record.
- **EvidenceChain**: The complete, ordered collection of EvidenceStep objects.
- **Outcome**: The final object produced at the end of an execution.

### Execution Objects

- **ExecutionPlan**: Represents a sequenced plan of capabilities to be executed.

### Policy and Governance Objects

- **PolicyEnvelope**: A container for policy constraints and execution requirements related to an intent. It is signed to ensure integrity and authenticity.

### API Endpoints

- `POST /api/uci/execute`: The main endpoint for receiving and processing UCI IntentRequests.
- `GET /app/.well-known/uci`: A discovery endpoint that provides information about the server's capabilities.
- `GET /api/uci/capabilities`: A discovery endpoint that returns all registered capability descriptors.

### Policy Validation

The system includes a policy validation utility (`lib/uci/policy.ts`) that checks if a capability is allowed to be executed based on the `PolicyEnvelope` associated with the intent. This validation is performed before each capability execution in the `app/api/uci/execute/route.ts` file.

## Current Request: Add UCI Capability Discovery Endpoint

The following change was made to add a UCI capability discovery endpoint:

1.  **`app/api/uci/capabilities/route.ts`**:
    *   Created a new route that returns all registered capability descriptors in a JSON response.
