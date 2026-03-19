/*
  Warnings:

  - Added the required column `address` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
