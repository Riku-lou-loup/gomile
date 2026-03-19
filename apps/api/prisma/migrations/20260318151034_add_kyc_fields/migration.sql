/*
  Warnings:

  - Added the required column `documentUrl` to the `KycSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KycSubmission" ADD COLUMN     "documentUrl" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT;
