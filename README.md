HOSTEL-PARCEL-MANAGEMENT-SYSTEM

TEAM NAME: VOID
TEAM MEMBERS:
   - Member 1: Ardrakrishna U N -RIT KOTTAYAM
   - Member 2: Shivani T - RIT KOTTAYAM

Hosted Project Link:
 https://ardra16.github.io/Hostel-parcel_management/

Project Description:

 Hostel Parcel Management System is a digital platform designed to efficiently manage parcel deliveries within a college hostel.
It allows hostel matron to register incoming parcels, generate secure pickup codes, and notify students. Students can log in using their phone number and password to view parcel details and collect parcels securely using a verification code.

THE PROBLEM STATEMENT

In many hostels:
 * Parcel entries are maintained manually in registers
 * Parcels get misplaced or delayed
 * No proper notification system
 * Unauthorized parcel collection may happen
 * Difficult to track parcel status
This creates confusion, delays, and security issues.

THE SOLUTION

The Hostel Parcel Management System provides:

📲 Student login using phone number + password
📦 Parcel entry system for hostel staff
🔐 Secure pickup code generation
📢 Parcel notification system
📊 Admin dashboard for tracking parcels
This ensures secure, organized, and efficient parcel management.

TECHNOLOGIES/COMPONENTS USED

FOR SOFTWARE:
 Languages Used

  * TypeScript
  * JavaScript
  * SQL
Frameworks Used

  * Next.js (React framework)
Libraries Used

  * @supabase/supabase-js
  * React Hooks
Tools Used

  * VS Code
  * Git & GitHub
  * Supabase Dashboard


FEATURES

Feature 1: Secure Student & Matron Login
Feature 2: Parcel Entry System (Matron Dashboard)
Feature 3: Student Dashboard to View Pending Parcels
Feature 4: Secure Parcel Collection using Security PIN
Feature 5: Role-based Access (Student / Matron)
Feature 6: Supabase Cloud Database Integration

IMPLEMENTATION

For software:

 Installation

   bash
   npm install

   Install Supabase client:

   bash
   npm install @supabase/supabase-js

 Run

   bash
   npm run dev

PROJECT DOCUMENTATION

Screenshots

Screenshot1 :Login page
![WhatsApp Image 2026-02-14 at 8 18 13 AM](https://github.com/user-attachments/assets/db9084b4-21d0-43a1-8b07-30b4f6ca02c9)

Screenshot2:Matron page
![WhatsApp Image 2026-02-14 at 8 19 03 AM](https://github.com/user-attachments/assets/7014c53c-af89-4b19-9a33-c82d1511ba94)


screenshot3:student parcel view
![WhatsApp Image 2026-02-14 at 8 20 38 AM](https://github.com/user-attachments/assets/a86cc4d2-5673-4998-b4f1-9fd684f9c906)



SYSTEM ARCHITECTURE

### Architecture Overview

Frontend (Next.js)
⬇
Supabase Client
⬇
Supabase PostgreSQL Database

### Explanation

* Frontend communicates directly with Supabase
* Supabase handles database operations
* No separate backend server required
* Role-based logic handled in frontend

  APPLICATION WORKFLOW

Staff receives parcel

Staff enters parcel details

System generates secure pickup code

Student logs in using phone number

Student collects parcel with verification

Status updated to “Collected"

API Documentation
Base URL:https://tkvkriyffxdnqpeqceql

AI TOOLS USED(Transparency Section)

Tool Used: ChatGPT

Purpose:

* Supabase integration guidance
* Debugging frontend-backend connection
* SQL schema design
* Authentication logic

Percentage of AI-generated code: ~25%

Human Contributions:

* Project idea design
* Database schema modification
* UI design and customization
* Full integration and testing
* Deployment





