import { BuildSchemaOptions } from "type-graphql";
import { RegistrationResolver } from "./resolvers/registration-resolver";
import { RegistrationResolverRelations } from "./resolvers/registration-resolver-relations";
import { UserOutputResolver } from "./resolvers/user-output-resolver";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [
        UserOutputResolver,
        RegistrationResolver,
        RegistrationResolverRelations,
    ],
};

