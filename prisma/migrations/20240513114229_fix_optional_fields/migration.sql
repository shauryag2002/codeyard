-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_mergedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rejectedId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mergedId" DROP NOT NULL,
ALTER COLUMN "rejectedId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mergedId_fkey" FOREIGN KEY ("mergedId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rejectedId_fkey" FOREIGN KEY ("rejectedId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
