import { capability as helloWorld } from "../capabilities/hello-world";
import { capability as mathAdd } from "../capabilities/math-add";
import { capability as fileRead } from "../capabilities/file-read";
import { capability as fileWrite } from "../capabilities/file-write";
import { capability as fileDelete } from "../capabilities/file-delete";
import { capability as directoryList } from "../capabilities/directory-list";
import { CapabilityDescriptor, SignedCapabilityManifest } from "./types";
import { signManifest } from "./trust";
import nacl from "tweetnacl";

const capabilities: CapabilityDescriptor[] = [
  helloWorld,
  mathAdd,
  fileRead,
  fileWrite,
  fileDelete,
  directoryList,
];

const signingKey = nacl.sign.keyPair();

function toManifest(capability: CapabilityDescriptor): SignedCapabilityManifest {
  return signManifest(capability, { secretKey: signingKey.secretKey, key_id: 'uci-local-key-1' });
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
