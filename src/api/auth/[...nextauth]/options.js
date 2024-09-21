import connectDB from "@/dbconnection/connection";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials";
import InstagramProvider from "next-auth/providers/instagram";

export const authOptions = {
    provider: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                email: { label: "Username", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", type: "password" }
              },
              async authorize (credentials) {
                await connectDB()
                try {
                    const user = await User.findOne({
                        $or: [
                            {username: credentials.identifiers},
                            {email: credentials.identifiers}
                        ]
                    })
                    
                    if(!user){
                        throw new Error('User on this email or username does not exists')
                    }
                    const checkPassword = bcrypt.compare(user.password, credentials.password)
                    if (!checkPassword){
                        throw new Error('Password is incorrect')
                    }
                    return user
                    
                } catch (error) {
                    throw new error
                }
              },
              pages: {
                signin: "sign-in",
                logout: "logout"
              },
              session: {
                strategy: "jwt"
              },
              secret: process.env.AUTH_SECRET,
              callbacks: {
                async jwt({ token, user }) {
                    if (user){
                        token._id = user._id
                        token.username = user.username
                        token.email = user.email
                        token.phone = user.phone
                    }
                    return token
                  },

                async session({ session, token }) {
                    session._id = token._id
                    session.username = token.username
                    session.email = token.email
                    session.phone = token.phone
                    return session
                  }
              }
        }),
        InstagramProvider({
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
          }),
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET
          })
    ]
}