# ICT Service Request Management System

## Laboratory Exercise 3
### Online Service Request Management System Using GitHub and Supabase

---

## 1. System Description

The **ICT Service Request Management System** is a web-based system that allows users to submit and manage ICT service requests.

Users can submit requests for different ICT concerns such as:

- Computer repair
- Software installation
- Internet or network problems
- Printer problems
- Account or access concerns
- Other ICT concerns

The system allows users to create, view, search, update, and delete their service requests.

The system uses **HTML, CSS, and JavaScript** for the frontend, **Supabase PostgreSQL** for the database, and **Supabase Authentication** for user login and access control. The system is deployed using **GitHub Pages**.

---

## 2. Problem Statement

ICT service requests can be difficult to manage when they are recorded manually or through different communication channels.

This system was developed to provide a simple online way for users to submit and monitor their ICT service requests.

The system helps organize service requests and allows users to:

- Submit a new service request
- View submitted requests
- Search for requests
- Filter requests by status and priority
- Update their requests
- Delete their requests
- Monitor the status of their requests

---

## 3. Objectives

The main objectives of the system are:

- To create an online ICT service request system.
- To allow authenticated users to submit service requests.
- To provide CRUD operations for service requests.
- To allow users to search and filter requests.
- To provide a dashboard showing request information.
- To protect user data using Supabase Authentication and Row Level Security.
- To deploy the system online using GitHub Pages.

---

## 4. Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend and Database
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Development Tools
- Visual Studio Code
- Git
- GitHub

### Deployment
- GitHub Pages
- https://frich10.github.io/SAD-ServiceRequest-Ebon/login.html
---

## 5. System Features

### User Authentication
- User login
- User logout
- User session management
- Users must be logged in before managing requests

### Dashboard
The dashboard displays:

- Total requests
- Pending requests
- In Progress requests
- Completed requests

### Service Request Management
Users can:

- Create a service request
- View service requests
- Update a service request
- Delete a service request

### Search
The search function can search using:

- Requester name
- Description
- Priority
- Status

### Filters
Users can filter requests by:

- Status
- Priority

---

## 6. Service Request Information

Each service request contains the following information:

| Field | Description |
|---|---|
| ID | Unique request ID |
| Requester Name | Name of the person requesting service |
| Department | Department of the requester |
| Category | Type of ICT concern |
| Description | Details of the problem |
| Priority | Low, Medium, or High |
| Status | Pending, In Progress, or Completed |
| Created At | Date and time the request was created |
| User ID | ID of the authenticated user |

---

## 7. Business Rules

The system follows these rules:

1. The requester name must not be empty.
2. The department must be provided.
3. A service category must be selected.
4. The description must provide enough information about the problem.
5. Priority must be Low, Medium, or High.
6. New requests have a default status of Pending.
7. Users must log in before managing requests.
8. The system asks for confirmation before deleting a request.
9. The date and time are automatically recorded.
10. Unauthorized database modifications are prevented using Row Level Security.

---

## 8. Database

The system uses a Supabase PostgreSQL database.

### Table: `service_requests`

The main table contains:

- `id`
- `requester_name`
- `department`
- `category`
- `description`
- `priority`
- `status`
- `created_at`
- `user_id`

### Row Level Security

Row Level Security (RLS) is enabled for the `service_requests` table.

Authenticated users can:

- View service requests
- Insert their own requests
- Update their own requests
- Delete their own requests

The `user_id` is used to identify the authenticated user who created the request.

---

## 9. System Architecture

The system follows a simple web-based architecture:

```text
User
  |
  v
GitHub Pages
  |
  v
HTML / CSS / JavaScript
  |
  v
Supabase JavaScript Client
  |
  +----------------------+
  |                      |
  v                      v
Supabase Auth      PostgreSQL Database
                       |
                       v
                service_requests