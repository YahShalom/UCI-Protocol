# UCI Governance Model

## Purpose

The purpose of the UCI Governance Model is to ensure that the Universal Capability Interface (UCI) protocol evolves in a transparent, open, and collaborative manner. This model provides a clear framework for proposing, discussing, and implementing changes to the protocol specification.

Effective governance ensures that the protocol remains stable and reliable, allowing the ecosystem of implementers and users to build with confidence. It balances the need for innovation with the importance of backward compatibility and interoperability.

## Core Principles

The evolution of the UCI protocol is guided by the following core principles:

*   **Openness:** The protocol development process is open to all interested parties. Anyone can propose changes or participate in discussions.
*   **Transparency:** All discussions, proposals, and decisions related to protocol changes are public.
*   **Interoperability:** The primary goal of the protocol is to enable interoperability. Changes should not be made that would compromise the ability of independent implementations to work together.
*   **Security:** The protocol must be secure. Proposed changes will be evaluated for their security implications.
*   **Ecosystem Stability:** Changes to the protocol will be made carefully to avoid disrupting the existing ecosystem of users and implementers. Backward compatibility is a key consideration.

## Roles

The UCI ecosystem consists of several roles with distinct responsibilities.

### Maintainers

Maintainers are the official stewards of the UCI protocol. They are responsible for reviewing proposals, guiding technical discussions, maintaining the official specification and reference implementation, and making final decisions on protocol changes.

### Contributors

Contributors are individuals who actively participate in the evolution of the protocol. They propose improvements by creating UCI Enhancement Proposals (UEPs), submit pull requests to fix bugs or improve documentation, and engage in technical discussions.

### Implementers

Implementers are developers and organizations that build software that uses or supports the UCI protocol. This includes building UCI-compliant nodes, client libraries, agent runtimes, and bridges.

### Community

The broader community includes all developers, researchers, security professionals, and organizations who have an interest in UCI. Community members are encouraged to follow discussions, provide feedback on proposals, and report issues.

## Proposal Process

Significant changes to the UCI protocol are proposed through a formal process known as **UCI Enhancement Proposals (UEPs)**. A UEP is a document that provides a concise technical specification for a proposed change.

A well-formed UEP **must** include:

*   **Motivation:** A clear explanation of the problem the proposal solves and why the change is necessary.
*   **Technical Specification:** A detailed description of the proposed change to the protocol.
*   **Backward Compatibility Considerations:** An analysis of the proposal's impact on existing UCI implementations and a strategy for maintaining compatibility.
*   **Reference Implementation (if applicable):** A pull request or link to a working implementation of the proposed change, often against the official UCI reference node.

## Proposal Lifecycle

A UEP proceeds through the following distinct stages:

1.  **Draft:** The initial stage of a proposal, where the contributor writes the UEP document and gathers initial feedback.
2.  **Discussion:** The UEP is submitted as a pull request or issue, opening it up for public discussion and review by the entire community.
3.  **Review:** After a period of discussion, the maintainers formally review the proposal, considering its technical merits, community feedback, and alignment with the protocol's principles.
4.  **Accepted:** If the maintainers reach a consensus to approve the proposal, it is merged and marked as accepted. This indicates that the change will be included in a future version of the protocol.
5.  **Implemented:** Once the change is fully implemented in the reference implementation and documented in the official specification, the UEP is marked as complete.

## Decision Making

Decisions on protocol changes are made through a process of community discussion and maintainer review. While all community feedback is valued, the final decision to accept or reject a UEP rests with the maintainers.

Major changes to the protocol require a rough consensus among the maintainers. The goal is not unanimity but a collective agreement that the proposed change is beneficial for the long-term health of the ecosystem.

## Versioning

The UCI protocol follows **Semantic Versioning (SemVer)**.

*   **Major Versions (e.g., 2.0.0):** May introduce breaking changes to the protocol. These changes are subject to the highest level of scrutiny and require a strong justification.
*   **Minor Versions (e.g., 1.1.0):** Introduce new, backward-compatible features and improvements.
*   **Patch Versions (e.g., 1.0.1):** Used for backward-compatible bug fixes and clarifications in the specification documentation.

## Conformance and Compatibility

All protocol changes must be made with a strong consideration for conformance and backward compatibility. Proposed changes should not break existing, compliant implementations unless there is an overwhelming technical reason to do so, in which case it would require a major version bump. The conformance test suite will be updated to reflect any changes to the protocol.

## Long-Term Governance

As the UCI ecosystem matures, the governance model may evolve to meet the needs of a larger and more diverse community. Potential future developments include:

*   A formal steering committee composed of key maintainers and significant community implementers.
*   Submission of the UCI specification to formal standards bodies (e.g., IETF, W3C).
*   Broader industry participation through working groups or foundations.
