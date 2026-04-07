/*
  Warnings:

  - You are about to drop the column `keyPrefix` on the `MerchantApiKey` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MerchantApiKey_keyPrefix_key";

-- AlterTable
ALTER TABLE "MerchantApiKey" DROP COLUMN "keyPrefix";
