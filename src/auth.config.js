// Edge-compatible auth config - NO Prisma / bcrypt imports here.
// Used by proxy.js (Edge Runtime) for route protection via JWT verification.

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real provider added in auth.js (Node.js only)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const authPages = ["/login", "/register"];
      const isAuthPage = authPages.some((p) => nextUrl.pathname.startsWith(p));
      const protectedPaths = [
        "/dashboard",
        "/advisory",
        "/weather",
        "/pest-risk",
        "/market",
        "/community",
      ];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p),
      );

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (isProtected) return isLoggedIn; // redirect to /login if not logged in
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.state = user.state;
        token.village = user.village;
        token.farmerType = user.farmerType;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.state = token.state;
        session.user.village = token.village;
        session.user.farmerType = token.farmerType;
      }
      return session;
    },
  },
};
