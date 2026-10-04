# TimelyHelp.lk

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/timelyhelp/
Reviewed: 2026-10-04

A mental-healthcare platform for discovering licensed practitioners, booking secure consultations and managing digital care journeys. I worked on the product and frontend experience across practitioner discovery, account flows, checkout, dashboards and consultation surfaces.

## Users and purpose

People seeking mental-health consultations, practitioners and administrators.

Product and frontend work for practitioner discovery and consultation journeys.

## Capabilities

- Practitioner discovery, accounts and protected dashboard flows.
- Booking and checkout interfaces around consultation services.
- Video-consultation surfaces, internationalization and frontend monitoring.

## Workflow

1. A visitor explores practitioner information.
2. NextAuth manages frontend authentication and protected account flows.
3. The frontend exchanges practitioner and consultation data with application APIs.
4. Video consultation uses Zoom Video SDK; Sentry supports frontend error visibility.

## Architecture

Next.js 15 → NextAuth → practitioner APIs → Zoom Video SDK

- Next.js frontend: Discovery, account, checkout, dashboard and consultation experiences.
- NextAuth: Frontend session and protected-page integration.
- Application APIs: Practitioner and consultation data supplied to the frontend.
- Zoom + Sentry: Live video surfaces and error monitoring.

## Current scope

Savi’s portfolio contribution is product and frontend work. This page summarizes that frontend boundary and does not claim ownership of the full clinical backend.

Source: https://timelyhelp.lk/
