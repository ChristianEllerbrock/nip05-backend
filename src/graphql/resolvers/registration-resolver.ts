import { DateTime } from "luxon";
import { Arg, Args, Mutation, Resolver } from "type-graphql";
import { HelperAuth } from "../../helpers/helper-auth";
import { HelperIdentifier } from "../../helpers/identifier";
import { Nostr } from "../../nostr/nostr";
import { SystemConfigId } from "../../prisma/assortments";
import { PrismaService } from "../../services/prisma-service";
import { RegistrationCodeCreateInput } from "../inputs/registration-code-create-input";
import { RegistrationCreateInput } from "../inputs/registration-create-input";
import { RegistrationOutput } from "../outputs/registration-output";

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

    @Mutation((returns) => Boolean)
    async createRegistrationCode(
        @Args() args: RegistrationCodeCreateInput
    ): Promise<boolean> {
        const now = DateTime.now();

        const registrationCodeValidityInMinutes =
            await PrismaService.instance.getSystemConfigAsNumberAsync(
                SystemConfigId.RegistrationCodeValidityInMinutes
            );

        if (!registrationCodeValidityInMinutes) {
            throw new Error("Invalid system config. Please contact support.");
        }

        const dbRegistration =
            await PrismaService.instance.db.registration.findFirst({
                where: { id: args.registrationId, userId: args.userId },
                include: { registrationCode: true },
            });

        if (!dbRegistration) {
            throw new Error("No registration found with these parameters.");
        }

        if (dbRegistration.verifiedAt) {
            throw new Error("The registration is already verified.");
        }

        // Delete old code if one is available
        if (dbRegistration.registrationCode) {
            await PrismaService.instance.db.registrationCode.delete({
                where: { id: dbRegistration.registrationCode.id },
            });
        }

        // Create new code
        const dbRegistrationCode =
            await PrismaService.instance.db.registrationCode.create({
                data: {
                    registrationId: args.registrationId,
                    createdAt: now.toJSDate(),
                    validUntil: now
                        .plus({ minute: registrationCodeValidityInMinutes })
                        .toJSDate(),
                    code: HelperAuth.generateCode(),
                },
            });

        // TODO: Send code via NOSTR relay
        return true;
    }

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

        const registrationValidityInMinutes =
            await PrismaService.instance.getSystemConfigAsNumberAsync(
                SystemConfigId.RegistrationValidityInMinutes
            );
        if (!registrationValidityInMinutes) {
            throw new Error("System config not found in database.");
        }

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

