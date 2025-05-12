import { createTRPCRouter } from "@/server/api/trpc"
import { familyRouter } from "./routers/family"
import { memberRouter } from "./routers/member"

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  family: familyRouter,
  member: memberRouter,
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter 