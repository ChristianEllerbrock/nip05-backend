import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { HelperIdentifier } from "../../helpers/identifier";
import { AuthRegistrationCreateInput } from "../inputs/auth-registration-create-input";
import { FindUserInput } from "../inputs/find-user-input";
import { AuthRegistrationOutput } from "../outputs/auth-registration-output";
import { IdentifierRegisterCheckOutput } from "../outputs/identifier-register-check-output";
import { UserOutput } from "../outputs/user-output";
import { GraphqlContext } from "../type-defs";
import { nip19 } from "nostr-tools";
import { PrismaService } from "../../services/prisma-service";
import { DateTime } from "luxon";
import { HelperAuth } from "../../helpers/helper-auth";
import { RelayService } from "../../services/relay-service";

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

    @Mutation((returns) => AuthRegistrationOutput)
    async createAuthRegistration(
        @Args() args: AuthRegistrationCreateInput
    ): Promise<AuthRegistrationOutput> {
        const check = await HelperIdentifier.canIdentifierBeRegisteredAsync(
            args.identifier
        );

        if (!check.canBeRegistered) {
            throw new Error(check.reason);
        }

        // Check if the user provided a valid npub
        let pubkey: string = "";
        try {
            const pk = nip19.decode(args.npub);
            if (pk.type !== "npub") {
                throw new Error("Please provide a valid pubkey.");
            }
            pubkey = pk.data as string;
        } catch (error) {
            throw new Error("Please provide a valid pubkey.");
        }

        // Check if the user is already registered
        let dbUser = await PrismaService.instance.db.user.findFirst({
            where: { pubkey },
        });
        if (dbUser && dbUser.isActivated) {
            throw new Error("You are already registered.");
        }

        if (!dbUser) {
            // Create database user
            dbUser = await PrismaService.instance.db.user.create({
                data: {
                    pubkey,
                    createdAt: new Date(),
                    isActivated: false,
                    identifier: null,
                },
            });
        }

        const previousDbAuthRegistration =
            await PrismaService.instance.db.authRegistration.deleteMany({
                where: { userId: dbUser.id },
            });

        const dbAuthRegistration =
            await PrismaService.instance.db.authRegistration.create({
                data: {
                    userId: dbUser.id,
                    identifier: check.name,
                    createdAt: new Date(),
                    validUntil: DateTime.now().plus({ minute: 5 }).toJSDate(),
                },
            });

        const dbAuthRegistrationCode =
            await PrismaService.instance.db.authRegistrationCode.create({
                data: {
                    authRegistrationId: dbAuthRegistration.id,
                    code: HelperAuth.generateCode(),
                },
            });

        const result = await RelayService.instance.sendAuthAsync(
            //"wss://relay.nostr.info",
            //"wss://relay.damos.io",
            //"wss://nostr.vulpem.com",
            "wss://nostr.yael.at",
            dbUser.pubkey,
            dbAuthRegistrationCode.code,
            dbAuthRegistration.id
        );
        console.log(result);

        return dbAuthRegistration;
    }
}
