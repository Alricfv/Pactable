

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "private"."agreement_creator"("p_agreement_id" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT created_by
    FROM public.agreements
    WHERE id = p_agreement_id;
$$;


ALTER FUNCTION "private"."agreement_creator"("p_agreement_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_participants_to_agreement"("p_agreement_id" "uuid", "participant_emails" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  email_address text;
  participant_user_id uuid;
BEGIN
  -- Loop through the provided emails and add them as participants
  FOREACH email_address IN ARRAY participant_emails
  LOOP
    participant_user_id := NULL;

    -- Find the user_id for the given email (case-insensitive)
    SELECT id INTO participant_user_id
    FROM public.profiles
    WHERE lower(email) = lower(trim(email_address));

    -- If a user is found, insert them as a participant
    IF participant_user_id IS NOT NULL THEN
      INSERT INTO public.agreement_participants (agreement_id, user_id, status)
      VALUES (p_agreement_id, participant_user_id, 'pending')
      -- Skip if this participant is already in the agreement
      ON CONFLICT (agreement_id, user_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."add_participants_to_agreement"("p_agreement_id" "uuid", "participant_emails" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_agreement_with_participants"("agreement_title" "text", "agreement_content" "text", "participant_emails" "text"[]) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_agreement_id uuid;
  email_address text;
  participant_user_id uuid;
BEGIN
  -- Create the agreement and set the creator
  INSERT INTO public.agreements (title, content, created_by)
  VALUES (agreement_title, agreement_content, auth.uid())
  RETURNING id INTO new_agreement_id;

  -- Loop through the provided emails and add them as participants
  FOREACH email_address IN ARRAY participant_emails
  LOOP
    participant_user_id := NULL;

    -- Find the user_id for the given email (case-insensitive)
    SELECT id INTO participant_user_id
    FROM public.profiles
    WHERE lower(email) = lower(trim(email_address));

    -- If a user is found, insert them as a participant
    IF participant_user_id IS NOT NULL THEN
      INSERT INTO public.agreement_participants (agreement_id, user_id, status)
      VALUES (new_agreement_id, participant_user_id, 'pending');
    END IF;
  END LOOP;

  RETURN new_agreement_id;
END;
$$;


ALTER FUNCTION "public"."create_agreement_with_participants"("agreement_title" "text", "agreement_content" "text", "participant_emails" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_agreement"("agreement_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  creator_id uuid;
BEGIN
  -- Step 1: Find the creator of the agreement to be deleted.
  SELECT created_by INTO creator_id
  FROM public.agreements
  WHERE id = agreement_id;

  -- Step 2: Check if the current user is the creator.
  -- If they are not, raise an exception and stop the function.
  IF creator_id IS NULL OR creator_id != auth.uid() THEN
    RAISE EXCEPTION 'Permission denied: You are not the creator of this agreement.';
  END IF;

  -- Step 3: If the check passes, delete the agreement.
  -- This works because you have ON DELETE CASCADE set up.
  DELETE FROM public.agreements WHERE id = agreement_id;
END;
$$;


ALTER FUNCTION "public"."delete_agreement"("agreement_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email_input" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  user_id uuid;
begin
  -- Get the user_id for the given email from the profiles table
  select id into user_id 
  from public.profiles 
  where email = email_input;
  
  -- Return the user_id (will be null if no user found)
  return user_id;
end;
$$;


ALTER FUNCTION "public"."get_user_id_by_email"("email_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.email  -- This copies the email from auth.users
  );
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."agreement_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agreement_id" "uuid",
    "user_id" "uuid",
    "status" "text" DEFAULT 'Pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "text" DEFAULT 'participant'::"text" NOT NULL,
    "signature_text" "text",
    "signed_date" timestamp with time zone
);


ALTER TABLE "public"."agreement_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "content" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."agreements" OWNER TO "postgres";


COMMENT ON TABLE "public"."agreements" IS 'agreement data is stored here btw';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "email" "text",
    "avatar_url" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."agreement_participants"
    ADD CONSTRAINT "agreement_participants_agreement_user_unique" UNIQUE ("agreement_id", "user_id");



ALTER TABLE ONLY "public"."agreement_participants"
    ADD CONSTRAINT "agreement_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agreements"
    ADD CONSTRAINT "agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "idx_agreement_participants_unique" ON "public"."agreement_participants" USING "btree" ("agreement_id", "user_id");



ALTER TABLE ONLY "public"."agreement_participants"
    ADD CONSTRAINT "agreement_participants_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "public"."agreements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agreement_participants"
    ADD CONSTRAINT "agreement_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agreements"
    ADD CONSTRAINT "agreements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



CREATE POLICY "Agreement creators can add participants" ON "public"."agreement_participants" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."agreements"
  WHERE (("agreements"."id" = "agreement_participants"."agreement_id") AND ("agreements"."created_by" = "auth"."uid"())))));



CREATE POLICY "Agreement creators can delete participants" ON "public"."agreement_participants" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."agreements"
  WHERE (("agreements"."id" = "agreement_participants"."agreement_id") AND ("agreements"."created_by" = "auth"."uid"())))));



CREATE POLICY "Agreement creators can update any participant" ON "public"."agreement_participants" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."agreements"
  WHERE (("agreements"."id" = "agreement_participants"."agreement_id") AND ("agreements"."created_by" = "auth"."uid"())))));



CREATE POLICY "Anyone can read profiles" ON "public"."profiles" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Creator can view own agreement" ON "public"."agreements" FOR SELECT TO "authenticated" USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Creator can view participants, participants can view own row" ON "public"."agreement_participants" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR ("private"."agreement_creator"("agreement_id") = "auth"."uid"())));



CREATE POLICY "Participant can view agreement" ON "public"."agreements" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."agreement_participants" "ap"
  WHERE (("ap"."agreement_id" = "agreements"."id") AND ("ap"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create agreements" ON "public"."agreements" FOR INSERT TO "authenticated" WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can delete agreements they created" ON "public"."agreements" FOR DELETE TO "authenticated" USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update agreements they created" ON "public"."agreements" FOR UPDATE TO "authenticated" USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can update their own participation status" ON "public"."agreement_participants" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their received agreements" ON "public"."agreement_participants" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."agreement_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agreements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "participants can be read by any signed‑in user" ON "public"."agreement_participants" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_participants_to_agreement"("p_agreement_id" "uuid", "participant_emails" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."add_participants_to_agreement"("p_agreement_id" "uuid", "participant_emails" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_participants_to_agreement"("p_agreement_id" "uuid", "participant_emails" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_agreement_with_participants"("agreement_title" "text", "agreement_content" "text", "participant_emails" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_agreement_with_participants"("agreement_title" "text", "agreement_content" "text", "participant_emails" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_agreement_with_participants"("agreement_title" "text", "agreement_content" "text", "participant_emails" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_agreement"("agreement_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_agreement"("agreement_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_agreement"("agreement_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."agreement_participants" TO "anon";
GRANT ALL ON TABLE "public"."agreement_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."agreement_participants" TO "service_role";



GRANT ALL ON TABLE "public"."agreements" TO "anon";
GRANT ALL ON TABLE "public"."agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."agreements" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























