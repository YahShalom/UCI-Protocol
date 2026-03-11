UCI Quick Start

What is UCI

The Universal Capability Interface (UCI) is an open protocol designed to provide governance, policy enforcement, and verifiable execution evidence for AI agent systems.

UCI enables agent actions to be auditable, replayable, and policy-compliant by producing structured execution records known as EvidenceChains.

Instead of replacing agent frameworks or tool protocols, UCI acts as a governance layer that sits above them.

---

Requirements

To run the UCI reference node, ensure the following tools are installed:

- Node.js (18+ recommended)
- npm
- Git

---

Clone the Repository

Clone the UCI protocol repository:

git clone https://github.com/YahShalom/UCI-Protocol.git
cd UCI-Protocol

---

Install Dependencies

Install project dependencies:

npm install

---

Run the Reference Node

Start the local development server that runs the UCI reference implementation:

npm run dev

Once started, the node will be ready to receive UCI execution requests.

---

Execute an IntentRequest

You can interact with the UCI node by sending a request to its primary execution endpoint.

POST /api/uci/execute

This endpoint accepts a structured IntentRequest object.

The UCI Kernel processes this request and produces:

- ExecutionPlan — the ordered steps required to fulfill the intent
- EvidenceChain — a verifiable record of the execution
- Outcome — the final result of the execution

---

Replay Evidence

To verify a past execution, you can submit its EvidenceChain to the replay endpoint.

POST /api/uci/replay

This endpoint does not re-run the original action.
Instead, it programmatically steps through the evidence to verify that the recorded execution is authentic and that the outcome is legitimate.

---

Discovery Endpoint

To view metadata and capabilities of a running UCI node, query the discovery endpoint:

GET /.well-known/uci

This endpoint returns a JSON object containing:

- Node ID
- Supported protocol versions
- Available capabilities
- Execution endpoints

This allows tools and agents to discover and interact with UCI nodes automatically.

---

Explore the Protocol

The full UCI protocol specification and related architecture documents are located in the "/spec" directory.

Key documents include:

- "spec/SPEC.md"
- "spec/ARCHITECTURE.md"
- "spec/CONFORMANCE.md"
- "spec/UCI_INTEGRATION_GUIDE.md"
- "spec/UCI_BRIDGES.md"

These documents describe the protocol architecture, governance model, and integration strategies.

---

Next Steps

After exploring the reference node, you can:

- Integrate UCI with existing agent runtimes such as LangGraph or CrewAI
- Create protocol bridges connecting UCI with systems like MCP
- Build governance layers for your own AI agent infrastructure using UCI as the foundation