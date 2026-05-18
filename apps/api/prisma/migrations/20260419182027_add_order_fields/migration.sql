/*
  Warnings:

  - A unique constraint covering the columns `[orderReference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('FOOD', 'PHARMACY', 'GROCERY', 'CLOTHING', 'ELECTRONICS', 'FURNITURE', 'DOCUMENTS', 'OTHER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "distanceKm" DOUBLE PRECISION,
ADD COLUMN     "orderReference" TEXT,
ADD COLUMN     "packageSize" "PackageSize" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "reward" DOUBLE PRECISION,
ADD COLUMN     "type" "OrderType" NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderReference_key" ON "Order"("orderReference");
