import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }
    const { id, swipeId, swipeAction }: {
        id: string,
        swipeId: string,
        swipeAction: string

    } = await req.json()
    const swipedUser = await prisma.account.findUnique({
        where: {
            userId: swipeId
        },
        select: {
            rejected: {
                select: {
                    id: true
                }
            },
            others: {
                select: {
                    id: true
                }
            },
            merged: {
                select: {
                    id: true
                }
            }
        }
    })
    const accountExists = swipedUser?.merged.some((account: { id: string; }) => account.id === id) ||
        swipedUser?.rejected.some((account: { id: string; }) => account.id === id) ||
        swipedUser?.others.some((account: { id: string; }) => account.id === id);
    let match = false
    if (swipeAction === "merged") {
        const user = await prisma.account.update({
            where: {
                userId: id
            },
            data: {
                merged: {
                    connect: {
                        id: swipeId
                    }
                },
                others: {
                    disconnect: {
                        id: swipeId
                    }
                }
            }
        })
        const otherUser = await prisma.account.findFirst({
            where: {
                userId: swipeId,
                merged: {
                    some: {
                        id: id
                    }
                }
            }
        })
        if (otherUser) {
            match = true
        }
        if (!accountExists) {
            const other = await prisma.account.update({
                where: {
                    userId: swipeId
                },
                data: {
                    others: {
                        connect: {
                            id: id
                        }

                    }
                }
            })
        }
    }
    if (swipeAction === "rejected") {
        const user = await prisma.account.update({
            where: {
                userId: id
            },
            data: {
                rejected: {
                    connect: {
                        id: swipeId
                    }
                },
                others: {
                    disconnect: {
                        id: swipeId
                    }
                }
            }
        })
        if (!accountExists) {
            const other = await prisma.account.update({
                where: {
                    userId: swipeId
                },
                data: {
                    others: {
                        connect: {
                            id: id
                        }

                    }
                }
            })
        }
    }
    const otherUser2 = await prisma.user.findFirst({
        where: {
            id: swipeId
        }, select: {
            username: true,
            id: true
        }
    })
    return new NextResponse(
        JSON.stringify({ message: "swiped", username: otherUser2?.username, id: otherUser2?.id, match })
    )
}