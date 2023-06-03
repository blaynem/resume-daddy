-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SuggestionType" AS ENUM ('EXPERIENCE', 'JOB_SUMMARY');

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "table_name" TEXT NOT NULL,
    "row_id" TEXT NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestedChanges" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "type" "SuggestionType" NOT NULL,
    "job_id" TEXT,
    "original_content" TEXT NOT NULL,
    "suggested_content" TEXT NOT NULL,
    "suggest_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusType" NOT NULL DEFAULT 'PENDING',
    "status_reason" TEXT,

    CONSTRAINT "suggestedChanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumePredictions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "prompt" TEXT NOT NULL,
    "prediction" TEXT NOT NULL,

    CONSTRAINT "resumePredictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "interpreted_summary" TEXT,
    "user_job_order" INTEGER NOT NULL,
    "company_name" TEXT,
    "date_started" TIMESTAMP(3),
    "date_ended" TIMESTAMP(3),
    "achievements" TEXT,
    "experience" TEXT,
    "interpreted_experience" TEXT,
    "industry_titles" TEXT[],
    "industry_tags" TEXT,
    "type" TEXT,
    "temp_skills" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "content" TEXT NOT NULL,
    "interpretation" TEXT,
    "industry_tags" TEXT[],

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "content" TEXT,
    "industry_tags" TEXT[],

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signup" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "data" JSON NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN DEFAULT false,
    "date_completed" TIMESTAMP(3),

    CONSTRAINT "signup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_jobsToskills" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_user_id_user_job_order_key" ON "jobs"("user_id", "user_job_order");

-- CreateIndex
CREATE UNIQUE INDEX "_jobsToskills_AB_unique" ON "_jobsToskills"("A", "B");

-- CreateIndex
CREATE INDEX "_jobsToskills_B_index" ON "_jobsToskills"("B");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestedChanges" ADD CONSTRAINT "suggestedChanges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumePredictions" ADD CONSTRAINT "resumePredictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobsToskills" ADD CONSTRAINT "_jobsToskills_A_fkey" FOREIGN KEY ("A") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobsToskills" ADD CONSTRAINT "_jobsToskills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

