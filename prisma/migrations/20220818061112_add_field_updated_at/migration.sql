/*
  Warnings:

  - You are about to drop the column `update_at` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "theme" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "update_at",
ADD COLUMN     "updated_at" TIMESTAMP(3);
