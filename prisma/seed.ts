// prisma/seed.ts
console.log("👋 Seeding script started");

import { PrismaClient  } from "@prisma/client";
const prisma = new PrismaClient()

async function main() {
  await prisma.systemControl.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      allowAdmins: true,
      allowSuperAdmins: true,
    },
  })
  console.log("System control record created ✅")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
