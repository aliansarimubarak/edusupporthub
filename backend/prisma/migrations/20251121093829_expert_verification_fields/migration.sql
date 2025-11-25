-- CreateEnum
CREATE TYPE "ExpertVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "ExpertProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationAdminNote" TEXT,
ADD COLUMN     "verificationRequestMessage" TEXT,
ADD COLUMN     "verificationStatus" "ExpertVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';
