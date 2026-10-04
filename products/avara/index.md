# Avara Real Estate

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/avara/
Reviewed: 2026-10-04

A Sri Lankan property platform spanning rentals, property sales and short-term bookings with role-based users, geospatial search, availability, booking workflows, payments and property operations.

## Users and purpose

Property seekers, tenants, hosts and administrators.

Property discovery, transactions and host operations in Sri Lanka.

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

Next.js → MongoDB → S3 → PayHere

- Next.js web + API: Customer, host and admin interfaces plus authenticated domain routes.
- MongoDB: Users, properties, bookings and availability data.
- S3: Property images and uploaded media.
- PayHere: Payment initiation and server-side notification handling.

## Current scope

This diagram summarizes the repository’s property, booking and payment boundaries. PayHere and S3 require deployment-specific configuration.

Source: https://github.com/RealEstateSassApplication/AvaraRealEstate/blob/main/README.md
