import { NextFunction, Request, Response } from "express";
import { nip19 } from "nostr-tools";

interface Query {
    value?: string;
}

export function hexController(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query as Query;
        if (typeof query.value === "undefined") {
            throw new Error("Please provide the param 'value'.");
        }

        let key = nip19.decode(query.value);
        res.json(key);
    } catch (error) {
        next(error);
    }
}

