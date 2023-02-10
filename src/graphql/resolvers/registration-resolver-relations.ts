import { FieldResolver, Resolver, Root } from "type-graphql";
import { PrismaService } from "../../services/prisma-service";
import { RegistrationOutput } from "../outputs/registration-output";
import { UserOutput } from "../outputs/user-output";

@Resolver((of) => RegistrationOutput)
export class RegistrationResolverRelations {
    @FieldResolver((returns) => UserOutput, { nullable: true })
    async user(
        @Root() registration: RegistrationOutput
    ): Promise<UserOutput | null> {
        const dbUser = await PrismaService.instance.db.registration
            .findUnique({
                where: { id: registration.id },
            })
            .user({});

        return dbUser;
    }
}

