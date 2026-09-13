import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // Case-insensitive email search
        const user = await User.findOne({
          email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("Account registered via Google. Please sign in with Google.");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // Only block if explicitly set to false
        if (user.isEmailVerified === false) {
          throw new Error("EMAIL_NOT_VERIFIED:" + user.email);
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const normalizedEmail = user.email?.toLowerCase().trim();

        let dbUser = await User.findOne({
          email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
        });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: normalizedEmail,
            image: user.image,
            provider: "google",
            isEmailVerified: true,
          });
        } else {
          let updated = false;
          if (!dbUser.isEmailVerified) {
            dbUser.isEmailVerified = true;
            updated = true;
          }
          if (!dbUser.image && user.image) {
            dbUser.image = user.image;
            updated = true;
          }
          if (updated) {
            await dbUser.save();
          }
        }
      }

      return true;
    },

    async session({ session }) {
      if (!session?.user?.email) return session;

      await connectDB();

      const normalizedEmail = session.user.email.toLowerCase().trim();

      const dbUser = await User.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
      });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image || "";
        session.user.isEmailVerified = dbUser.isEmailVerified !== false;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
});
