import connectDB from "@/lib/db";
import Book from "@/models/Book";
import { getAuthUser } from "@/lib/getAuthUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");

    const query = { userId: auth.userId };

    if (status) {
      query.status = status;
    }

    if (tag) {
      query.tags = tag;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Fetch books error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, author, tags, status } = await request.json();

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const book = await Book.create({
      userId: auth.userId,
      title,
      author,
      tags: tags || [],
      status: status || "want-to-read",
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}