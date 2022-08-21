-- AlterEnum
ALTER TYPE "auth_type" ADD VALUE 'email';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" VARCHAR(16),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50);
