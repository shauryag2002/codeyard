import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    const { id } = await req.json();
    const playarea = await prisma.playArea.findFirst({
        where: {
            id: id
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
            fixed: true,
            user1Id: true,
            meetingDate: true,
            meetingTime: true
        }
    })
    if (!playarea) {
        return NextResponse.json({ playarea: false, message: 'No such request found' })
    }
    return NextResponse.json({ message: playarea })
}