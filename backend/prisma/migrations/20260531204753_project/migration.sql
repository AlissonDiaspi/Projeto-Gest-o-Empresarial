/*
  Warnings:

  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
