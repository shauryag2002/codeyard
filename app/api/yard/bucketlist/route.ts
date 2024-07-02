import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db'
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }
    const { id } = await req.json()
    const userAccount = await prisma.user.findUnique({
        where: { id },
        select: {
            accounts: {
                select: {
                    merged: { select: { id: true, resume: true, image: true, name: true, username: true, bio: true } },
                    rejected: { select: { id: true, resume: true, image: true, name: true, username: true, bio: true } },
                    others: { select: { id: true, resume: true, image: true, name: true, username: true, bio: true } }
                }
            }
        }
    })
    return new NextResponse(
        JSON.stringify(userAccount)
    )
}
export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }
    const body = await req.json()
    if (body.sourceAction === "merged" && body.targetAction === "rejected") {
        const userAccount = await prisma.account.update({
            where: { userId: body.id },
            data: {
                merged: {
                    disconnect: {
                        id: body.swipeId

                    }
                },
                rejected: {
                    connect: {
                        id: body.swipeId
                    }
                }
            }
        })
        return new NextResponse(
            JSON.stringify(userAccount)
        )
    }
    else if (body.sourceAction === "merged" && body.targetAction === "trash") {
        const userAccount = await prisma.account.update({
            where: { userId: body.id },
            data: {
                merged: {
                    disconnect: {
                        id: body.swipeId
                    }
                }
            }
        })
        return new NextResponse(
            JSON.stringify(userAccount)
        )
    }
    if (body.sourceAction === "rejected" && body.targetAction === "merged") {
        const userAccount = await prisma.account.update({
            where: { userId: body.id },
            data: {
                rejected: {
                    disconnect: {
                        id: body.swipeId
                    }
                },
                merged: {
                    connect: {
                        id: body.swipeId
                    }
                }
            }
        })
        return new NextResponse(
            JSON.stringify(userAccount)
        )
    }
    else if (body.sourceAction === "rejected" && body.targetAction === "trash") {
        const userAccount = await prisma.account.update({
            where: { userId: body.id },
            data: {
                rejected: {
                    disconnect: {
                        id: body.swipeId
                    }
                }
            }
        })
        return new NextResponse(
            JSON.stringify(userAccount)
        )
    }
    return new NextResponse(
        JSON.stringify({ message: "swiped" })
    )
}
