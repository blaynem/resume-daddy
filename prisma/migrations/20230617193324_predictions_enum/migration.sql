/*
  Warnings:

  - Added the required column `type` to the `predictions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PredictionType" AS ENUM ('FREE_FORM_QUESTION');

-- AlterTable
ALTER TABLE "predictions" ADD COLUMN     "type" "PredictionType" NOT NULL;
