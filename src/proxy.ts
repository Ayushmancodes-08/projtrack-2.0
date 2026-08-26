import { clerkMiddleware } from "@clerk/nextjs/server"

const PUBLIC_PATTERNS = [
  /^\/$/,
  /^\/login(?:\/.*)?$/,
  /^\/signup(?:\/.*)?$/,
  /^\/forgot-password(?:\/.*)?$/,
  /^\/api\/public(?:\/.*)?$/,
  /^\/api\/send-invite(?:\/.*)?$/,
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATTERNS.some((pattern) => pattern.test(pathname))
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl
  const teamSession = request.cookies.get("projtrack_team_session")?.value

  if (!isPublicRoute(pathname) && !teamSession) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
