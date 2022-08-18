/*
  Warnings:

  - You are about to drop the column `delete_at` on the `user` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "auth_type" ADD VALUE 'google';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "delete_at",
ADD COLUMN     "deleted_at" TIMESTAMP(3);
