import { prisma } from "../config/prisma";
import { ExpertVerificationStatus } from "@prisma/client";

export const getExpertProfileForUser = async (userId: string) => {
  return prisma.expertProfile.findUnique({
    where: { userId },
    include: { user: true },
  });
};

interface UpsertExpertProfileInput {
  bio?: string | null;
  degrees?: string[];
  subjects?: string[];
  languages?: string[];
  responseTimeMin?: number | null;
}

// export const upsertExpertProfileForUser = async (
//   userId: string,
//   data: UpsertExpertProfileInput
// ) => {
//     // First, see if profile exists
//   const existing = await prisma.expertProfile.findUnique({
//     where: { userId },
//   });

//   return prisma.expertProfile.upsert({
//     where: { userId },
//     create: {
//       userId,
//       bio: data.bio ?? null,
//       degrees: data.degrees ?? [],
//       subjects: data.subjects ?? [],
//       languages: data.languages ?? [],
//       responseTimeMin: data.responseTimeMin ?? null,
//       // rating, completedOrders, isVerified use defaults
//     },
//     update: {
//       bio: data.bio ?? null,
//       degrees: data.degrees ?? [],
//       subjects: data.subjects ?? [],
//       languages: data.languages ?? [],
//       responseTimeMin: data.responseTimeMin ?? null,
//     },
//   });
// };


export const upsertExpertProfileForUser = async (
  userId: string,
  data: UpsertExpertProfileInput
) => {
  // First, see if profile exists
  const existing = await prisma.expertProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    // First-time profile: start as UNVERIFIED
    return prisma.expertProfile.create({
      data: {
        userId,
        bio: data.bio ?? null,
        degrees: data.degrees ?? [],
        subjects: data.subjects ?? [],
        languages: data.languages ?? [],
        responseTimeMin: data.responseTimeMin ?? null,
        rating: 0,
        completedOrders: 0,
        verificationStatus: ExpertVerificationStatus.UNVERIFIED,
        isVerified: false,
      },
      include: { user: true },
    });
  }

  // If profile was VERIFIED and expert changed something, force re-verification
  const shouldResetVerification =
    existing.verificationStatus === ExpertVerificationStatus.VERIFIED;

  return prisma.expertProfile.update({
    where: { userId },
    data: {
      bio: data.bio ?? null,
      degrees: data.degrees ?? [],
      subjects: data.subjects ?? [],
      languages: data.languages ?? [],
      responseTimeMin: data.responseTimeMin ?? null,
      ...(shouldResetVerification && {
        verificationStatus: ExpertVerificationStatus.UNVERIFIED,
        isVerified: false,
      }),
    },
    include: { user: true },
  });
};
export const requestExpertVerificationForUser = async (
  userId: string,
  message?: string
) => {
  return prisma.expertProfile.update({
    where: { userId },
    data: {
      verificationStatus: ExpertVerificationStatus.PENDING,
      verificationRequestMessage: message,
    },
    include: {
      user: true,
    },
  });
};


