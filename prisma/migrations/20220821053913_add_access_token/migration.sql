/*
  Warnings:

  - The values [username,email] on the enum `auth_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `access_token` to the `auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "auth_type_new" AS ENUM ('github', 'google');
ALTER TABLE "auth" ALTER COLUMN "auth_type" DROP DEFAULT;
ALTER TABLE "auth" ALTER COLUMN "auth_type" TYPE "auth_type_new" USING ("auth_type"::text::"auth_type_new");
ALTER TYPE "auth_type" RENAME TO "auth_type_old";
ALTER TYPE "auth_type_new" RENAME TO "auth_type";
DROP TYPE "auth_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "auth" ADD COLUMN     "access_token" VARCHAR(128) NOT NULL,
ALTER COLUMN "auth_type" DROP DEFAULT;
