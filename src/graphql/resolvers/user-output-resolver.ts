import { Args, Ctx, Query, Resolver } from "type-graphql";
import { FindUserInput } from "../inputs/find-user-input";
import { UserOutput } from "../outputs/user-output";
import { GraphqlContext } from "../type-defs";

@Resolver(UserOutput)
export class UserOutputResolver {
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
}

