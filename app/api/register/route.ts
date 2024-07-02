import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
import { hash } from "bcryptjs";
import { randomUUID, UUID } from "crypto";
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const { password, email, name, image, ...remainingFields } = await req.json();
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: remainingFields.username }
                ]
            }
        });
        if (user) {
            return new NextResponse(
                JSON.stringify({
                    message: 'User already exists',
                })
            );
        }
        const newUser = await prisma.user.create({
            data: {
                password: await hash(password, 10),
                email: email,
                name: name,
                image: image,
                ...remainingFields,
                accounts: {
                    create: [
                        {
                            type: "credentials",
                            provider: "codeyard",
                            providerAccountId: randomUUID() as UUID,
                        },
                    ],
                },
            }
        })
        if (newUser) {

            return new NextResponse(
                JSON.stringify({
                    message: 'User created',
                })
            );
        } else {
            return new NextResponse(
                JSON.stringify({
                    message: 'Invalid username or password',
                })
            );
        }
    } else {
        return new NextResponse(
            JSON.stringify({
                message: 'Method Not Allowed',
            })
        );
    }
}