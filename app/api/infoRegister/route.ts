import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { getSession } from 'next-auth/react';
export async function PUT(req: any) {
    if (req.method === 'PUT') {
        const { username, age, gender, bio, resume, YOE, id, location } = await req.json();
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
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
        const existingUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: username,
                age: age,
                gender: gender,
                bio: bio,
                resume: resume,
                YOE: YOE,
                location: location
            }
        })
        if (existingUser) {
            const session = await getSession({ req });
            if (session && session.user && session.user.username) {
                session.user.username = username;

            }

            return new NextResponse(
                JSON.stringify({
                    message: 'User updated',
                })
            );
        } else {
            return new NextResponse(
                JSON.stringify({
                    message: 'User not found',
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