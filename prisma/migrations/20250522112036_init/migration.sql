-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('BIOLOGICAL', 'ADOPTED', 'FOSTER', 'STEP', 'OTHER');

-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('MARRIAGE', 'DOMESTIC_PARTNERSHIP', 'ENGAGEMENT', 'RELATIONSHIP', 'DIVORCED', 'SEPARATED', 'OTHER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BIRTH', 'DEATH', 'MARRIAGE', 'DIVORCE', 'GRADUATION', 'CAREER', 'MOVE', 'MEDICAL', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyTree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "birthPlace" TEXT,
    "deathPlace" TEXT,
    "familyTreeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" "RelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partnership" (
    "id" TEXT NOT NULL,
    "partner1Id" TEXT NOT NULL,
    "partner2Id" TEXT NOT NULL,
    "type" "PartnershipType" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "place" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberEvent" (
    "id" TEXT NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3),
    "place" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_parentId_childId_key" ON "Relationship"("parentId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_partner1Id_partner2Id_key" ON "Partnership"("partner1Id", "partner2Id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyTree" ADD CONSTRAINT "FamilyTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyTreeId_fkey" FOREIGN KEY ("familyTreeId") REFERENCES "FamilyTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_childId_fkey" FOREIGN KEY ("childId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_partner1Id_fkey" FOREIGN KEY ("partner1Id") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_partner2Id_fkey" FOREIGN KEY ("partner2Id") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEvent" ADD CONSTRAINT "MemberEvent_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
