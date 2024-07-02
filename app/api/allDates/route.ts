import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function PUT(req: NextRequest) {
    if (req.method == 'PUT') {
        const { id, user2Id, fixed } = await req.json();
        const playarea = await prisma.playArea.findFirst({
            where: {
                user1Id: user2Id,
                user2Id: id
            }, select: {
                id: true
            }
        })
        if (!playarea) {
            return NextResponse.json({
                message:
                    'No such request found'
            })
        }
        if (fixed === false) {
            await prisma.playArea.delete({
                where: {
                    id: playarea.id
                }
            })
            return NextResponse.json({
                message:
                    'coding date rejected'
            })
        }
        const fixedDate = await prisma.playArea.update({
            where: {
                id: playarea?.id
            },
            data: {
                fixed: fixed,
            }, select: {
                user2: {
                    select: {
                        username: true
                    }
                },
                meetingDate: true,
                meetingTime: true
            }
        })
        if (fixed) {
            return NextResponse.json({
                message:
                    'coding date fixed with ' + fixedDate.user2.username + ' on ' + fixedDate.meetingDate + ' at ' + fixedDate.meetingTime
            })
        }
        else {
            return NextResponse.json({
                message:
                    'coding date rejected with ' + fixedDate.user2.username + ' on ' + fixedDate.meetingDate + ' at ' + fixedDate.meetingTime
            })
        }
    }
}
export async function POST(req: NextRequest) {
    if (req.method == 'POST') {
        const { id } = await req.json();
        const fixedDate = await prisma.playArea.findMany({
            where: {
                user2Id: id,
                fixed: false
            }, select: {
                user1: {
                    select: {
                        username: true
                    }
                },
                user1Id: true,
                meetingDate: true,
                meetingTime: true
            }
        })
        return NextResponse.json(fixedDate)
    }
}