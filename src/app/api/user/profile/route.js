import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/profile
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            village: true,
            district: true,
            state: true,
            soilType: true,
            irrigationType: true,
            landHolding: true,
            farmerType: true,
            role: true,
            createdAt: true,
            _count: { select: { crops: true, posts: true } },
        },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
}

// PATCH /api/user/profile - update profile
export async function PATCH(req) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const allowed = ["name", "phone", "village", "district", "state", "soilType", "irrigationType", "landHolding", "farmerType"];
    const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data,
        select: { id: true, name: true, email: true, phone: true, village: true, district: true, state: true, soilType: true, irrigationType: true, landHolding: true, farmerType: true },
    });

    return NextResponse.json(user);
}
