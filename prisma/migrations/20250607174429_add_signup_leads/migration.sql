-- CreateTable
CREATE TABLE "signup_leads" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "language" TEXT,
    "gender" TEXT,
    "city" TEXT,
    "state" TEXT,
    "maxBudget" INTEGER,
    "profilePicture" TEXT,
    "educationLevel" TEXT,
    "educationProgram" TEXT,
    "stillAttending" BOOLEAN,
    "isRetired" BOOLEAN,
    "occupation" TEXT,
    "schedule" TEXT,
    "socialPreference" TEXT,
    "hobbies" JSONB,
    "hasPets" BOOLEAN,
    "petDescription" TEXT,
    "numberOfPeople" TEXT,
    "smokingStatus" TEXT,
    "guestPolicy" TEXT,
    "preferredGender" TEXT,
    "canHelpWith" JSONB,
    "bio" TEXT,
    "lastCompletedStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL DEFAULT 10,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "source" TEXT,
    "campaign" TEXT,
    "medium" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signup_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signup_leads_userId_key" ON "signup_leads"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "signup_leads_sessionId_key" ON "signup_leads"("sessionId");

-- CreateIndex
CREATE INDEX "signup_leads_email_idx" ON "signup_leads"("email");

-- CreateIndex
CREATE INDEX "signup_leads_createdAt_idx" ON "signup_leads"("createdAt");

-- CreateIndex
CREATE INDEX "signup_leads_lastCompletedStep_idx" ON "signup_leads"("lastCompletedStep");

-- CreateIndex
CREATE INDEX "signup_leads_source_campaign_idx" ON "signup_leads"("source", "campaign");

-- AddForeignKey
ALTER TABLE "signup_leads" ADD CONSTRAINT "signup_leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
