-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('PENDING', 'INVITATION_SENT', 'IN_PROGRESS', 'COMPLETED', 'CLEAR', 'CONSIDER', 'DISPUTE', 'DISPUTED', 'EXPIRED', 'DECLINED', 'FAILED', 'CANCELED', 'PARTIAL_COMPLETE', 'SUSPENDED', 'PRE_ADVERSE_ACTION', 'POST_ADVERSE_ACTION');

-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "monthlyContributionAmount" INTEGER,
ADD COLUMN     "platformFee" INTEGER NOT NULL DEFAULT 20000,
ADD COLUMN     "recurringPaymentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "noMiddleName" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "zipcode" TEXT;

-- CreateTable
CREATE TABLE "MonthlyContribution" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "stripeInvoiceId" TEXT,
    "stripeTransferId" TEXT,
    "totalAmount" INTEGER NOT NULL,
    "platformFee" INTEGER NOT NULL,
    "homeProviderAmount" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "status" "ContributionStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "contributionPeriodStart" TIMESTAMP(3) NOT NULL,
    "contributionPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_checks" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "invitationId" TEXT,
    "reportId" TEXT,
    "requestedById" TEXT,
    "candidateUserId" TEXT,
    "candidateEmail" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "candidatePhone" TEXT,
    "candidateZipcode" TEXT,
    "status" "BackgroundCheckStatus" NOT NULL DEFAULT 'PENDING',
    "checkrStatus" TEXT,
    "invitationUrl" TEXT,
    "invitationStatus" TEXT,
    "completedAt" TIMESTAMP(3),
    "invitationSentAt" TIMESTAMP(3),
    "reportData" JSONB,
    "packageName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "background_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyContribution_stripePaymentIntentId_key" ON "MonthlyContribution"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "MonthlyContribution_agreementId_paymentDate_idx" ON "MonthlyContribution"("agreementId", "paymentDate");

-- CreateIndex
CREATE INDEX "MonthlyContribution_status_paymentDate_idx" ON "MonthlyContribution"("status", "paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "background_checks_candidateId_key" ON "background_checks"("candidateId");

-- AddForeignKey
ALTER TABLE "MonthlyContribution" ADD CONSTRAINT "MonthlyContribution_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_checks" ADD CONSTRAINT "background_checks_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_checks" ADD CONSTRAINT "background_checks_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
