-- This is an empty migration.

-- Remove preferredAgeRanges column from HomeownerProfile table
ALTER TABLE "HomeownerProfile" DROP COLUMN "preferredAgeRanges";

-- Remove preferredAgeRanges column from HousemateProfile table
ALTER TABLE "HousemateProfile" DROP COLUMN "preferredAgeRanges";