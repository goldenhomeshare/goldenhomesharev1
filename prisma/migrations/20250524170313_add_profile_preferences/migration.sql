-- AlterTable
ALTER TABLE "HomeownerProfile" ADD COLUMN     "lifestyle" JSONB,
ADD COLUMN     "preferredAgeRanges" JSONB,
ADD COLUMN     "preferredGender" TEXT,
ADD COLUMN     "socialMedia" JSONB;

-- AlterTable
ALTER TABLE "HousemateProfile" ADD COLUMN     "maxBudget" INTEGER,
ADD COLUMN     "preferredAgeRanges" JSONB,
ADD COLUMN     "preferredGender" TEXT,
ADD COLUMN     "socialMedia" JSONB;
