/*
  Warnings:

  - You are about to drop the column `codeHash` on the `Handshake` table. All the data in the column will be lost.
  - Added the required column `code` to the `Handshake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Handshake" DROP COLUMN "codeHash",
ADD COLUMN     "code" TEXT NOT NULL;
