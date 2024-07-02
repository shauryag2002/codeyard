import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../lib/db';

export async function DELETE(req: NextRequest) {
    if (req.method === 'DELETE') {
        const nowPlusTwoHours = new Date();
        const playAreas = await prisma.playArea.findMany();

        const toDeleteIds = playAreas
            .filter((playArea: typeof playAreas[number]) => {
                if (playArea.meetingDate && playArea.meetingTime) {
                    const [hours, minutes] = playArea.meetingTime.split(':').map(Number);
                    const meetingDateTime = new Date(playArea.meetingDate);
                    meetingDateTime.setHours(hours + 2);
                    meetingDateTime.setMinutes(minutes);

                    return nowPlusTwoHours > meetingDateTime;
                }
                return false;
            })
            .map((playArea: typeof playAreas[number]) => playArea.id);

        const notify = await prisma.playArea.deleteMany({
            where: {
                id: {
                    in: toDeleteIds
                }
            },
        });

        return NextResponse.json("proceed");
    }
}