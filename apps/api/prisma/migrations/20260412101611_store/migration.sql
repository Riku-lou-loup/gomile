/*
  Warnings:

  - You are about to drop the column `phone` on the `Driver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gomileCode]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deliveryCity` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryRadius` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gomileCode` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportType` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WalletEntryStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'BIKE', 'SCOOTER', 'TRUCK');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PERMIS', 'CARTE_GRISE', 'RIB', 'CNI', 'PASSPORT', 'JUSTIFICATIF');

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "phone",
ADD COLUMN     "activeVehicle" "VehicleType",
ADD COLUMN     "deliveryCity" TEXT NOT NULL,
ADD COLUMN     "deliveryRadius" INTEGER NOT NULL,
ADD COLUMN     "gomileCode" TEXT NOT NULL,
ADD COLUMN     "lastKnownLatitude" DOUBLE PRECISION,
ADD COLUMN     "lastKnownLongitude" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "siret" TEXT,
ADD COLUMN     "status" "DriverStatus" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "totalTrips" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transportType" "VehicleType" NOT NULL,
ALTER COLUMN "avatarUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "WalletEntry" ADD COLUMN     "status" "WalletEntryStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "DriverDocument" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "type" "DocumentType" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DriverDocument_driverId_idx" ON "DriverDocument"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_gomileCode_key" ON "Driver"("gomileCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "DriverDocument" ADD CONSTRAINT "DriverDocument_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
