import connectDB from "@/lib/db";
import Book from "@/models/Book";
import { getAuthUser } from "@/lib/getAuthUser";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    await connectDB();

    const book = await Book.findOne({ _id: id, userId: auth.userId });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const allowedFields = ["title", "author", "tags", "status"];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        book[field] = updates[field];
      }
    }

    await book.save();

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const result = await Book.findOneAndDelete({
      _id: id,
      userId: auth.userId,
    });

    if (!result) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}