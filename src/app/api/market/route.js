import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/market - get all market prices
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prices = await prisma.marketPrice.findMany({
        orderBy: { cropName: "asc" },
    });

    const enriched = prices.map((p) => {
        const change = p.modalPrice - p.prevPrice;
        return {
            ...p,
            change,
            changePct: ((change / p.prevPrice) * 100).toFixed(2),
            trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
        };
    });

    return NextResponse.json(enriched);
}
