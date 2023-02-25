import { PrismaClient } from "@prisma/client";

const seed = async function (prisma: PrismaClient) {
    await prisma.systemBlockedIdentifier.deleteMany({});

    await prisma.systemBlockedIdentifier.createMany({
        data: [
            { name: "admin" },
            { name: "administrator" },
            { name: "bot" },
            { name: "help" },
            { name: "info" },
            { name: "information" },
            { name: "registration" },
            { name: "support" },
        ],
    });
};

export { seed as seedSystemBlockedIdentifier };

