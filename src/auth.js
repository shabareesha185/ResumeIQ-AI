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
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const normalizedEmail = credentials.email?.toLowerCase().trim();

        const user = await User.findOne({
          email: normalizedEmail,
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
      if (account.provider === "google") {
        await connectDB();

        let dbUser = await User.findOne({
          email: user.email,
        });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
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
          if (account.provider === "google" && !dbUser.image) {
            dbUser.image = user.image;
            dbUser.provider = "google";
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
      await connectDB();

      const dbUser = await User.findOne({
        email: session.user.email,
      });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image || "";
        session.user.isEmailVerified = dbUser.isEmailVerified ?? true;
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
