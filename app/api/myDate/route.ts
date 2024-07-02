import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    if (req.method == 'POST') {
        const { id, user2Id } = await req.json();
        const playarea = await prisma.playArea.findFirst({
            where: {
                OR: [
                    {
                        user2Id: id,
                        user1Id: user2Id
                    },
                    {
                        user2Id: user2Id,
                        user1Id: id
                    }]
            }, select: {
                user1: {
                    select: {
                        username: true
                    }
                },
                user2: {
                    select: {
                        username: true
                    }
                },
                user1Id: true,
                meetingDate: true,
                meetingTime: true,
                fixed: true
            }
        })
        return NextResponse.json(playarea)
    }
}