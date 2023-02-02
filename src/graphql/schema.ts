import { BuildSchemaOptions } from "type-graphql";
import { UserOutputResolver } from "./resolvers/user-output-resolver";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [UserOutputResolver],
};

