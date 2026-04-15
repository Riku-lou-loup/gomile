/*
  Warnings:

  - The primary key for the `Driver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Driver` table. All the data in the column will be lost.
  - The primary key for the `Merchant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Merchant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "KycSubmission" DROP CONSTRAINT "KycSubmission_driverId_fkey";

-- DropForeignKey
ALTER TABLE "MerchantApiKey" DROP CONSTRAINT "MerchantApiKey_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_driverId_fkey";

-- DropIndex
DROP INDEX "Driver_userId_key";

-- DropIndex
DROP INDEX "Merchant_userId_key";

-- AlterTable
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Merchant_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "MerchantApiKey" ADD CONSTRAINT "MerchantApiKey_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycSubmission" ADD CONSTRAINT "KycSubmission_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
