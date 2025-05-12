import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const memberRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ familyTreeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // First check if the user has access to this family tree
      const familyTree = await ctx.prisma.familyTree.findFirst({
        where: {
          id: input.familyTreeId,
          userId: session.user.id,
        },
      });
      
      if (!familyTree) {
        throw new Error("Family tree not found or access denied");
      }
      
      return ctx.prisma.familyMember.findMany({
        where: {
          familyTreeId: input.familyTreeId,
        },
        orderBy: {
          lastName: "asc",
        },
        include: {
          parentsRelationships: {
            include: {
              parent: true,
            },
          },
          childrenRelationships: {
            include: {
              child: true,
            },
          },
          partnerRelationshipsAs1: {
            include: {
              partner2: true,
            },
          },
          partnerRelationshipsAs2: {
            include: {
              partner1: true,
            },
          },
          events: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      
      const member = await ctx.prisma.familyMember.findUnique({
        where: {
          id: input.id,
        },
        include: {
          familyTree: true,
          parentsRelationships: {
            include: {
              parent: true,
            },
          },
          childrenRelationships: {
            include: {
              child: true,
            },
          },
          partnerRelationshipsAs1: {
            include: {
              partner2: true,
            },
          },
          partnerRelationshipsAs2: {
            include: {
              partner1: true,
            },
          },
          events: true,
        },
      });
      
      if (!member || member.familyTree.userId !== session.user.id) {
        throw new Error("Member not found or access denied");
      }
      
      return member;
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        familyTreeId: z.string(),
        gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]),
        birthDate: z.date().optional().nullable(),
        deathDate: z.date().optional().nullable(),
        birthPlace: z.string().optional().nullable(),
        deathPlace: z.string().optional().nullable(),
        bio: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to family tree
      const familyTree = await ctx.prisma.familyTree.findFirst({
        where: {
          id: input.familyTreeId,
          userId: session.user.id,
        },
      });
      
      if (!familyTree) {
        throw new Error("Family tree not found or access denied");
      }
      
      return ctx.prisma.familyMember.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          familyTreeId: input.familyTreeId,
          gender: input.gender,
          birthDate: input.birthDate,
          deathDate: input.deathDate,
          birthPlace: input.birthPlace,
          deathPlace: input.deathPlace,
          bio: input.bio,
          photoUrl: input.photoUrl,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]),
        birthDate: z.date().optional().nullable(),
        deathDate: z.date().optional().nullable(),
        birthPlace: z.string().optional().nullable(),
        deathPlace: z.string().optional().nullable(),
        bio: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to the member
      const member = await ctx.prisma.familyMember.findUnique({
        where: {
          id: input.id,
        },
        include: {
          familyTree: true,
        },
      });
      
      if (!member || member.familyTree.userId !== session.user.id) {
        throw new Error("Member not found or access denied");
      }
      
      return ctx.prisma.familyMember.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          birthDate: input.birthDate,
          deathDate: input.deathDate,
          birthPlace: input.birthPlace,
          deathPlace: input.deathPlace,
          bio: input.bio,
          photoUrl: input.photoUrl,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to the member
      const member = await ctx.prisma.familyMember.findUnique({
        where: {
          id: input.id,
        },
        include: {
          familyTree: true,
        },
      });
      
      if (!member || member.familyTree.userId !== session.user.id) {
        throw new Error("Member not found or access denied");
      }
      
      return ctx.prisma.familyMember.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // Add a parent-child relationship
  addRelationship: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        childId: z.string(),
        type: z.enum(["BIOLOGICAL", "ADOPTED", "FOSTER", "STEP", "OTHER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to both family members
      const parent = await ctx.prisma.familyMember.findUnique({
        where: { id: input.parentId },
        include: { familyTree: true },
      });
      
      const child = await ctx.prisma.familyMember.findUnique({
        where: { id: input.childId },
        include: { familyTree: true },
      });
      
      if (
        !parent || !child || 
        parent.familyTree.userId !== session.user.id ||
        child.familyTree.userId !== session.user.id
      ) {
        throw new Error("Members not found or access denied");
      }
      
      return ctx.prisma.relationship.create({
        data: {
          parentId: input.parentId,
          childId: input.childId,
          type: input.type,
        },
      });
    }),

  // Add a partnership relationship
  addPartnership: protectedProcedure
    .input(
      z.object({
        partner1Id: z.string(),
        partner2Id: z.string(),
        type: z.enum([
          "MARRIAGE",
          "DOMESTIC_PARTNERSHIP",
          "ENGAGEMENT",
          "RELATIONSHIP",
          "DIVORCED",
          "SEPARATED",
          "OTHER",
        ]),
        startDate: z.date().optional().nullable(),
        endDate: z.date().optional().nullable(),
        place: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to both partners
      const partner1 = await ctx.prisma.familyMember.findUnique({
        where: { id: input.partner1Id },
        include: { familyTree: true },
      });
      
      const partner2 = await ctx.prisma.familyMember.findUnique({
        where: { id: input.partner2Id },
        include: { familyTree: true },
      });
      
      if (
        !partner1 || !partner2 || 
        partner1.familyTree.userId !== session.user.id ||
        partner2.familyTree.userId !== session.user.id
      ) {
        throw new Error("Members not found or access denied");
      }
      
      return ctx.prisma.partnership.create({
        data: {
          partner1Id: input.partner1Id,
          partner2Id: input.partner2Id,
          type: input.type,
          startDate: input.startDate,
          endDate: input.endDate,
          place: input.place,
          notes: input.notes,
        },
      });
    }),

  // Add a life event
  addEvent: protectedProcedure
    .input(
      z.object({
        familyMemberId: z.string(),
        type: z.enum([
          "BIRTH",
          "DEATH",
          "MARRIAGE",
          "DIVORCE",
          "GRADUATION",
          "CAREER",
          "MOVE",
          "MEDICAL",
          "OTHER",
        ]),
        date: z.date().optional().nullable(),
        place: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      
      // Check access to the member
      const member = await ctx.prisma.familyMember.findUnique({
        where: { id: input.familyMemberId },
        include: { familyTree: true },
      });
      
      if (!member || member.familyTree.userId !== session.user.id) {
        throw new Error("Member not found or access denied");
      }
      
      return ctx.prisma.memberEvent.create({
        data: {
          familyMemberId: input.familyMemberId,
          type: input.type,
          date: input.date,
          place: input.place,
          description: input.description,
        },
      });
    }),
}); 