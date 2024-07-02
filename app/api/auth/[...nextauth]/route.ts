import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '../../../../lib/db'
import { compare } from "bcryptjs";
import { type DefaultSession, NextAuthOptions } from "next-auth";
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            username: string;
            email: string;
            name: string;
        } & DefaultSession["user"];
    }
}
const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;
                if (!email || !password) {
                    return null;
                }
                try {

                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { username: email }
                            ],
                        },
                    });
                    if (!user) {
                        return null;
                    }
                    const isValid = await compare(password, user.password ?? "");
                    if (!isValid) {
                        return null;
                    }

                    return { id: user.id, username: user.username!, email: user.email!, image: user.image!, name: user.name! };
                }
                catch (err) {
                    console.error(err)
                    return null;
                }
            }

        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {

        async session({ session, user, token }) {
            const user_username = await prisma.user.findFirst({
                where: {
                    email: session.user?.email,
                },
            });

            if (!session?.user?.id && !session?.user?.username && session.user) {
                session.user.id = token.sub ?? "";
                session.user.username = user_username?.username ?? "";
            }
            return Promise.resolve(session);

        },
        async jwt({ token, account, profile, user }) {
            const user_username = await prisma.user.findFirst({
                where: {
                    email: token?.email,
                },
            });
            token.user = { ...user, username: user_username?.username ?? null, id: user_username?.id }
            return Promise.resolve(token);
        },
        redirect({ url, baseUrl }) {
            return Promise.resolve(url);
        }
    },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
    }
}
const
    handler = NextAuth(
        authOptions
    );
export { handler as GET, handler as POST };