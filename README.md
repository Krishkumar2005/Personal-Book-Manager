# Personal Book Manager

A full-stack MERN application (with Next.js powering the frontend) for tracking your
personal reading collection — log books, mark reading progress, and filter by tag or status.

## Live Demo
[Your deployed Vercel URL here]

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens), bcryptjs for password hashing

## Features
- Secure signup / login / logout with JWT authentication
- Add, edit, and delete books (title, author, tags, status)
- Filter books by reading status or tag
- Dashboard with total book count and status breakdown
- Every book is scoped to its owner — users can only see and manage their own collection
- Custom confirmation modal before deleting a book (click outside, cancel, or close button to dismiss)
- Frontend email validation (enforces a valid Gmail-style format before hitting the server)

## Project Structure

/app
/api
/auth
/signup - POST: create account
/login - POST: authenticate
/books
route.js - GET (list, with filters), POST (create)
/[id]
route.js - PATCH (update), DELETE (remove)
/dashboard - Summary view with stats
/books - Full collection view with filters
/login - Login page
/signup - Signup page
/components - Reusable UI components (BookCard, BookForm, FilterBar, StatCard, ConfirmDialog)
/context - AuthContext (client-side auth state)
/lib - DB connection, JWT helpers, API fetch wrapper, constants, email validation
/models - Mongoose schemas (User, Book)

## Getting Started Locally

1. Clone the repo:
```bash
   git clone [your-repo-url]
   cd [your-repo-name]
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables:
```bash
   cp .env.example .env.local
```
   Then fill in `.env.local` with:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string (generate with `openssl rand -base64 32`)

4. Run the development server:
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Design Decisions
- **Status stored as an enum** (`want-to-read`, `reading`, `completed`) at the schema level,
  with display labels/emojis mapped separately in the UI layer — keeps the database clean
  and the presentation flexible.
- **Ownership enforced server-side**, not just in the UI — every book query and mutation is
  scoped by the authenticated user's ID from their JWT, never trusting a client-supplied ID.
- **JWT stored in localStorage** for simplicity at this project's scale; a production app
  handling more sensitive data would consider httpOnly cookies instead.
- **Custom confirmation dialog instead of the browser's native `window.confirm`** — allows
  consistent styling (red/black buttons, blur backdrop) and better UX (click-outside-to-close,
  explicit close button) matching the rest of the app's design.

## Author
[KRISH KUMAR]