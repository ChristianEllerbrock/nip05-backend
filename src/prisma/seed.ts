import { PrismaClient } from "@prisma/client";
import { UserEventTypeId } from "./interfaces";
import { seedBlockedIdentifier } from "./seed/seed-blocked-identifier";
import { seedUser } from "./seed/seed-user";
import { seedUserEventType } from "./seed/seed-user-event-type";

const prisma = new PrismaClient();

async function main() {
    await seedUserEventType(prisma);
    await seedBlockedIdentifier(prisma);

    await seedUser(prisma);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

