import { TrustRootEntry } from "./types";

export const TRUST_ROOT: TrustRootEntry[] = [
  {
    publisher_id: "did:web:uci.local",
    key_id: "uci-local-key-1",
    verification_method: "manual",
    domain: "uci.local",
    public_key: "uci-local-public-key",
  },
];

export function getTrustRoot(): TrustRootEntry[] {
  return TRUST_ROOT;
}

export function isTrustedPublisher(publisherId: string, keyId?: string): boolean {
  return TRUST_ROOT.some((entry) => entry.publisher_id === publisherId && (!keyId || entry.key_id === keyId));
}
