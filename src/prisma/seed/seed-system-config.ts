import { PrismaClient } from "@prisma/client";

const seed = async function (prisma: PrismaClient) {
    await prisma.systemConfig.deleteMany({});

    let i = 1;
    await prisma.systemConfig.createMany({
        data: [
            { id: i++, name: "REGISTRATION_VALIDITY_IN_MINUTES", value: "20" },
        ],
    });
};

export { seed as seedSystemConfig };

