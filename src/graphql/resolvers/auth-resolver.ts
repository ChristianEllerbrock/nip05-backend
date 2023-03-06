import { Ctx, Query, Resolver } from "type-graphql";
import { UserTokenOutput } from "../outputs/user-token-output";
import { GraphqlContext, updateUserToken } from "../type-defs";

@Resolver()
export class AuthResolver {
    @Query((returns) => UserTokenOutput)
    async isAuthenticated(@Ctx() context: GraphqlContext): Promise<UserTokenOutput> {
        if (!context.user) {
            throw new Error("You are not authorized.");
        }

        const hasValidToken = await context.user.hasValidTokenAsync();
        if (!hasValidToken) {
            throw new Error("Your access token has expired. Please login again.");
        }

        return await updateUserToken(context.user.userId);
    }
}