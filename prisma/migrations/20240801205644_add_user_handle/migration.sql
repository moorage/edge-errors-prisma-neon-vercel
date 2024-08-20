/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "handle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");
