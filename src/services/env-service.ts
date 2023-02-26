/* eslint-disable no-console */
import dotenv from "dotenv";

dotenv.config();

export class EnvServiceEnv {
    PORT!: string;

    NODE_TLS_REJECT_UNAUTHORIZED!: string;

    DATABASE_URL!: string;
    SHADOW_DATABASE_URL!: string;

    BOT_PRIVKEY!: string;
    APP_URL!: string;
}

export class EnvService {
    // #region Singleton

    private static _instance: EnvService;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new EnvService();
        return this._instance;
    }

    // #endregion Singleton

    constructor() {
        this._buildEnv();
    }

    // #region Public Properties

    get env() {
        return this._env;
    }

    // #endregion Public Properties

    // #region Private Properties

    private _env!: EnvServiceEnv;

    // #endregion Private Properties

    // #region Private Methods

    private _buildEnv() {
        const env = new EnvServiceEnv();

        console.log("Trying to read the following keys from ENV:");

        Object.keys(env).forEach((key) => console.log(" " + key));

        Object.keys(env).forEach((key) => {
            if (typeof process.env[key] === "undefined") {
                throw new Error(
                    `Could not read required ENV key '${key}' from ENV.`
                );
            }

            (env as any)[key] = process.env[key];
        });
        this._env = env;
    }

    // #endregion Private Methods
}

