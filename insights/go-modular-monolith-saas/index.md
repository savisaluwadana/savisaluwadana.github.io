# Go Modular Monolith Architecture for SaaS: Boundaries Before Microservices

> A practical way to structure a Go SaaS backend as a modular monolith: organize by domain, keep transactions local, separate workers and integrations, and extract services only when operational boundaries justify it.

By Savi Saluwadana  
Published: 2026-10-07  
Canonical: https://savisaluwadana.github.io/insights/go-modular-monolith-saas/

A modular monolith is a useful default for many SaaS systems because it keeps deployment and transactions simple while still forcing clear domain boundaries. The important part is not having one binary; it is preventing one module from casually owning another module’s data and rules.

## What is a modular monolith in Go?

**Answer:** A modular monolith is one deployable application composed of explicit domain modules. Each module owns its business rules and persistence access, while shared infrastructure such as HTTP transport, authentication, logging and database connections stays outside the domain core.

It provides many of the organizational benefits people seek from microservices without immediately accepting distributed transactions, service discovery and cross-service failure modes.

## Organize around domains, not technical folders

A folder tree such as `handlers/`, `services/` and `repositories/` can make every feature span the entire codebase. A domain-oriented layout keeps lease logic near lease persistence, maintenance logic near maintenance persistence and billing logic near billing rules.

The transport layer should translate HTTP into application commands or queries. It should not become the place where domain rules are assembled ad hoc.

## Keep module ownership explicit

One module should not reach into another module’s tables simply because the same database connection makes it possible. Prefer module APIs or application services that make the dependency visible. This gives the codebase a path to future extraction if one boundary later needs independent scaling or ownership.

Database schemas alone do not create architecture. The important boundary is which code is allowed to interpret and mutate a domain’s state.

## Use the monolith to keep transactions honest

When a business operation needs to update several records atomically, a monolith with one relational database can often express the transaction directly. That is valuable. Splitting the same workflow across services too early converts a straightforward transaction into coordination, retries and compensation.

Extraction is justified when operational independence, scale, security isolation or organizational ownership becomes more valuable than local transactional simplicity.

## Separate background workers without fragmenting the domain

A modular monolith can still have separate worker processes. The application can record an outbox or job intent in the same transaction as the business change, while a worker performs notifications, provider calls or other asynchronous work later.

This pattern keeps business acceptance separate from external delivery. The domain can say “the request was recorded” even if an email provider is temporarily unavailable.

## How I apply this pattern

[Property Management OS](/products/property-os/) documents a Go modular monolith backed by PostgreSQL, with an outbox worker and an MCP layer that calls the authenticated API. The design keeps domain authority in the application instead of distributing it across clients.

The lesson is not that every system should remain a monolith forever. It is that service boundaries should be earned by real operational requirements rather than assumed at project start.

## Sources and implementation references

- https://savisaluwadana.github.io/products/property-os/
- https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md

## Related engineering notes

- [PostgreSQL Multi-Tenancy: Define Authorization Boundaries Before Schema Tricks](https://savisaluwadana.github.io/insights/postgres-multitenancy-boundaries/)
- [Platform Engineering: Build a Paved Road Without Hiding the System](https://savisaluwadana.github.io/insights/platform-engineering-paved-road/)
