-- Adding postgis extension manually
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN "lastKnownLocation" geometry(Point, 4326);
CREATE INDEX driver_location_idx ON "Driver" USING GIST("lastKnownLocation");

-- AlterTable
ALTER TABLE "Store" ADD COLUMN "location" geometry(Point, 4326);
CREATE INDEX store_location_idx ON "Store" USING GIST("location");