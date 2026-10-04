# Academix

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/academix/
Reviewed: 2026-10-04

A SaaS workspace for tuition centres and private institutes combining student CRM, classes, attendance, assessments, fee collection, communications, reporting and multi-site institute operations.

## Users and purpose

Tuition centres, academies and private-institute staff.

Student, academic and fee operations in a role-aware workspace.

## Capabilities

- Student CRM, enrollments, teacher and class records.
- Manual, bulk and barcode attendance plus assessments.
- Fees, LKR receipts, reporting and institute records.
- Communication workflows with email/SMS integration points.

## Workflow

1. Staff register students and enroll them into classes.
2. Authenticated application routes record attendance, grades and fee activity.
3. Mongoose models store operational records in MongoDB.
4. Dashboards and reports summarize the workspace; communication providers are configured separately.

## Architecture

Next.js → MongoDB / Mongoose → notification integrations

- Next.js: Student, academic, fee, communication and reporting workspaces.
- Auth + API routes: Cookie-based JWT sessions and role-aware domain requests.
- MongoDB + Mongoose: Student, class, attendance, assessment and fee records.
- Messaging integrations: Configured email/SMS providers; integration availability varies by deployment.

## Current scope

The account and plan surfaces support a SaaS direction. Automated billing and broader tenant-isolation work should be checked against the current project roadmap rather than assumed complete.

Source: https://github.com/savisaluwadana/student-management-system-saas/blob/main/README.md
