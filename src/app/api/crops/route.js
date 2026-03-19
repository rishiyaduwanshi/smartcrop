import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/crops - get logged-in user's crops
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const crops = await prisma.crop.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(crops);
}

// POST /api/crops - add a new crop
export async function POST(req) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, stage, health, area, sowingDate, expectedHarvest, waterRequired, notes } = body;

    if (!name || !stage || !area || !sowingDate || !expectedHarvest) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const today = new Date();
    const harvest = new Date(expectedHarvest);
    const daysToHarvest = Math.max(0, Math.round((harvest - today) / (1000 * 60 * 60 * 24)));

    const crop = await prisma.crop.create({
        data: {
            userId: session.user.id,
            name,
            stage: stage || "Seedling",
            health: health ? Number(health) : 75,
            area,
            sowingDate,
            expectedHarvest,
            waterRequired: waterRequired || "Medium",
            notes: notes || null,
            lastAction: "Crop added",
            daysToHarvest,
        },
    });

    return NextResponse.json(crop, { status: 201 });
}
