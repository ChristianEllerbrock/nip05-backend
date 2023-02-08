import { BuildSchemaOptions } from "type-graphql";
import { RegistrationResolver } from "./resolvers/registration-resolver";
import { UserOutputResolver } from "./resolvers/user-output-resolver";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [UserOutputResolver, RegistrationResolver],
};

