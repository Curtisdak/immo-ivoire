/*
  Warnings:

  - The `propertyType` column on the `House` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "HouseIsFor" AS ENUM ('SELL', 'RENT');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'LAND', 'APPARTMENT', 'BUILDING', 'FARMING', 'SHOP');

-- AlterEnum
ALTER TYPE "HouseStatus" ADD VALUE 'RENTED';

-- AlterTable
ALTER TABLE "House" ADD COLUMN     "for" "HouseIsFor" NOT NULL DEFAULT 'SELL',
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" "PropertyType" NOT NULL DEFAULT 'HOUSE';
