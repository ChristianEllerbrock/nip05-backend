import { BuildSchemaOptions } from "type-graphql";
import { LoginResolver } from "./resolvers/login-resolver";
import { RegistrationResolver } from "./resolvers/registration-resolver";
import { RegistrationResolverRelations } from "./resolvers/registration-resolver-relations";
import { UserRelatedResolver } from "./resolvers/user-related-resolver";
import { customAuthChecker } from "./type-defs";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [
        UserRelatedResolver,
        RegistrationResolver,
        RegistrationResolverRelations,
        LoginResolver,
    ],
    authChecker: customAuthChecker,
};

