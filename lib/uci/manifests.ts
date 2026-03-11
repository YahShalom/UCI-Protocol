import { capability as helloWorld } from "../capabilities/hello-world";
import { capability as mathAdd } from "../capabilities/math-add";
import { capability as fileRead } from "../capabilities/file-read";
import { capability as fileWrite } from "../capabilities/file-write";
import { capability as fileDelete } from "../capabilities/file-delete";
import { capability as directoryList } from "../capabilities/directory-list";
import { CapabilityDescriptor, SignedCapabilityManifest } from "./types";
import { signManifestPayload } from "./trust";

const capabilities: CapabilityDescriptor[] = [
  helloWorld,
  mathAdd,
  fileRead,
  fileWrite,
  fileDelete,
  directoryList,
];

function toManifest(capability: CapabilityDescriptor): SignedCapabilityManifest {
  const payload = Buffer.from(
    JSON.stringify({
      spec_version: capability.spec_version,
      capability_id: capability.capability_id,
      namespace: capability.namespace,
      publisher: capability.publisher,
      description: capability.description,
      inputs_schema: capability.inputs_schema,
      outputs_schema: capability.outputs_schema,
      trust: capability.trust,
    }),
    "utf8"
  ).toString("base64url");

  const key_id = capability.publisher.id === "did:web:uci.local" ? "uci-local-key-1" : "unknown-key";

  return {
    payload,
    signatures: [
      {
        protected: Buffer.from(JSON.stringify({ alg: "mock-sha256", typ: "JWS", key_id }), "utf8").toString("base64url"),
        signature: signManifestPayload(payload, key_id),
      },
    ],
  };
}

export function listSignedCapabilityManifests(): SignedCapabilityManifest[] {
  return capabilities.map(toManifest);
}

export function getSignedCapabilityManifest(capabilityId: string): SignedCapabilityManifest | undefined {
  return listSignedCapabilityManifests().find((manifest) => {
    const payload = JSON.parse(Buffer.from(manifest.payload, "base64url").toString("utf8"));
    return payload.capability_id === capabilityId;
  });
}

export function listCapabilityDescriptors(): CapabilityDescriptor[] {
  return capabilities;
}

export function getCapabilityDescriptor(capabilityId: string): CapabilityDescriptor | undefined {
  return capabilities.find((capability) => capability.capability_id === capabilityId);
}
