-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otherId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_otherId_fkey" FOREIGN KEY ("otherId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
