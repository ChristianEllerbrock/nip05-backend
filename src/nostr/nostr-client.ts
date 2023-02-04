import { DateTime } from "luxon";
import WebSocket from "ws";
import { NostrEvent } from "./nostr";

const ON = {
    ERROR: "error",
    OPEN: "open",
    MESSAGE: "message",
};

export interface NostrClientConfig {
    sendTimeoutInSeconds: number;
}

export class NostrClient {
    // #region Private Properties

    private _ws: WebSocket | undefined;
    private _relay: string;
    private _config: NostrClientConfig;

    // #endregion Private Properties

    // #region Constructor

    constructor(
        relay: string,
        config: NostrClientConfig | undefined = undefined
    ) {
        this._relay = relay;

        if (config) {
            this._config = config;
        } else {
            // Set defaults.
            this._config = {
                sendTimeoutInSeconds: 15,
            };
        }
    }

    // #endregion Constructor

    // #region Public Methods

    connect() {
        if (this._ws) {
            this._ws.off(ON.ERROR, this._onError);
            this._ws.off(ON.OPEN, this._onOpen);
            this._ws.off(ON.MESSAGE, this._onMessage);
            this._ws.close();
        }

        this._ws = new WebSocket(this._relay);
        this._ws.on(ON.ERROR, this._onError);
        this._ws.on(ON.OPEN, this._onOpen);
        this._ws.on(ON.MESSAGE, this._onMessage);
    }

    async sendAsync(event: NostrEvent): Promise<void> {
        const now = DateTime.now();

        if (
            !this._ws ||
            this._ws.readyState === WebSocket.CLOSED ||
            this._ws.readyState === WebSocket.CLOSING
        ) {
            this.connect();
        }

        if (!this._ws) {
            throw new Error("Could not set up connection.");
        }

        if (this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify(["EVENT", event]));
            return;
        }

        // CLOSED, CLOSING, CONNECTING
        let readStateString = "";
        switch (this._ws.readyState) {
            case WebSocket.CONNECTING:
                readStateString = "CONNECTING";
                break;

            case WebSocket.CLOSING:
                readStateString = "CLOSING";
                break;

            case WebSocket.CLOSED:
                readStateString = "CLOSED";
                break;

            default:
                readStateString = "UNKNOWN";
                break;
        }
        if (
            this._ws.readyState === WebSocket.CLOSED ||
            this._ws.readyState === WebSocket.CLOSING
        ) {
            throw new Error(
                `Cannot send message in state: ${readStateString}.`
            );
        }

        // Only CONNECTING left
        // Wait until we are connected or throw an exception if the timeout is reached.
        while (now.diffNow().seconds < this._config.sendTimeoutInSeconds) {
            await this._sleep(2000);
            // @ts-ignore
            if (this._ws.readyState === WebSocket.OPEN) {
                this._ws.send(JSON.stringify(["EVENT", event]));
                return;
            }
        }

        throw new Error("Send timeout reached. Could not send message.");
    }

    // #endregion Public Methods

    // #region Private Methods

    private _onError() {
        // todo
    }

    private _onOpen() {
        // todo
    }

    private _onMessage(data: any) {}

    private async _sleep(ms: number): Promise<void> {
        setTimeout(() => {
            return;
        }, ms);
    }

    // #endregion Private Methods
}

