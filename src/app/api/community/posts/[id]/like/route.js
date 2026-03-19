import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/community/posts/[id]/like - upvote a post
export async function POST(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.communityPost.update({
        where: { id: params.id },
        data: { upvotes: { increment: 1 } },
        select: { id: true, upvotes: true },
    });

    return NextResponse.json(post);
}
