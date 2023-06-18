-- IF THE TABLE EVER GETS BLOWN AWAY, HERE ARE THE RLS POLICIES
-- Enable Row Level Security
ALTER TABLE "public"."_jobsToskills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."audit_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."interests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."predictions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."signup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."suggestedChanges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;

---------------
----SELECTs----

-- User Select
CREATE POLICY "Select based on user_id" ON "public"."user"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = id);

-- Jobs Select
CREATE POLICY "Select based on user_id" ON "public"."jobs"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Interests Select
CREATE POLICY "Select based on user_id" ON "public"."interests"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Predictions Select
CREATE POLICY "Select based on user_id" ON "public"."predictions"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Skills Select
CREATE POLICY "Select based on user_id" ON "public"."skills"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Suggested Changes Select
CREATE POLICY "Select based on user_id" ON "public"."suggestedChanges"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);


---------------
----INSERTs----

-- Interests Insert
CREATE POLICY "Insert based on user_id" ON "public"."interests"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Jobs Insert
CREATE POLICY "Insert based on user_id" ON "public"."jobs"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Skills Insert
CREATE POLICY "Insert based on user_id" ON "public"."skills"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

---------------
----UPDATEs----

-- Interests Update
CREATE POLICY "Update based on user_id" ON "public"."interests"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Jobs Update
CREATE POLICY "Update based on user_id" ON "public"."jobs"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Skills Update
CREATE POLICY "Update based on user_id" ON "public"."skills"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);