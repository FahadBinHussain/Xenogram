import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const familyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    return ctx.prisma.familyTree.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      return ctx.prisma.familyTree.findFirst({
        where: {
          id: input.id,
          userId: session.user.id,
        },
        include: {
          members: {
            include: {
              parentsRelationships: {
                include: {
                  child: true,
                },
              },
              childrenRelationships: {
                include: {
                  parent: true,
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
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      return ctx.prisma.familyTree.create({
        data: {
          name: input.name,
          description: input.description,
          userId: session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      return ctx.prisma.familyTree.update({
        where: {
          id: input.id,
          userId: session.user.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      return ctx.prisma.familyTree.delete({
        where: {
          id: input.id,
          userId: session.user.id,
        },
      });
    }),
}); 