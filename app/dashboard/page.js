"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { BOOK_STATUSES } from "@/lib/constants";
import ConfirmDialog from "@/components/ConfirmDialog";
import StatCard from "@/components/StatCard";
import BookCard from "@/components/BookCard";
import Link from "next/link";

export default function DashboardPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    const fetchBooks = useCallback(async () => {
        setLoadingBooks(true);
        setError("");
        try {
            const data = await apiFetch("/api/books");
            setBooks(data.books);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingBooks(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    function requestDelete(id) {
        setDeleteTarget(id);
    }

    async function confirmDelete() {
        try {
            await apiFetch(`/api/books/${deleteTarget}`, { method: "DELETE" });
            setBooks((prev) => prev.filter((b) => b._id !== deleteTarget));
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleteTarget(null);
        }
    }

    async function handleStatusChange(id, newStatus) {
        try {
            const data = await apiFetch(`/api/books/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });
            setBooks((prev) =>
                prev.map((b) => (b._id === data.book._id ? data.book : b))
            );
        } catch (err) {
            setError(err.message);
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
                Loading...
            </div>
        );
    }

    const total = books.length;
    const countByStatus = (statusValue) =>
        books.filter((b) => b.status === statusValue).length;

    const recentBooks = books.slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-semibold text-gray-900">Dashboard</h1>
                        <p className="text-xs text-gray-500">Welcome back, {user.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/books"
                            className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            View all books
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm border-2 border-gray cursor-pointer py-1 px-3 rounded-3xl text-gray-500 hover:text-gray-900 transition"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {error && <p className="text-sm text-red-600">{error}</p>}

                {loadingBooks ? (
                    <p className="text-sm text-gray-400">Loading your dashboard...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard label="Total Books" value={total} emoji="📚" />
                            {BOOK_STATUSES.map((s) => (
                                <StatCard
                                    key={s.value}
                                    label={s.label}
                                    value={countByStatus(s.value)}
                                    emoji={s.emoji}
                                />
                            ))}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-900">Recent Books</h2>
                                {total > 6 && (
                                    <Link
                                        href="/books"
                                        className="text-sm text-gray-500 hover:text-gray-900 transition"
                                    >
                                        See all {total} →
                                    </Link>
                                )}
                            </div>

                            {total === 0 ? (
                                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                    <p className="text-sm text-gray-400 mb-4">
                                        You haven&apos;t added any books yet.
                                    </p>
                                    <Link
                                        href="/books"
                                        className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
                                    >
                                        Add your first book
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentBooks.map((book) => (
                                        <BookCard
                                            key={book._id}
                                            book={book}
                                            onEdit={() => router.push("/books")}
                                            onDelete={requestDelete}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Delete this book?"
                message="This will permanently remove the book from your collection."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}