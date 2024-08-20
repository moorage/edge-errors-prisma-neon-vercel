/*
  Warnings:

  - You are about to drop the column `published` on the `groups` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[handle]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "published",
ADD COLUMN     "handle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "groups_handle_key" ON "groups"("handle");
