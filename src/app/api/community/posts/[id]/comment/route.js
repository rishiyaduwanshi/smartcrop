import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/community/posts/[id]/comment - add a comment
export async function POST(req, { params }) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.comment?.trim()) {
        return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, farmerType: true },
    });

    const comment = await prisma.communityComment.create({
        data: {
            postId: params.id,
            authorName: user.name,
            authorRole: user.farmerType || "Farmer",
            body: body.comment.trim(),
            isExpert: user.farmerType?.includes("Expert") || user.farmerType?.includes("Officer"),
        },
    });

    // Increment views
    await prisma.communityPost.update({
        where: { id: params.id },
        data: { views: { increment: 1 } },
    });

    return NextResponse.json(comment, { status: 201 });
}
