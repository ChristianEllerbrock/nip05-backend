import { Prisma } from "@prisma/client";
import { Arg, Args, Ctx, Query, Resolver } from "type-graphql";
import { HelperIdentifier } from "../../helpers/identifier";
import { PrismaService } from "../../services/prisma-service";
import { FindUserInput } from "../inputs/find-user-input";
import { IdentifierRegisterCheckOutput } from "../outputs/identifier-register-check-output";
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

    @Query((returns) => IdentifierRegisterCheckOutput)
    async canIdentifierBeRegistered(
        @Ctx() context: GraphqlContext,
        @Arg("identifier", (type) => String) identifier: string
    ): Promise<IdentifierRegisterCheckOutput> {
        return await HelperIdentifier.canIdentifierBeRegisteredAsync(
            identifier
        );
    }
}

