/*
  Warnings:

  - You are about to drop the column `archieved` on the `note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "note" DROP COLUMN "archieved",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
