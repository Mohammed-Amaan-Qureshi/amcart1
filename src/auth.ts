import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import z from "zod";
import { NextResponse } from "next/server";
import User from "./app/model/user.model";
// import bcrypt from "bcryptjs";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

const signinSchema = z.object({
    email: z.string().email("Enter valid email."),
    password: z.string().min(8,"Password must contain 8 characters.")
})

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers:[
        Credentials({
            credentials:{
                email: { label: "Email" , type: "email" },
                password: { label: "Password" , type: "password" },
            },
            async authorize (credentials, request){
                await connectDb()                

                const parsedCredentials = signinSchema.safeParse(credentials)

                if(!parsedCredentials.success){
                    return null
                }

                const { email, password } = parsedCredentials.data

                const user = await User.findOne({email})

                if(!user || !user.password){
                    return null
                }

                const isPasswordMatch = await bcrypt.compare(password, user.password)

                if(!isPasswordMatch){
                    return null
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role
                }

            }
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    session:{
        strategy: "jwt",
        maxAge: 7*24*60*60
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks:{

        async signIn({user, account}) {
            if(account?.provider === 'google'){
                await connectDb()
                let dbUser = await User.findOne({email: user.email})
                if(!dbUser){
                    dbUser = await User.create({
                        email: user.email,
                        name: user.name,
                        image: user.image, 
                    })
                }
                user.id = dbUser._id?.toString() 
                user.role = dbUser.role

            }
            return true
        },

        jwt({token, user}){
            if(user){
                token.id = user.id?.toString()
                token.email = user.email
                token.name = user.name
                token.role = user.role
            }
            return token
        },
        session({session, token}){
            if(session.user){
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    secret: process.env.NEXT_AUTH_SECRET
})