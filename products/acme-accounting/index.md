# Acme Accounting

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/acme-accounting/
Reviewed: 2026-10-04

A single-company accounting application with a double-entry general ledger, invoicing, A/R and A/P aging, vendor bills, credit notes, refunds, period locks, bank reconciliation, budgeting and financial reporting.

## Users and purpose

A company’s accounting administrator and finance operator.

Single-company financial operations backed by a double-entry ledger.

## Capabilities

- Chart of accounts, journals, invoicing and receivables.
- Vendor bills, payables, expenses, credit notes and refunds.
- Bank reconciliation, period locks, recurring transactions and budgets.
- Ledger-backed statements and accounting integrity diagnostics.

## Workflow

1. An operator creates a source document such as an invoice or vendor bill.
2. Authenticated domain services validate the accounting transition.
3. The posting layer records balanced journals in the general ledger.
4. Reports read the ledger while period controls and audit history preserve traceability.

## Architecture

Next.js → MongoDB / Mongoose → double-entry ledger

- Next.js + NextAuth: Finance interfaces and authenticated route handlers.
- Accounting services: Source-document workflows, validation and period controls.
- General ledger: Balanced journal posting, reversal and source-level idempotency.
- MongoDB: Financial records, journal history and reporting source data.

## Current scope

The current application is designed for one company and one administrator identity per database. It is not a tenant-isolated accounting SaaS backend.

Repository is private; this is a public product summary.
