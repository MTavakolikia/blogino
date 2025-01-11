import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PostgresAdapter(pool),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
})

