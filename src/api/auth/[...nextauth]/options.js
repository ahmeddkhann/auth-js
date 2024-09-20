import connectDB from "@/dbconnection/connection";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials";

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
              }
        })
    ]
}