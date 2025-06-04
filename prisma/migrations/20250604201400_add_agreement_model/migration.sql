-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('PENDING_HOMEOWNER', 'PENDING_HOUSEMATE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "agreementData" JSONB NOT NULL,
    "homeownerSigned" BOOLEAN NOT NULL DEFAULT false,
    "homeownerSignedAt" TIMESTAMP(3),
    "homeownerSignature" TEXT,
    "housemateSigned" BOOLEAN NOT NULL DEFAULT false,
    "housemateSignedAt" TIMESTAMP(3),
    "housemateSignature" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'PENDING_HOMEOWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_applicationId_key" ON "Agreement"("applicationId");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
