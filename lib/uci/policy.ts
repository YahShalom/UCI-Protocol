
import { IntentRequest, PolicyDecision, PolicyEnvelope } from "./types";

export function checkPolicy(
  intentRequest: IntentRequest,
  policy: PolicyEnvelope
): PolicyDecision {
  if (!policy) {
    return { decision: "ALLOW", reason: "No policy specified." };
  }

  const { capability_id, parameters } = intentRequest;
  const { constraints } = policy;

  // Check allowed capabilities
  if (
    constraints.allowed_capabilities &&
    !constraints.allowed_capabilities.includes(capability_id)
  ) {
    return {
      decision: "DENY",
      reason: `Capability '${capability_id}' is not allowed by the policy.`,
    };
  }

  // Check parameter constraints
  if (constraints.parameterConstraints) {
    for (const paramName in constraints.parameterConstraints) {
      if (parameters[paramName]) {
        const value = String(parameters[paramName]);
        const constraint = constraints.parameterConstraints[paramName];

        if (constraint.startsWith && !value.startsWith(constraint.startsWith)) {
          return {
            decision: "DENY",
            reason: `Parameter '${paramName}' must start with '${constraint.startsWith}'.`,
          };
        }
        if (constraint.endsWith && !value.endsWith(constraint.endsWith)) {
          return {
            decision: "DENY",
            reason: `Parameter '${paramName}' must end with '${constraint.endsWith}'.`,
          };
        }
        if (constraint.contains && !value.includes(constraint.contains)) {
            return {
                decision: "DENY",
                reason: `Parameter '${paramName}' must contain '${constraint.contains}'.`,
            };
        }
        if (constraint.equals && value !== constraint.equals) {
            return {
                decision: "DENY",
                reason: `Parameter '${paramName}' must be equal to '${constraint.equals}'.`,
            };
        }
        if (constraint.matchesRegex && !new RegExp(constraint.matchesRegex).test(value)) {
            return {
                decision: "DENY",
                reason: `Parameter '${paramName}' must match the regex '${constraint.matchesRegex}'.`,
            };
        }
      }
    }
  }

  return { decision: "ALLOW", reason: "Policy constraints are satisfied." };
}
