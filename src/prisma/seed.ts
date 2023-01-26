import { PrismaClient } from "@prisma/client";
import { UserEventTypeId } from "./interfaces";
import { seedUserEventType } from "./seed/seed-user-event-type";

const prisma = new PrismaClient();

async function main() {
    await seedUserEventType(prisma);
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

