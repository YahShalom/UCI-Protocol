
import { 
  CapabilityDescriptor, 
  PolicyEnvelope, 
  PolicyDecision, 
  IntentRequest, 
  StringConstraint 
} from "./types";

/**
 * Evaluates a set of string-based constraints against a given value.
 * @param value The value to check.
 * @param constraint The set of constraints to apply.
 * @returns A reason for denial, or null if allowed.
 */
function evaluateStringConstraint(value: any, constraint: StringConstraint): string | null {
  if (typeof value !== 'string') {
    return `Expected a string value, but got ${typeof value}.`;
  }

  if (constraint.startsWith && !value.startsWith(constraint.startsWith)) {
    return `Value must start with '${constraint.startsWith}'.`;
  }
  if (constraint.endsWith && !value.endsWith(constraint.endsWith)) {
    return `Value must end with '${constraint.endsWith}'.`;
  }
  if (constraint.contains && !value.includes(constraint.contains)) {
    return `Value must contain '${constraint.contains}'.`;
  }
  if (constraint.equals && value !== constraint.equals) {
    return `Value must be equal to '${constraint.equals}'.`;
  }
  if (constraint.matchesRegex) {
    const regex = new RegExp(constraint.matchesRegex);
    if (!regex.test(value)) {
      return `Value must match the regex: ${constraint.matchesRegex}.`;
    }
  }

  return null; // All checks passed
}

/**
 * Checks if an intent is allowed by a given policy envelope, including parameter-level constraints.
 * @param capability The capability being checked.
 * @param intent The full intent request, including parameters.
 * @param policy The policy to check against.
 * @returns A policy decision, or null if no policy is applicable.
 */
export function checkPolicy(
  capability: CapabilityDescriptor,
  intent: IntentRequest,
  policy?: PolicyEnvelope
): PolicyDecision | null {
  if (!policy) {
    return null; // No policy, so no decision
  }

  const { constraints } = policy;

  // 1. Check against the capability allow-list
  if (constraints.allowed_capabilities && !constraints.allowed_capabilities.includes(capability.capability_id)) {
    return {
      decision: "DENY",
      reason: `Capability ${capability.capability_id} is not in the list of allowed capabilities.`,
    };
  }

  // 2. Check parameter constraints
  if (constraints.parameterConstraints) {
    for (const paramName in constraints.parameterConstraints) {
      if (Object.prototype.hasOwnProperty.call(intent.parameters, paramName)) {
        const value = intent.parameters[paramName];
        const constraint = constraints.parameterConstraints[paramName];
        const denialReason = evaluateStringConstraint(value, constraint);
        if (denialReason) {
          return {
            decision: "DENY",
            reason: `Parameter '${paramName}' violates policy: ${denialReason}`,
          };
        }
      }
    }
  }

  return {
    decision: "ALLOW",
    reason: "Capability and parameters are allowed by policy.",
  };
}
