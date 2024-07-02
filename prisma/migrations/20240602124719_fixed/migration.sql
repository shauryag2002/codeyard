/*
  Warnings:

  - You are about to drop the column `user1Proposed` on the `PlayArea` table. All the data in the column will be lost.
  - You are about to drop the column `user2Proposed` on the `PlayArea` table. All the data in the column will be lost.
  - Added the required column `fixed` to the `PlayArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayArea" DROP COLUMN "user1Proposed",
DROP COLUMN "user2Proposed",
ADD COLUMN     "fixed" BOOLEAN NOT NULL;
