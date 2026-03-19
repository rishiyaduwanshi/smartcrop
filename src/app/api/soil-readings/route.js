import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/soil-readings - latest readings for logged-in user
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get latest reading per location (raw query to get latest per sensorId)
    const readings = await prisma.soilReading.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        distinct: ["sensorId"],
        take: 4,
    });

    return NextResponse.json(readings);
}

// POST /api/soil-readings - log a new reading
export async function POST(req) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const reading = await prisma.soilReading.create({
        data: {
            userId: session.user.id,
            cropId: body.cropId || null,
            sensorId: body.sensorId,
            location: body.location,
            moisture: Number(body.moisture),
            temperature: Number(body.temperature),
            ph: Number(body.ph),
            nitrogen: Number(body.nitrogen),
            phosphorus: Number(body.phosphorus),
            potassium: Number(body.potassium),
            ec: Number(body.ec),
            battery: Number(body.battery),
            signal: body.signal || "Moderate",
            depth: body.depth || "0–15 cm",
            trend: body.trend || "stable",
        },
    });

    return NextResponse.json(reading, { status: 201 });
}
