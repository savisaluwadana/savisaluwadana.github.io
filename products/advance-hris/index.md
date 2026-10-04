# Advance HRIS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/advance-hris/
Reviewed: 2026-10-04

A hybrid HR information system with an employee web portal, a native HR/admin desktop console, tenant-scoped access, policy-backed leave, schedule-aware attendance, audit history and durable offline synchronization.

## Users and purpose

Employees, managers, HR teams and administrators.

Hybrid web and local-first desktop HR operations.

## Capabilities

- Employee records, tenant scope and role-aware self-service.
- Policy-backed leave and schedule-aware attendance.
- Audit history and durable offline desktop synchronization.

## Workflow

1. Employees and managers use the Next.js portal for self-service.
2. HR/admin users can work through the Wails desktop console and local SQLite storage.
3. The durable sync queue sends authorized operations to the Go API.
4. PostgreSQL remains the authoritative system of record; synchronization handles conflicts explicitly.

## Architecture

Next.js Web + Wails / React Desktop → Go API → PostgreSQL

- Next.js portal: Employee and manager self-service through a web session/BFF boundary.
- Wails desktop: Native HR/admin console with encrypted local payloads.
- SQLite + sync queue: Local state and durable synchronization operations.
- Go + PostgreSQL: Tenant-scoped business rules and authoritative HR records.

## Current scope

Local-first refers to the desktop console. The cloud database remains authoritative. Payroll-ready attendance boundaries do not mean a complete payroll-processing product is included.

Source: https://github.com/savisaluwadana/Advance-HIRS-System/blob/main/README.md
