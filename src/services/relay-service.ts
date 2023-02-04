// import {
//     relayInit,
//     getPublicKey,
//     getEventHash,
//     signEvent,
//     nip04,
//     Event,
//     Relay,
// } from "nostr-tools";

import { Nostr, NostrEventCreateData, NostrEventKind } from "../nostr/nostr";
import { NostrClient } from "../nostr/nostr-client";

export class RelayService_ {
    // #region Singleton

    private static _instance: RelayService_;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new RelayService_();
        return this._instance;
    }

    constructor() {
        this._botPrivkey = process.env.BOT_PRIVKEY ?? "na";
    }

    // #endregion Singleton

    // #region Private Properties

    private _botPrivkey: string;

    // #endregion Private Properties

    // #region Public Properties

    get botPubKey(): string | undefined {
        if (!this._botPrivkey) {
            return undefined;
        }
        return Nostr.getPubKeyHexObjectFromPrivKey(this._botPrivkey).hex;
    }

    // #endregion Public Properties

    // #region Public Methods

    async sendAuthAsync(
        relayAddress: string,
        pubkey: string,
        code: string,
        fraudId: string
    ): Promise<boolean> {
        try {
            const client = new NostrClient(relayAddress);

            // First, send the NIP05 infos from the sending bot to the relay.
            const kind0Content = {
                name: "nip05.social",
                nip05: "registration@nip05.social",
            };

            const kind0Event = Nostr.createEvent({
                privkey: this._botPrivkey,
                data: {
                    kind: NostrEventKind.Metadata,
                    pubkey: this.botPubKey as string,
                    created_at: Math.floor(Date.now() / 1000),
                    content: JSON.stringify(kind0Content),
                    tags: [],
                },
            });
            await client.sendAsync(kind0Event);

            // Second, send the direct message with the registration information to the receiver.
            const registerContent = `Your REGISTRATION code is ${code}

If you did not initiate this registration you can either ignore this message or click on the following link to report a fraud attempt:

https://nip05.social/fraud/${fraudId}

Your nip05.social Team`;

            const encryptedRegisterContent = await Nostr.encryptDirectMessage(
                this._botPrivkey,
                pubkey,
                registerContent
            );

            const kind4Event = Nostr.createEvent({
                privkey: this._botPrivkey,
                data: {
                    pubkey: this.botPubKey as string,
                    created_at: Math.floor(Date.now() / 1000),
                    kind: 4,
                    tags: [["p", pubkey]],
                    content: encryptedRegisterContent,
                },
            });
            await client.sendAsync(kind4Event);

            // await relay.close(); Currently leads to an error
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // #endregion Public Methods

    // #endregion Private Methods
}

