import { NextFunction, Request, Response } from "express";
import { buildNip05FromIdentifierAsync } from "../nostr/helpers";
import { PrismaService } from "../services/prisma-service";
import { UserEventTypeId } from "../prisma/interfaces";

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

        const data = await buildNip05FromIdentifierAsync(identifier);

        // Log Event
        PrismaService.instance.logUserEventAsync(
            data[0],
            UserEventTypeId.userNipped
        );

        res.json(data[1]);
    } catch (error) {
        next(error);
    }
}

