import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const { id, user2Id, content } = await req.json();

        let chat;
        chat = await prisma.account.findUnique({
            where: {
                userId: id,

            }, select: {
                merged: {
                    select: {
                        id: true
                    }
                }
            }
        })
        chat = chat?.merged.some((account: { id: string }) => account.id === user2Id)
        if (!chat) {
            chat = await prisma.account.findUnique({
                where: {
                    userId: id,

                }, select: {
                    rejected: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            chat = chat?.rejected.some((account: { id: string }) => account.id === user2Id)
        }

        if (!chat) {

            let otherUserTrue: any;
            otherUserTrue = await prisma.account.findUnique({
                where: {
                    userId: user2Id,
                }
                , select: {
                    merged: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            otherUserTrue = otherUserTrue?.merged.some((account: { id: true }) => account.id === id)
            if (!otherUserTrue) {
                otherUserTrue = await prisma.account.findUnique({
                    where: {
                        userId: user2Id
                    }, select: {
                        rejected: {
                            select: {
                                id: true
                            }
                        }
                    }
                })
                otherUserTrue = otherUserTrue?.rejected.some((account: { id: string }) => account.id === id)
            }
            if (!otherUserTrue) {
                const other = await prisma.account.update({
                    where: {
                        userId: user2Id
                    },
                    data: {
                        others: {
                            connect: {
                                id
                            }
                        }
                    }
                })
            }
            await prisma.account.update({
                where: {
                    userId: id
                },
                data: {
                    others: {
                        connect: {
                            id: user2Id
                        }
                    }
                }
            })
            const existingChat = await prisma.chat.findFirst({
                where: {
                    OR: [
                        { AND: [{ user1Id: id }, { user2Id: user2Id }] },
                        { AND: [{ user1Id: user2Id }, { user2Id: id }] }
                    ]
                }
            });
            if (!existingChat) {
                chat = await prisma.chat.create({
                    data: {

                        user1Id: id,
                        user2Id: user2Id
                    }, select: {
                        user2: {
                            select: {
                                username: true,
                            }
                        },
                        user1: {
                            select: {
                                username: true,
                            }
                        },
                        id: true,
                        messages: {
                            select: {
                                content: true,
                                user: {
                                    select: {
                                        username: true,
                                        image: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            else {
                chat = existingChat;

            }
        }

        const chat2 = await prisma.chat.findFirst({
            where: {
                OR: [{

                    user1Id: id, user2Id
                },
                {
                    user1Id: user2Id, user2Id: id
                }]
            },
            select: {
                id: true,
                user2: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                user1: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                messages: {
                    select: {
                        content: true,
                        user: {
                            select: {
                                username: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        if (content) {
            const message = await prisma.message.create({
                data: {
                    chatId: chat2?.id ?? "",
                    userId: id,
                    content,
                }
            });
        }
        return new NextResponse(
            JSON.stringify(chat2)
        );
    }
}