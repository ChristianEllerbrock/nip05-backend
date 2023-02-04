// import {
//     relayInit,
//     getPublicKey,
//     getEventHash,
//     signEvent,
//     nip04,
//     Event,
//     Relay,
// } from "nostr-tools";

// export class RelayService_ {
//     // #region Singleton

//     private static _instance: RelayService_;

//     static get instance() {
//         if (this._instance) {
//             return this._instance;
//         }

//         this._instance = new RelayService_();
//         return this._instance;
//     }

//     constructor() {
//         this._botPrivkey = process.env.BOT_PRIVKEY ?? "na";
//     }

//     // #endregion Singleton

//     // #region Private Properties

//     private _botPrivkey: string;

//     // #endregion Private Properties

//     // #region Public Properties

//     get botPubKey(): string | undefined {
//         if (!this._botPrivkey) {
//             return undefined;
//         }
//         return getPublicKey(this._botPrivkey);
//     }

//     // #endregion Public Properties

//     // #region Public Methods

//     async sendAuthAsync(
//         relayAddress: string,
//         pubkey: string,
//         code: string,
//         fraudId: string
//     ): Promise<boolean> {
//         try {
//             const relay = relayInit(relayAddress);

//             relay.on("connect", () => {
//                 console.log(`connected to ${relay.url}`);
//             });

//             relay.on("error", () => {
//                 console.log("wss error");
//             });
//             await relay.connect();

//             const botContentKind0 = {
//                 name: "nip05.social",
//                 nip05: "registration@nip05.social",
//             };

//             let kind0Event: Event = {
//                 kind: 0,
//                 pubkey: this.botPubKey as string,
//                 created_at: Math.floor(Date.now() / 1000),
//                 content: JSON.stringify(botContentKind0),
//                 tags: [],
//             };
//             kind0Event.id = getEventHash(kind0Event);
//             kind0Event.sig = signEvent(kind0Event, this._botPrivkey);

//             await this._publishAsync(relay, kind0Event);

//             let message = `Your REGISTRATION code is ${code}

// If you did not initiate this registration you can either ignore this message or click on the following link to report a fraud attempt:

// https://nip05.social/fraud/${fraudId}

// Your nip05.social Team`;
//             let cipherText = await nip04.encrypt(
//                 this._botPrivkey,
//                 pubkey,
//                 message
//             );

//             let kind4Event: Event = {
//                 pubkey: this.botPubKey as string,
//                 created_at: Math.floor(Date.now() / 1000),
//                 kind: 4,
//                 tags: [["p", pubkey]],
//                 content: cipherText,
//             };

//             kind4Event.id = getEventHash(kind4Event);
//             kind4Event.sig = signEvent(kind4Event, this._botPrivkey);

//             await this._publishAsync(relay, kind4Event);

//             // await relay.close(); Currently leads to an error
//             return true;
//         } catch (error) {
//             console.log(error);
//             return false;
//         }
//     }

//     // #endregion Public Methods

//     // #region Private Methods

//     private async _publishAsync(relay: Relay, event: Event) {
//         try {
//             let pub = relay.publish(event);

//             pub.on("ok", () => {
//                 return;
//             });

//             pub.on("failed", (reason: any) => {
//                 console.log(`Pub Error ${reason}`);
//                 throw new Error(reason);
//             });

//             pub.on("seen", () => {
//                 return;
//             });
//         } catch (error: any) {
//             throw new Error(error);
//         }
//     }

//     // #endregion Private Methods
// }

