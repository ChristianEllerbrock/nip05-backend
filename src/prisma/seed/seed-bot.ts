import { PrismaClient } from "@prisma/client";
import { Nostr } from "../../nostr/nostr";
import { EnvService } from "../../services/env-service";

const seed = async function (prisma: PrismaClient) {
    const pubkey = Nostr.getPubKeyHexObjectFromPrivKey(
        EnvService.instance.env.BOT_PRIVKEY
    ).hex;

    const botDbUser = await prisma.user.upsert({
        where: { pubkey: pubkey },
        update: {},
        create: {
            pubkey: pubkey,
            createdAt: new Date("1975-05-28"),
        },
    });

    const botDbRegistration = await prisma.registration.upsert({
        where: { identifier: "bot" },
        update: {},
        create: {
            userId: botDbUser.id,
            identifier: "bot",
            createdAt: new Date("1975-05-28"),
            validUntil: new Date("1975-05-29"),
            verifiedAt: new Date("1975-05-30"),
        },
    });

    const botDbRegistrationRelay = await prisma.registrationRelay.deleteMany({
        where: { registrationId: botDbRegistration.id },
    });
    await prisma.registrationRelay.create({
        data: {
            registrationId: botDbRegistration.id,
            address: "wss://nostr-pub.wellorder.net",
        },
    });
};

export { seed as seedBot };

