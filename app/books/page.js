"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import BookForm from "@/components/BookForm";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function BooksPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
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
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            if (tagFilter) params.set("tag", tagFilter);

            const data = await apiFetch(`/api/books?${params.toString()}`);
            setBooks(data.books);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingBooks(false);
        }
    }, [statusFilter, tagFilter]);

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    async function handleAddBook(formData) {
        const data = await apiFetch("/api/books", {
            method: "POST",
            body: JSON.stringify(formData),
        });
        setBooks((prev) => [data.book, ...prev]);
        setShowAddForm(false);
    }

    async function handleEditBook(formData) {
        const data = await apiFetch(`/api/books/${editingBook._id}`, {
            method: "PATCH",
            body: JSON.stringify(formData),
        });
        setBooks((prev) =>
            prev.map((b) => (b._id === data.book._id ? data.book : b))
        );
        setEditingBook(null);
    }


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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-semibold text-gray-900">
                            Your Books
                        </h1>
                        <p className="text-xs text-gray-500">{user.name}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm border-2 border-gray cursor-pointer py-1 px-3 rounded-3xl text-gray-500 hover:text-gray-900 transition"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <FilterBar
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        tagFilter={tagFilter}
                        onTagFilterChange={setTagFilter}
                    />
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
                    >
                        + Add book
                    </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {loadingBooks ? (
                    <p className="text-sm text-gray-400">Loading books...</p>
                ) : books.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        No books yet. Add your first one to get started.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                book={book}
                                onEdit={setEditingBook}
                                onDelete={requestDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showAddForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="font-semibold text-gray-900 mb-4">Add a book</h2>
                        <BookForm
                            onSubmit={handleAddBook}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}

            {editingBook && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="font-semibold text-gray-900 mb-4">Edit book</h2>
                        <BookForm
                            initialData={editingBook}
                            onSubmit={handleEditBook}
                            onCancel={() => setEditingBook(null)}
                        />
                    </div>
                </div>
            )}

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