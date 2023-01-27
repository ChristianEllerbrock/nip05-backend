import { NextFunction, Request, Response } from "express";
import { buildNip05FromIdentifierAsync } from "../nostr/helpers";
import { PrismaService } from "../services/prisma-service";
import { UserEventTypeId } from "../prisma/interfaces";
import { Nip05CacheService } from "../services/nip05-cache-service";

interface Query {
    name?: string;
}

export async function wellKnownController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const query = req.query as Query;
        if (typeof query.name === "undefined") {
            throw new Error(
                "Please provide a name parameter with the identifier you want to query."
            );
        }

        const identifier = query.name.trim();

        // 1st check the cache
        let cacheStore = Nip05CacheService.instance.get(identifier);
        if (!cacheStore) {
            const data = await buildNip05FromIdentifierAsync(identifier);

            // cache element
            cacheStore = Nip05CacheService.instance.set(
                identifier,
                data[0],
                data[1]
            );
        }

        // log event
        await PrismaService.instance.logUserEventAsync(
            cacheStore.userId,
            UserEventTypeId.userNipped
        );

        // update stats
        await PrismaService.instance.db.user.update({
            where: { id: cacheStore.userId },
            data: {
                nipped: { increment: 1 },
            },
        });

        res.json(cacheStore.nip05);
    } catch (error) {
        next(error);
    }
}

