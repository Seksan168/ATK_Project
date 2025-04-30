import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try{
    const {name, email, password} = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const prisma = new PrismaClient()
    const newUser = await prisma.user
        .create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
    if (!newUser) {
        return Response.json({
            error: "User creation failed."
        }, { status: 500 });
    }
    return Response.json({
        message: "User created successfully.",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            createdAt: newUser.createdAt,
            
        }

    });
} catch (error) {
    return Response.json({
        error: "An error occurred while processing your request."}, { status: 500 });
    }
}