import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db'
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
                    merged: { select: { id: true } },
                    rejected: { select: { id: true } }
                }
            }
        }
    })
    const mergedUserIds = userAccount?.accounts?.map((account: {
        merged: {
            id: string;
        }[];
    }) => account.merged).flat().map((user: { id: string; }) => user.id) ?? [];
    const rejectedUserIds = userAccount?.accounts?.map((account: {
        rejected: {
            id: string;
        }[];
    }) => account.rejected).flat().map((user: { id: string; }) => user.id) ?? [];
    const users = await prisma.user.findMany({
        select: {
            resume: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            id: true
        },
        where: {
            id: {
                notIn: [id, ...mergedUserIds, ...rejectedUserIds]
            }
        }
    })
    return new NextResponse(
        JSON.stringify(users)
    )
}
export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }
    const body = await req.json()
    const userAccount = await prisma.user.findUnique({
        where: { id: body.id },
        select: {
            accounts: {
                select: {
                    merged: { select: { id: true } },
                    rejected: { select: { id: true } }
                }
            }
        }
    })
    const mergedUserIds = userAccount?.accounts?.map((account: {
        merged: {
            id: string;
        }[];
    }) => account.merged).flat().map((user: { id: string }) => user.id) ?? [];
    const rejectedUserIds = userAccount?.accounts?.map((account: {
        rejected: {
            id: string;
        }[];
    }) => account.rejected).flat().map((user: { id: string }) => user.id) ?? [];
    if (body.location) {

        const filterUsers = await prisma.user.findMany({
            where: {
                location: body.location,
                gender: body.gender,
                id: {
                    notIn: [body.id, ...mergedUserIds, ...rejectedUserIds]
                }
            },
            select: {
                resume: true,
                name: true,
                username: true,
                image: true,
                bio: true,
                id: true
            }
        })
        return new NextResponse(
            JSON.stringify(filterUsers)
        )
    }
    if (body.YOE) {
        const filterUsers = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [body.id, ...mergedUserIds, ...rejectedUserIds]
                }
                ,
                YOE: {
                    gte: body.YOE
                },
                gender: body.gender
            },
            select: {
                resume: true,
                name: true,
                username: true,
                image: true,
                bio: true,
                id: true
            }
        })
        return new NextResponse(
            JSON.stringify(filterUsers)
        )
    }
    if (body.age) {
        const filterUsers = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [body.id, ...mergedUserIds, ...rejectedUserIds]
                }
                , age: {
                    gte: body.age
                },
                gender: body.gender
            },
            select: {
                resume: true,
                name: true,
                username: true,
                image: true,
                bio: true,
                id: true
            }
        })
        return new NextResponse(
            JSON.stringify(filterUsers)
        )
    }
    return new NextResponse(
        JSON.stringify({ error: 'Invalid request' })
    )
}
