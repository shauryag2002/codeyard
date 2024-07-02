import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    function parseJSON(input: string | null | undefined) {
        try {
            if (!input) {
                throw new Error('Input is empty or undefined');
            }
            return JSON.parse(input);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
        }
    }
    const { session } = await req.json();
    if (!session) {
        return NextResponse.json({
            message: 'You are not authenticated'
        })
    }
    const playarea = await prisma.playArea.findMany({
        where: {
            OR: [
                {
                    user1Id: session?.user.id,
                    fixed: true
                },
                {
                    user2Id: session?.user.id,
                    fixed: true
                }
            ]
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
            user2Id: true,
            meetingDate: true,
            meetingTime: true,
            id: true
        }
    })
    return NextResponse.json(playarea)
}