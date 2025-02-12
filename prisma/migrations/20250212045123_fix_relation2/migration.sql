/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "contactInfo" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3);
