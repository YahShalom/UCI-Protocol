import { validate } from 'jsonschema';
import executionPlanSchema from '@/schemas/v0.1/execution-plan.schema.json';

describe('ExecutionPlan Schema', () => {
  it('should validate a correct ExecutionPlan', () => {
    const validPlan = {
      intent: "test-intent",
      steps: [
        {
          capability_id: "test-capability",
          parameters: { key: "value" },
        },
      ],
    };
    const result = validate(validPlan, executionPlanSchema);
    expect(result.valid).toBe(true);
  });

  it('should not validate an incorrect ExecutionPlan', () => {
    const invalidPlan = {
      intent: "test-intent",
      steps: [
        {
          foo: "bar",
        },
      ],
    };
    const result = validate(invalidPlan, executionPlanSchema);
    expect(result.valid).toBe(false);
  });
});
