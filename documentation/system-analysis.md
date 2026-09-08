# System Analysis and Design Documentation
## ICT Service Request Management System

---

## 1. Problem Statement

The university's ICT office receives technical support concerns through inconsistent
channels — verbal reports, text messages, and social media — with no central record.
As a result, requests are frequently forgotten, duplicated, or left untracked, and
staff have no way to see how many issues are pending, in progress, or resolved. This
project addresses the gap with a centralized, web-based system where authorized users
can log, monitor, search, and update ICT service requests, giving the office a single
source of truth and basic visibility into workload through a summary dashboard.

*(Word count: 98)*

---

## 2. Actors

**Primary Actor:** System User / ICT Personnel
- Logs in to the system
- Creates, views, searches, and filters service requests
- Updates or deletes requests they created
- Views dashboard summaries

---

## 3. Use Case Diagram

```
        ┌───────────────────────────┐
        │  ICT Service Request System │
        │                             │
User ──►│ Login                       │
User ──►│ View Dashboard              │
User ──►│ Create Request              │
User ──►│ View Requests               │
User ──►│ Search Request              │
User ──►│ Filter Requests             │
User ──►│ Update Request               │
User ──►│ Delete Request               │
User ──►│ Logout                      │
        └───────────────────────────┘
```

(Recreate this in Draw.io / Lucidchart / Mermaid and paste an image/link here
before submission.)

---

## 4. Entity Relationship Diagram (ERD)

```
USER
----------------
user_id (PK)
email
      │
      │ 1
      │ creates
      │ M
      ▼
SERVICE_REQUEST
----------------
id (PK)
requester_name
department
category
description
priority
status
created_at
user_id (FK -> USER.user_id)
```

**Relationship:** One USER can create MANY SERVICE_REQUEST records (1:M).
`auth.users` (managed by Supabase Auth) is the USER entity; `service_requests`
is the SERVICE_REQUEST entity, linked via the `user_id` foreign key.

---

## 5. Business Rules Implemented

| Rule  | Requirement                                       | Where enforced |
|-------|----------------------------------------------------|----------------|
| BR-01 | Requester name cannot be empty                     | `validateForm()` in app.js |
| BR-02 | Department must be provided                        | `validateForm()` in app.js |
| BR-03 | Category must be selected                          | `validateForm()` in app.js (dropdown, always has a value) |
| BR-04 | Description must contain sufficient information    | `validateForm()` in app.js (min length check) |
| BR-05 | Priority must be Low, Medium, or High              | `validateForm()` in app.js + HTML `<select>` |
| BR-06 | New requests automatically receive Pending status  | `handleFormSubmit()` sets `status: "Pending"` on insert |
| BR-07 | Users must log in before managing requests         | `requireSession()` in auth.js, RLS policies |
| BR-08 | Confirmation required before deleting              | Delete confirmation modal in index.html |
| BR-09 | Date requested automatically recorded              | `created_at TIMESTAMPTZ DEFAULT NOW()` in DB schema |
| BR-10 | Unauthorized database modification prevented       | Supabase Row Level Security (RLS) policies |

---

## 6. Requirements Traceability Matrix

| Req. ID | Requirement                     | System Feature      | Test  |
|---------|----------------------------------|----------------------|-------|
| FR-01   | User can log in                  | Login Page           | TC-01 |
| FR-02   | User can create request          | Request Form         | TC-02 |
| FR-03   | User can view requests           | Request Table        | TC-03 |
| FR-04   | User can update request          | Edit Function         | TC-04 |
| FR-05   | User can delete request          | Delete Function       | TC-05 |
| FR-06   | User can search                  | Search Function       | TC-06 |
| FR-07   | User can filter                  | Filter Function       | TC-07 |
| FR-08   | System displays summaries        | Dashboard             | TC-08 |

---

## 7. Functional Test Cases

| Test ID | Test Scenario                | Expected Result                              | Result (fill in) |
|---------|-------------------------------|-----------------------------------------------|-------------------|
| TC-01   | Login using valid account     | Dashboard appears                             |                   |
| TC-02   | Submit valid request          | Request saved                                 |                   |
| TC-03   | Display requests              | Existing records appear                       |                   |
| TC-04   | Modify request                | Changes saved                                 |                   |
| TC-05   | Delete request                | Confirmation appears and record is removed    |                   |
| TC-06   | Search requester               | Matching records displayed                    |                   |
| TC-07   | Filter Pending requests        | Only Pending records displayed                |                   |
| TC-08   | Open deployed URL              | Application loads online                      |                   |

Record **PASS** or **FAIL** for each row once tested against your live deployment,
then paste this table (with results filled in) into the README before submission.
