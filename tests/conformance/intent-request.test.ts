import { validate } from 'jsonschema';
import intentRequestSchema from '@/schemas/v0.1/intent-request.schema.json';

describe('IntentRequest Schema', () => {
  it('should validate a correct IntentRequest', () => {
    const validIntent = {
      intent: "test-intent",
      parameters: { key: "value" },
    };
    const result = validate(validIntent, intentRequestSchema);
    expect(result.valid).toBe(true);
  });

  it('should not validate an incorrect IntentRequest', () => {
    const invalidIntent = {
      foo: "bar",
    };
    const result = validate(invalidIntent, intentRequestSchema);
    expect(result.valid).toBe(false);
  });
});
