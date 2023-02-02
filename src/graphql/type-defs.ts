import { PrismaClient } from "@prisma/client";
import { PrismaService } from "../services/prisma-service";

export interface GraphqlContext {
    db: PrismaClient;
}

export const getGraphqlContext = function (req: any): GraphqlContext {
    return {
        db: PrismaService.instance.db,
    };
};

