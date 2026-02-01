-- CreateEnum
CREATE TYPE "EntityCategory" AS ENUM ('DISCO', 'GENCO', 'SERVICE_PROVIDER', 'SERC', 'BILATERAL');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('draft', 'pending_validation', 'validated', 'active', 'suspended', 'deactivated');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ChargeBeneficiaryType" AS ENUM ('SERVICE_PROVIDER', 'GENCO');

-- CreateEnum
CREATE TYPE "ChargeCategory" AS ENUM ('DISCO', 'BILATERAL');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('pending', 'verified', 'posted');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'finance_manager', 'treasury_officer', 'settlement_officer', 'auditor', 'viewer');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'pending', 'locked');

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankCode" TEXT,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredEntity" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "EntityCategory" NOT NULL,
    "description" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "remitaValidated" BOOLEAN NOT NULL DEFAULT false,
    "remitaValidationDate" TIMESTAMP(3),
    "linkedServiceProviderId" TEXT,
    "linkedServiceProviderName" TEXT,
    "state" TEXT,
    "linkedGencoIds" TEXT[],
    "isPrioritySP" BOOLEAN NOT NULL DEFAULT false,
    "waterfallTier" INTEGER,
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'draft',
    "registeredBy" TEXT,
    "registeredAt" TIMESTAMP(3),
    "validatedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "totalCollections" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDisbursements" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingDebt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisteredEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SercAllocation" (
    "id" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "sercId" TEXT NOT NULL,

    CONSTRAINT "SercAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "hasSubCharges" BOOLEAN NOT NULL DEFAULT false,
    "chargeCategory" "ChargeCategory",
    "beneficiaryType" "ChargeBeneficiaryType",
    "status" "ChargeStatus" NOT NULL DEFAULT 'active',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChargeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCharge" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "entityType" TEXT NOT NULL,
    "chargeTypeId" TEXT NOT NULL,

    CONSTRAINT "SubCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityAlias" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "chargeTypeId" TEXT NOT NULL,
    "chargeCode" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "serviceProviderAlias" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "CollectionStatus" NOT NULL DEFAULT 'pending',
    "auditLocked" BOOLEAN NOT NULL DEFAULT false,
    "auditHash" TEXT,
    "postedBy" TEXT,
    "postedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "department" TEXT,
    "phone" TEXT,
    "lastLogin" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChargeServiceProviders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChargeServiceProviders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChargeGencos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChargeGencos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_entityId_key" ON "BankDetails"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredEntity_alias_key" ON "RegisteredEntity"("alias");

-- CreateIndex
CREATE INDEX "RegisteredEntity_category_idx" ON "RegisteredEntity"("category");

-- CreateIndex
CREATE INDEX "RegisteredEntity_registrationStatus_idx" ON "RegisteredEntity"("registrationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "SercAllocation_sercId_serviceProviderId_key" ON "SercAllocation"("sercId", "serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "ChargeType_code_key" ON "ChargeType"("code");

-- CreateIndex
CREATE INDEX "ChargeType_chargeCategory_idx" ON "ChargeType"("chargeCategory");

-- CreateIndex
CREATE INDEX "ChargeType_status_idx" ON "ChargeType"("status");

-- CreateIndex
CREATE INDEX "SubCharge_chargeTypeId_idx" ON "SubCharge"("chargeTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_paymentId_key" ON "Collection"("paymentId");

-- CreateIndex
CREATE INDEX "Collection_entityId_idx" ON "Collection"("entityId");

-- CreateIndex
CREATE INDEX "Collection_chargeTypeId_idx" ON "Collection"("chargeTypeId");

-- CreateIndex
CREATE INDEX "Collection_period_idx" ON "Collection"("period");

-- CreateIndex
CREATE INDEX "Collection_status_idx" ON "Collection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "_ChargeServiceProviders_B_index" ON "_ChargeServiceProviders"("B");

-- CreateIndex
CREATE INDEX "_ChargeGencos_B_index" ON "_ChargeGencos"("B");

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "RegisteredEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SercAllocation" ADD CONSTRAINT "SercAllocation_sercId_fkey" FOREIGN KEY ("sercId") REFERENCES "RegisteredEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCharge" ADD CONSTRAINT "SubCharge_chargeTypeId_fkey" FOREIGN KEY ("chargeTypeId") REFERENCES "ChargeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "RegisteredEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_chargeTypeId_fkey" FOREIGN KEY ("chargeTypeId") REFERENCES "ChargeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChargeServiceProviders" ADD CONSTRAINT "_ChargeServiceProviders_A_fkey" FOREIGN KEY ("A") REFERENCES "ChargeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChargeServiceProviders" ADD CONSTRAINT "_ChargeServiceProviders_B_fkey" FOREIGN KEY ("B") REFERENCES "RegisteredEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChargeGencos" ADD CONSTRAINT "_ChargeGencos_A_fkey" FOREIGN KEY ("A") REFERENCES "ChargeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChargeGencos" ADD CONSTRAINT "_ChargeGencos_B_fkey" FOREIGN KEY ("B") REFERENCES "RegisteredEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
