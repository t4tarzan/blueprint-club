-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- Convert existing membershipTier values and create temp column
ALTER TABLE "User" ADD COLUMN "membershipTier_enum" "MembershipTier";
UPDATE "User" SET "membershipTier_enum" = 
  CASE 
    WHEN LOWER("membershipTier") = 'free' THEN 'FREE'::"MembershipTier"
    WHEN LOWER("membershipTier") = 'pro' THEN 'PRO'::"MembershipTier"
    WHEN LOWER("membershipTier") = 'enterprise' THEN 'ENTERPRISE'::"MembershipTier"
    ELSE 'FREE'::"MembershipTier"
  END;

-- Drop old column and rename new one
ALTER TABLE "User" DROP COLUMN "membershipTier";
ALTER TABLE "User" RENAME COLUMN "membershipTier_enum" TO "membershipTier";

-- Set NOT NULL constraint and default
ALTER TABLE "User" ALTER COLUMN "membershipTier" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "membershipTier" SET DEFAULT 'FREE'::"MembershipTier";
