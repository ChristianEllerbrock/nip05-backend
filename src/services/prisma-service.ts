import { PrismaClient } from "@prisma/client";
import { UserEventTypeId } from "../prisma/interfaces";
import { DateTime } from "luxon";

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

    // #region Public Methods

    async logUserEventAsync(userId: string, userEventTypeId: UserEventTypeId) {
        await this._db.userEvent.create({
            data: {
                userId,
                userEventTypeId,
            },
        });

        await this._enforceRetentionPolicyAsync(userEventTypeId);
    }

    // #endregion Public Methods

    // #region Private Methods

    private async _enforceRetentionPolicyAsync(
        userEventTypeId: UserEventTypeId
    ) {
        switch (userEventTypeId) {
            case UserEventTypeId.userNipped:
                const upperAllowedDate = DateTime.now()
                    .minus({ minute: 5 })
                    .toJSDate();

                await this._db.userEvent.deleteMany({
                    where: {
                        createdAt: { lt: upperAllowedDate },
                    },
                });
                break;

            default:
                break;
        }
    }

    // #endregion Private Methods
}

