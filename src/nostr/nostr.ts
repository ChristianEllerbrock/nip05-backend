import { bech32 } from "@scure/base";
import * as secp256k1 from "@noble/secp256k1";

export interface NostrHexObject {
    type: string;
    data: string;
}

export class Nostr {
    // #region Public Methods

    static npubToHexObject(npub: string): NostrHexObject {
        const hexObject = Nostr._nSomethingToHexObject(npub);
        if (hexObject.type !== "npub") {
            throw new Error("Invalid npub provided.");
        }

        return hexObject;
    }

    static nsecToHexObject(nsec: string): NostrHexObject {
        const hexObject = Nostr._nSomethingToHexObject(nsec);
        if (hexObject.type !== "nsec") {
            throw new Error("Invalid nsec provided.");
        }

        return hexObject;
    }

    static nXXXToHexObject(nXXX: string): NostrHexObject {
        return Nostr._nSomethingToHexObject(nXXX);
    }

    // #endregion Public Methods

    // #region Private Methods

    private static _nSomethingToHexObject(nSomething: string): NostrHexObject {
        const { prefix, words } = bech32.decode(nSomething, 5000);
        const data = new Uint8Array(bech32.fromWords(words));

        return {
            type: prefix,
            data: secp256k1.utils.bytesToHex(data),
        };
    }

    // #endregion Private Methods
}

