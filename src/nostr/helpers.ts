import { PrismaService } from "../services/prisma-service";
import { Nip05 } from "./type-defs";

/**
 * Performs a lookup in the database and returns a [userId, Nip05] tuple if available.
 * If no database record was found, an exception is thrown.
 */
export async function buildNip05FromIdentifierAsync(
    identifier: string
): Promise<[string, Nip05]> {
    const dbUser = await PrismaService.instance.db.user.findFirst({
        where: {
            identifier,
            isActivated: true,
        },
        include: { userRelays: true },
    });

    if (!dbUser) {
        throw new Error(`No record found with the name '${identifier}'.`);
    }

    const data: Nip05 = {
        names: {},
    };
    data.names[identifier] = dbUser.pubkey;

    if (dbUser.userRelays.length > 0) {
        data.relays = {};
        data.relays[dbUser.pubkey] = dbUser.userRelays.map((x) => x.address);
    }

    return [dbUser.id, data];
}

