import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/crops/[id] - single crop
export async function GET(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const crop = await prisma.crop.findFirst({
        where: { id: params.id, userId: session.user.id },
    });

    if (!crop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(crop);
}

// PATCH /api/crops/[id] - update crop
export async function PATCH(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const allowed = ["stage", "health", "area", "sowingDate", "expectedHarvest", "waterRequired", "lastAction", "notes", "daysToHarvest"];
    const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

    if (data.health) data.health = Number(data.health);

    const existing = await prisma.crop.findFirst({ where: { id: params.id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const crop = await prisma.crop.update({ where: { id: params.id }, data });
    return NextResponse.json(crop);
}

// DELETE /api/crops/[id] - delete crop
export async function DELETE(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.crop.findFirst({ where: { id: params.id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.crop.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
