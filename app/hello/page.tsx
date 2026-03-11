import { Form } from './_components/form';

export default function HelloPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">UCI Hello World</h1>
      <p className="mb-4">
        This page demonstrates a simple integration with the Universal Capability
        Interface (UCI) by calling the `math.add` capability.
      </p>
      <Form />
    </main>
  );
}
