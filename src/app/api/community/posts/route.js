import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/community/posts - all posts (public but need auth to see)
export async function GET(req) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const posts = await prisma.communityPost.findMany({
        where: search
            ? {
                OR: [
                    { title: { contains: search } },
                    { body: { contains: search } },
                    { tags: { contains: search } },
                ],
            }
            : {},
        include: {
            user: {
                select: { name: true, state: true, farmerType: true },
            },
            comments: {
                orderBy: { createdAt: "asc" },
                take: 5,
            },
            _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    // Parse tags JSON
    const parsed = posts.map((p) => ({
        ...p,
        tags: JSON.parse(p.tags || "[]"),
        timeAgo: getTimeAgo(p.createdAt),
    }));

    return NextResponse.json(parsed);
}

// POST /api/community/posts - create a post
export async function POST(req) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, postBody, tags } = body;

    if (!title?.trim() || !postBody?.trim()) {
        return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
        data: {
            userId: session.user.id,
            title: title.trim(),
            body: postBody.trim(),
            tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        },
        include: {
            user: { select: { name: true, state: true, farmerType: true } },
        },
    });

    return NextResponse.json({ ...post, tags: JSON.parse(post.tags || "[]"), timeAgo: "just now" }, { status: 201 });
}

function getTimeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}
