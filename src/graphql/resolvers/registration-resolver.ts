import { DateTime } from "luxon";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { HelperAuth } from "../../helpers/helper-auth";
import { HelperIdentifier } from "../../helpers/identifier";
import { Nostr } from "../../nostr/nostr";
import { PrismaService } from "../../services/prisma-service";
import { RelayService_ } from "../../services/relay-service";
import { RegistrationRequestCreateInput } from "../inputs/registration-request-create-input";
import { IdentifierRegisterCheckOutput } from "../outputs/identifier-register-check-output";
import { RegistrationRequestOutput } from "../outputs/registration-request-output";
import { GraphqlContext } from "../type-defs";

@Resolver()
export class RegistrationResolver {
    @Query((returns) => IdentifierRegisterCheckOutput)
    async canIdentifierBeRegistered(
        @Ctx() context: GraphqlContext,
        @Arg("identifier", (type) => String) identifier: string
    ): Promise<IdentifierRegisterCheckOutput> {
        return await HelperIdentifier.canIdentifierBeRegisteredAsync(
            identifier
        );
    }

    @Mutation((returns) => RegistrationRequestOutput)
    async createRegistrationRequest(
        @Args() args: RegistrationRequestCreateInput
    ): Promise<RegistrationRequestOutput> {
        const check = await HelperIdentifier.canIdentifierBeRegisteredAsync(
            args.identifier
        );

        if (!check.canBeRegistered) {
            throw new Error(check.reason);
        }

        let pubkey = Nostr.npubToHexObject(args.npub).hex;

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

        const result = await RelayService_.instance.sendAuthAsync(
            //"wss://nostr.yael.at",
            "wss://relay.nostr.info",
            dbUser.pubkey,
            dbAuthRegistrationCode.code,
            dbAuthRegistration.id
        );
        console.log(result);

        return dbAuthRegistration;
    }
}

