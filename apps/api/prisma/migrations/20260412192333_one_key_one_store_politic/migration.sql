/*
  Warnings:

  - Added the required column `storeId` to the `MerchantApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoreProvider" AS ENUM ('WOOCOMMERCE', 'SHOPIFY', 'OTHER');

-- AlterTable
ALTER TABLE "MerchantApiKey" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "storeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "domain" TEXT,
ADD COLUMN     "provider" "StoreProvider",
ADD COLUMN     "webhookUrl" TEXT;

-- CreateIndex
CREATE INDEX "MerchantApiKey_storeId_idx" ON "MerchantApiKey"("storeId");

-- AddForeignKey
ALTER TABLE "MerchantApiKey" ADD CONSTRAINT "MerchantApiKey_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
