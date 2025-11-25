/*
  Warnings:

  - Added the required column `faculty` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "attachmentPath" TEXT,
ADD COLUMN     "faculty" TEXT NOT NULL;
