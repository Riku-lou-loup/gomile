/*
  Warnings:

  - You are about to drop the column `name` on the `Driver` table. All the data in the column will be lost.
  - Added the required column `avatarUrl` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNDEFINED');

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "name",
ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
