import { Args, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { FindUserInput } from "../inputs/find-user-input";
import { RegistrationOutput } from "../outputs/registration-output";
import { UserOutput } from "../outputs/user-output";
import { GraphqlContext } from "../type-defs";

@Resolver()
export class UserRelatedResolver {
    @Query((returns) => UserOutput)
    async user(
        @Ctx() context: GraphqlContext,
        @Args() args: FindUserInput
    ): Promise<UserOutput> {
        const dbUser = await context.db.user.findUnique({
            where: { id: args.userId },
        });
        if (!dbUser) {
            throw new Error("Could not find user in database.");
        }
        return dbUser;
    }

    @Authorized()
    @Query((returns) => [RegistrationOutput])
    async myRegistrations(
        @Ctx() context: GraphqlContext
    ): Promise<RegistrationOutput[]> {
        if (!context.user) {
            return []; // this will NOT happen because of the @Authorized attribute
        }

        const dbRegistrations = await context.db.registration.findMany({
            where: { userId: context.user.userId },
        });

        return dbRegistrations;
    }
}
