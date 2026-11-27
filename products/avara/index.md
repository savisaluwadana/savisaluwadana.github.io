# Avara Real Estate

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/avara/
Reviewed: 2026-11-28

A Sri Lankan property platform evolving toward account-optional discovery, neighbourhood information and living-cost estimates, alongside existing listings, bookings and host workflows.

## Users and purpose

Property seekers, tenants, hosts and administrators.

Sri Lankan property discovery and intelligence, with existing transaction and host workflows.

## Capabilities

- Rental, sale and short-stay listings with location and geospatial search.
- Role-aware property administration and media uploads.
- Availability calendars, booking workflows and local payment integration.

## Workflow

1. A visitor searches listings and opens a property.
2. An authenticated user submits a booking request; server-side rules evaluate availability.
3. Booking and payment state are stored in MongoDB; media is stored separately.
4. Hosts and administrators manage listings, calendars and transaction status.

## Architecture

Next.js API → MongoDB; separate S3 and PayHere integrations

- Next.js web + API: Customer, host and admin interfaces plus authenticated domain routes.
- MongoDB: Users, properties, bookings and availability data.
- S3: Property images and uploaded media.
- PayHere: Payment initiation and server-side notification handling.

## Current scope

The documented current runtime is Next.js with MongoDB, with S3 and PayHere integrations requiring configuration. Next.js with Supabase is a proposed discovery target, not a completed migration. The standalone Property Management OS remains separate.

## Run locally

Configure MongoDB and environment variables; npm install; npm run dev

## Design decision and trade-off

A single Next.js app handles property workflows and MongoDB storage.

Trade-off: A unified app is easier to run, but payment and media require configured external services.

## Unfinished

Production checklist and external payment/storage configuration remain.

Licence: Proprietary, all rights reserved

Source: https://github.com/RealEstateSassApplication/AvaraRealEstate/blob/main/README.md
