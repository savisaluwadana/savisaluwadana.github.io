# MediCare

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/medicare/
Reviewed: 2026-10-04

A patient and clinic-management system covering patient administration, appointments, clinical records, billing, staff permissions and an embeddable scheduling service.

## Users and purpose

Clinic staff, doctors, billing operators, administrators and patients.

Patient administration, appointments, clinical records and billing.

## Capabilities

- Patient profiles and conflict-aware appointment scheduling.
- Clinical records with SOAP notes, vitals and prescriptions.
- Billing records, payment tracking and operational dashboards.
- Staff management and a separate embeddable scheduling API.

## Workflow

1. Clinic staff register a patient or arrange an appointment.
2. The Go API validates identity, role permissions and domain requests.
3. PostgreSQL stores patient, appointment, clinical and billing state.
4. A separate scheduling service supports website embeds within its intended scheduling boundary.

## Architecture

Next.js → Go API + scheduling service → PostgreSQL

- Next.js: Patient, appointment, clinical, billing and admin interfaces.
- Go domain API: JWT sessions, role checks and clinic workflows.
- Scheduling API: Separate service boundary for embeddable appointments.
- PostgreSQL: Patient and operational records persisted by the backend.

## Current scope

The main clinic API and embeddable scheduling API use separate service boundaries. Server-enforced roles separate clinical, billing and administrative access.

Repository is private; this is a public product summary.
