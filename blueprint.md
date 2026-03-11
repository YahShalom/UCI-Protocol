# UCI Next.js Reference Implementation

## Overview

This project is a reference implementation of the Universal Capability Interface (UCI) in a Next.js application. It demonstrates the core concepts of UCI, including capabilities, manifests, trust, federation, and execution.

## Features

*   **Capability Registry:** A local registry of capabilities, including `math.add` and `hello-world`.
*   **Trust Layer:** Verification of capability manifests using Ed25519 signatures.
*   **Federation:** Discovery of remote capabilities and execution of remote plans.
*   **MCP Adapter:** Integration with the Firebase MCP for extending capabilities.
*   **API Endpoints:** A set of API endpoints for interacting with the UCI runtime.
*   **Policy Engine:** A policy engine to enforce constraints on capability execution.
*   **User Interface:** A simple UI to send intent requests and view results.

## Design

*   **Modern Aesthetics:** The application uses a modern design with a clean and intuitive user interface.
*   **Responsive:** The application is responsive and works on both desktop and mobile devices.
*   **Accessible:** The application follows accessibility best practices to ensure it is usable by everyone.

## Current Plan: Enhance User Interface

1.  **Enhance the UI:** Improve the visual design of the main page to make it more modern and appealing.
2.  **Add Navigation:** Add a navigation bar to the layout to allow users to switch between different sections of the application.
3.  **Create Marketplace Page:** Create a new page at `/marketplace` that fetches and displays the available capabilities from the `/api/uci/marketplace` endpoint.
4.  **Create Runtimes Page:** Create a new page at `/runtimes` that fetches and displays the available runtimes from the `/api/uci/runtimes` endpoint.

## Completed Plan: Implement Policy Layer and Basic UI

The last request was to implement the governance policy layer and a user interface. The following tasks were performed:

1.  **Implement the Policy Engine:**
    *   Create `lib/uci/policy.ts` to house the policy engine.
    *   Integrate the policy engine into the intent resolution process in `lib/uci/resolver.ts`.
2.  **Create a User Interface:**
    *   Create the main application page in `app/page.tsx`.
    *   Update the layout in `app/layout.tsx`.
    *   Add basic styling in `app/globals.css`.
3.  **Create the Execution API Endpoint:**
    *   Create `pages/api/uci/execute.ts` to handle intent execution requests from the UI.
