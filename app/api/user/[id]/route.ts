import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../../lib/db';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    if (req.method === 'GET') {
        const { id } = params;
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        return new NextResponse(
            JSON.stringify(user)
        );
    }
}