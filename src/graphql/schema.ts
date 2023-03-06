import { BuildSchemaOptions } from "type-graphql";
import { AuthResolver } from "./resolvers/auth-resolver";
import { LoginResolver } from "./resolvers/login-resolver";
import { RegistrationResolver } from "./resolvers/registration-resolver";
import { RegistrationResolverRelations } from "./resolvers/registration-resolver-relations";
import { UserRelatedResolver } from "./resolvers/user-related-resolver";
import { customAuthChecker } from "./type-defs";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [
        AuthResolver,
        UserRelatedResolver,
        RegistrationResolver,
        RegistrationResolverRelations,
        LoginResolver,
    ],
    authChecker: customAuthChecker,
};

