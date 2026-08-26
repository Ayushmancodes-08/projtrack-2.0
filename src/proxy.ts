import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/forgot-password(.*)",
  "/auth(.*)",
  "/api/send-invite(.*)",
  "/api/public(.*)",
  "/api/socket(.*)",
])

export default clerkMiddleware(
  async (auth, request) => {
    try {
      const teamSession = request.cookies.get("projtrack_team_session")?.value

      if (!isPublicRoute(request) && !teamSession) {
        await auth.protect({
          unauthenticatedUrl: new URL("/login", request.url).toString(),
        })
      }
    } catch (err) {
      console.error("Middleware auth error:", err)
      // Allow request to proceed or let client-side auth handle fallback
    }
  },
  {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
