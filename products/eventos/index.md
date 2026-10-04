# EventOS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/eventos/
Reviewed: 2026-10-04

An event-services marketplace and operations platform for finding suppliers, comparing quotes, managing bookings and contracts, tracking payments and coordinating event delivery.

## Users and purpose

Guests, event buyers, suppliers and administrators.

Quick provider matching and full event procurement.

## Capabilities

- Service requests, supplier profiles and quote comparison.
- Bookings, contracts and event execution workflows.
- Manual payment submission and administrative reconciliation.
- PostgreSQL sessions, row-level authorization and persistent uploads.

## Workflow

1. A guest requests a provider or a buyer defines an event and service requirements.
2. Suppliers submit quotes; the buyer compares and accepts an offer.
3. Database transactions coordinate booking, contract and commercial state.
4. Authorized users share files and track execution; administrators reconcile submitted payment records.

## Architecture

Next.js → PostgreSQL → transactional workflows + file storage

- Next.js: Public marketplace and buyer, supplier and admin workflows.
- Database adapter: Authenticated requests and domain transactions.
- PostgreSQL: Sessions, row-level authorization, functions and lifecycle state.
- File adapter: Public supplier assets and access-controlled event documents.

## Current scope

Payments are submitted and reconciled manually in the current MVP. This is a Next.js and PostgreSQL application; a Supabase service is not required for the documented runtime.

Repository is private; this is a public product summary.
