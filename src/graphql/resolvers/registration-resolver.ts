import { DateTime } from "luxon";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { HelperIdentifier } from "../../helpers/identifier";
import { Nostr } from "../../nostr/nostr";
import { SystemConfigId } from "../../prisma/assortments";
import { PrismaService } from "../../services/prisma-service";
import { RegistrationCreateInput } from "../inputs/registration-request-create-input";
import { IdentifierRegisterCheckOutput } from "../outputs/identifier-register-check-output";
import { RegistrationOutput } from "../outputs/registration-output";
import { GraphqlContext } from "../type-defs";

@Resolver()
export class RegistrationResolver {
    // @Query((returns) => IdentifierRegisterCheckOutput)
    // async canIdentifierBeRegistered(
    //     @Ctx() context: GraphqlContext,
    //     @Arg("identifier", (type) => String) identifier: string
    // ): Promise<IdentifierRegisterCheckOutput> {
    //     return await HelperIdentifier.canIdentifierBeRegisteredAsync(
    //         identifier
    //     );
    // }

    @Mutation((returns) => RegistrationOutput)
    async createRegistration(
        @Args() args: RegistrationCreateInput
    ): Promise<RegistrationOutput> {
        const now = DateTime.now();

        // Clean up registration table
        await PrismaService.instance.db.registration.deleteMany({
            where: {
                verifiedAt: null,
                validUntil: { lt: now.toJSDate() },
            },
        });

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
        if (!dbUser) {
            // Create database user
            dbUser = await PrismaService.instance.db.user.create({
                data: {
                    pubkey,
                    createdAt: new Date(),
                },
            });
        }

        const registrationValidityInMinutesAsString =
            await PrismaService.instance.getSystemConfigAsync(
                SystemConfigId.RegistrationValidityInMinutes
            );
        if (!registrationValidityInMinutesAsString) {
            throw new Error("System config not found in database.");
        }

        const registrationValidityInMinutes = Number.parseInt(
            registrationValidityInMinutesAsString
        );

        // Create registration in database
        const dbRegistration =
            await PrismaService.instance.db.registration.create({
                data: {
                    userId: dbUser.id,
                    identifier: check.name,
                    createdAt: new Date(),
                    validUntil: now
                        .plus({ minute: registrationValidityInMinutes })
                        .toJSDate(),
                    verifiedAt: null,
                },
            });

        return dbRegistration;

        // const result = await RelayService_.instance.sendAuthAsync(
        //     //"wss://nostr.yael.at",
        //     "wss://relay.nostr.info",
        //     dbUser.pubkey,
        //     dbAuthRegistrationCode.code,
        //     dbAuthRegistration.id
        // );
        // console.log(result);

        // return dbAuthRegistration;
    }
}

