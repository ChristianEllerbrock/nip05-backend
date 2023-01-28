import { PrismaClient } from "@prisma/client";

const seed = async function (prisma: PrismaClient) {
    await prisma.blockedIdentifier.deleteMany({});

    await prisma.blockedIdentifier.createMany({
        data: [
            { name: "admin" },
            { name: "administrator" },
            { name: "bot" },
            { name: "help" },
            { name: "support" },
        ],
    });
};

export { seed as seedBlockedIdentifier };

