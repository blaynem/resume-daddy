/*
  Warnings:

  - You are about to drop the `resumePredictions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "resumePredictions" DROP CONSTRAINT "resumePredictions_user_id_fkey";

-- DropTable
DROP TABLE "resumePredictions";

-- CreateTable
CREATE TABLE "predictions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "job_description" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "prediction" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
