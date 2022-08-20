-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'user', 'membership', 'beta');

-- CreateEnum
CREATE TYPE "auth_type" AS ENUM ('username', 'github');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),
    "username" VARCHAR(25) NOT NULL,
    "email" VARCHAR(25) NOT NULL,
    "name" VARCHAR(25),
    "avatar_url" TEXT,
    "biography" VARCHAR(50),
    "location" VARCHAR(25),
    "role" "role" NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "auth_type" "auth_type" NOT NULL DEFAULT 'username',
    "open_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "priority" INTEGER DEFAULT 0,
    "index" INTEGER NOT NULL DEFAULT 0,
    "toped" BOOLEAN NOT NULL DEFAULT false,
    "archieved" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "content" VARCHAR(255),
    "link_url" TEXT,
    "index" INTEGER NOT NULL DEFAULT 0,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "index" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "index" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_open_id_key" ON "oauth"("open_id");

-- AddForeignKey
ALTER TABLE "oauth" ADD CONSTRAINT "oauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme" ADD CONSTRAINT "theme_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme" ADD CONSTRAINT "theme_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;