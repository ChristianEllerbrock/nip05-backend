import { PrismaClient } from "@prisma/client";

export class PrismaService {
    // #region Singleton

    private static _instance: PrismaService;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PrismaService();
        return this._instance;
    }

    constructor() {
        this._db = new PrismaClient();
    }

    // #endregion Singleton

    // #region Public Properties

    get db() {
        return this._db;
    }

    // #endregion Public Properties

    // #region Private Properties

    private _db: PrismaClient;

    // #endregion Private Properties
}

