# ICT Service Request Management System

A web-based CRUD system for logging and tracking ICT service requests, built with
plain HTML/CSS/JavaScript and a Supabase (PostgreSQL + Auth) backend, deployed on
GitHub Pages.

**Course:** Systems Analysis and Design (SAD) — Laboratory Exercise 3

---

## Student Information
- **Student:** _[Your Name]_
- **Section:** _[Your Section]_
- **GitHub Repository:** _[paste repo URL]_
- **Live System:** _[paste GitHub Pages URL]_
- **Test Account:** _submitted separately via LMS, not placed here_

---

## Features
- Login / Logout with Supabase Auth (session-protected dashboard)
- Dashboard: Total, Pending, In Progress, Completed counts
- Create / Read / Update / Delete service requests
- Search by requester name or description
- Filter by status and priority
- Row Level Security: users can view all requests but only modify their own
- Bonus: Request Analytics by category and priority (data-driven, not hard-coded)

---

## Tech Stack
| Layer      | Technology                          |
|------------|--------------------------------------|
| Front End  | HTML, CSS, JavaScript               |
| Backend    | Supabase (PostgreSQL + Auth + RLS)  |
| Hosting    | GitHub Pages                        |

---

## Project Structure
```
sad-service-request/
├── index.html               # Dashboard + CRUD table (protected page)
├── login.html                # Login page
├── css/
│   └── style.css
├── js/
│   ├── supabase.js           # Supabase client init
│   ├── auth.js               # Login/logout/session guard
│   └── app.js                # CRUD, search, filter, dashboard, analytics
├── documentation/
│   ├── system-analysis.md    # Problem statement, actors, use cases, ERD, traceability
│   └── setup.sql             # Table creation + RLS policies
└── README.md
```

---

## Setup Instructions

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a new project, and note your
**Project URL** and **anon/publishable key** (Project Settings → API).

### 2. Run the database setup
Open the Supabase **SQL Editor** and run everything in
`documentation/setup.sql`. This creates the `service_requests` table, enables
Row Level Security, and adds the required policies.

### 3. Create a test account
In Supabase, go to **Authentication → Users → Add User**, and create at least
one test account (email + password) to log in with.

### 4. Configure the front end
Edit `js/supabase.js` and replace the placeholders:
```js
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_KEY = "YOUR-PUBLISHABLE-ANON-KEY";
```
**Never** put the `service_role` key here — only the public anon/publishable key.

### 5. Run locally (optional, before deploying)
Since the app uses only static files, you can open `login.html` directly in a
browser, or serve the folder with any static server, e.g.:
```
npx serve .
```

### 6. Push to GitHub
```
git init
git add .
git commit -m "Initial project structure"
git branch -M main
git remote add origin https://github.com/USERNAME/SAD-ServiceRequest-Lastname.git
git push -u origin main
```
Make at least four meaningful commits as you build (see suggested commit
history below).

### 7. Deploy with GitHub Pages
In the repository: **Settings → Pages → Build and deployment → Deploy from a
branch → Branch: main, Folder: /(root)**. Your site will be published at:
```
https://USERNAME.github.io/SAD-ServiceRequest-Lastname/
```

---

## Suggested Commit History
1. `Initial project structure`
2. `Add Supabase database integration`
3. `Implement CRUD operations`
4. `Add search filtering and deployment`

---

## Use Case Diagram, ERD, and Traceability
See `documentation/system-analysis.md` for the problem statement, actor
identification, use case diagram, ERD, business-rule mapping, and requirements
traceability matrix.

## Screenshots
_[Insert screenshots of the login page, dashboard, request table, create/edit
modal, and delete confirmation before submission.]_

## Test Results
_[Paste the completed functional test-case table from
`documentation/system-analysis.md`, with PASS/FAIL filled in, before
submission.]_
