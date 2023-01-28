import { IdentifierRegisterCheckOutput } from "../graphql/outputs/identifier-register-check-output";
import { PrismaService } from "../services/prisma-service";

export class HelperIdentifier {
    static async canIdentifierBeRegisteredAsync(
        identifier: string
    ): Promise<IdentifierRegisterCheckOutput> {
        const cleanIdentifier = identifier.trim().toLowerCase();

        // 1st check:
        // more than 2 characters
        if (cleanIdentifier.length <= 2) {
            return {
                name: cleanIdentifier,
                canBeRegistered: false,
                reason: "Name too short.",
            };
        }

        // 2nd check:
        // allowed characters: a-z0-9-_.
        if (!/^[a-z0-9-_.]+$/.test(cleanIdentifier)) {
            return {
                name: cleanIdentifier,
                canBeRegistered: false,
                reason: "Name contains illegal characters.",
            };
        }

        // 3nd check:
        // On blocked list
        const dbBlockedIdentifier =
            await PrismaService.instance.db.blockedIdentifier.findFirst({
                where: { name: cleanIdentifier },
            });
        if (dbBlockedIdentifier) {
            return {
                name: cleanIdentifier,
                canBeRegistered: false,
                reason: "Name is blocked.",
            };
        }

        // 4th check:
        // already registered
        const dbUser = await PrismaService.instance.db.user.findFirst({
            where: { identifier: cleanIdentifier },
        });
        if (dbUser) {
            return {
                name: cleanIdentifier,
                canBeRegistered: false,
                reason: "Name already registered.",
            };
        }

        // Everything is ok. This identifier can be registered.
        return {
            name: cleanIdentifier,
            canBeRegistered: true,
        };
    }
}

