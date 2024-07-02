import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const { search } = await req.json();
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } },
                ],
            },
        });
        return new NextResponse(
            JSON.stringify(users)
        );
    }
}