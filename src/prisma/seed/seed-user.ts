import { PrismaClient } from "@prisma/client";
import { UserEventTypeId } from "../interfaces";

const seed = async function (prisma: PrismaClient) {
    const user1Id = "c0dc6607-d86f-45c1-bfea-a1bb87aff952";
    const uuid2 = "527e2afc-f2ae-420b-9976-218346fce165";

    const dbUser1 = await prisma.user.upsert({
        where: { id: user1Id },
        update: {},
        create: {
            id: user1Id,
            pubkey: "6ceb2b11a78732b6f5cb241098bda44ca5759fd7af785eb15475810e81530747",
            identifier: "elli",
            isActivated: true,
            createdAt: new Date(),
        },
    });

    const userRelay1Id = "527e2afc-f2ae-420b-9976-218346fce165";
    await prisma.userRelay.upsert({
        where: { id: userRelay1Id },
        update: {},
        create: {
            id: userRelay1Id,
            userId: dbUser1.id,
            address: "wss://relay.damus.io", //wss://relay.nostr.bg
        },
    });

    const userRelay2Id = "fe93335b-c1e5-4477-9aa9-2a570bbd213e";
    await prisma.userRelay.upsert({
        where: { id: userRelay2Id },
        update: {},
        create: {
            id: userRelay2Id,
            userId: dbUser1.id,
            address: "wss://relay.nostr.bg",
        },
    });
};

export { seed as seedUser };

