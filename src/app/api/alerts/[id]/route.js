import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/alerts/[id] - mark single alert as read
export async function PATCH(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.alert.findFirst({
        where: { id: params.id, userId: session.user.id },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const alert = await prisma.alert.update({
        where: { id: params.id },
        data: { isRead: true },
    });

    return NextResponse.json(alert);
}

// DELETE /api/alerts/[id]
export async function DELETE(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.alert.findFirst({
        where: { id: params.id, userId: session.user.id },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.alert.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
