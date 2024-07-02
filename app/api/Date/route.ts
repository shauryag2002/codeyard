import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    if (req.method == 'POST') {
        const { id, user2Id, date, time } = await req.json();

        if (date) {
            const checkDate = await prisma.playArea.findFirst({
                where: {
                    OR: [{

                        user1Id: id,
                        user2Id: user2Id,
                    },
                    {
                        user1Id: user2Id,
                        user2Id: id
                    }],
                },
                select: {
                    fixed: true,
                    user1: {
                        select: {
                            username: true
                        }
                    },
                    meetingDate: true,
                    meetingTime: true
                }
            })
            if (checkDate && !checkDate.fixed) {
                return NextResponse.json({
                    message: 'coding date already requested with ' + checkDate.user1.username + ' on ' + checkDate.meetingDate + ' at ' + checkDate.meetingTime,
                    fixed: false
                })
            }
            else if (checkDate && checkDate.fixed) {
                return NextResponse.json({
                    message: 'coding date already fixed with ' + checkDate.user1.username + ' on ' + checkDate.meetingDate + ' at ' + checkDate.meetingTime,
                    fixed: true
                })
            }
            const fixedDate = await prisma.playArea.create({
                data: {
                    user1: {
                        connect: {
                            id
                        }
                    },
                    user2: {
                        connect: {
                            id: user2Id
                        }
                    },
                    fixed: false,
                    meetingDate: new Date(date),
                    meetingTime: time
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
            return NextResponse.json({
                message:
                    'request sent to ' + fixedDate.user2.username + ' for coding date on ' + fixedDate.meetingDate + ' at ' + fixedDate.meetingTime
            })
        }
    }
}