# EventMesh

EventMesh is event experience software in development for conferences, meetups and exhibitions. It explores how attendees can find relevant people, topics and sessions, arrange conversations and record useful outcomes.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/projects/eventmesh/
Reviewed: 2026-11-24

## The problem

Large events create a discovery problem: attendees have limited time and incomplete information about sessions, projects and people. EventMesh explores a structured way to connect attendee intent to relevant event opportunities.

## System architecture

| Component | Role |
| --- | --- |
| Web experience | A Next.js interface for attendee and event workflows. |
| Go backend | Application APIs, business rules, event-scoped access and booking operations. |
| PostgreSQL | Authoritative event, membership and reservation data. |
| Gateway | Caddy provides one origin, routing API traffic to Go and other traffic to the Next.js interface. |

The documented default Compose stack uses Caddy, a Go API, Next.js for UI only, and PostgreSQL 17 as the system of record. Redis and model API keys are not required to boot the local demo. The pilot uses application rules rather than requiring a language model for every match.

## Engineering questions

- Match attendees to relevant event opportunities using explicit criteria and deterministic ranking.
- Protect booking capacity and prevent duplicate reservations under concurrent requests.
- Keep private attendee data and event-scoped permissions separate.
- Explore real-time state delivery and recoverable event updates.
- Design mobile-friendly event interactions for short, time-constrained journeys.

See [Go modular monolith architecture](https://savisaluwadana.github.io/insights/go-modular-monolith-saas/) and [PostgreSQL multi-tenancy](https://savisaluwadana.github.io/insights/postgres-multitenancy-boundaries/) for related engineering approaches.

## Current status and evidence

EventMesh is in development. The current project explores event questions, matching, bookings and outcome recaps. The full adaptive event journey is a future direction, not a completed release. No public production deployment, commercial adoption or benchmark is asserted here.

Source code is not listed as public. Contact me through the [portfolio contact page](https://savisaluwadana.github.io/contact.html) to discuss the project or its engineering approach.
