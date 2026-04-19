/*
  Warnings:

  - The values [PERMIS,CARTE_GRISE,JUSTIFICATIF] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('DRIVING_LICENSE', 'REGISTRATION_CARD', 'RIB', 'CNI', 'PASSPORT', 'OTHER');
ALTER TABLE "DriverDocument" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "public"."DocumentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "city" TEXT,
ADD COLUMN     "equipments" TEXT[],
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zipCode" TEXT;
