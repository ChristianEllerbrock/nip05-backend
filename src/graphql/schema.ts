import { BuildSchemaOptions } from "type-graphql";
import { LoginResolver } from "./resolvers/login-resolver";
import { RegistrationResolver } from "./resolvers/registration-resolver";
import { RegistrationResolverRelations } from "./resolvers/registration-resolver-relations";
import { UserResolver } from "./resolvers/user-output-resolver";
import { customAuthChecker } from "./type-defs";

export const schemaOptions: BuildSchemaOptions = {
    resolvers: [
        UserResolver,
        RegistrationResolver,
        RegistrationResolverRelations,
        LoginResolver,
    ],
    authChecker: customAuthChecker,
};

