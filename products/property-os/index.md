# Property Management OS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/property-os/
Reviewed: 2026-10-04

A rental operations platform covering properties, units, tenants, leases, rent, maintenance, documents, notifications and controlled agent-assisted operations.

## Users and purpose

Property managers, owners and authorized operational users.

Multi-tenant rental operations and controlled agent-assisted work.

## Capabilities

- Properties, units, tenants, occupancies and leases.
- Rent obligations, ledger views, maintenance and documents.
- Organization membership, RBAC and audit-aware workflows.
- Transactional notification outbox and authenticated MCP tools.

## Workflow

1. A manager or agent requests an operation through the authenticated API.
2. The Go modular monolith applies organization scope and domain rules.
3. PostgreSQL stores records and notification intents; documents use S3-compatible storage.
4. A Go worker consumes the outbox and delivers notifications through configured providers.

## Architecture

Next.js → Go modular monolith → PostgreSQL → Outbox worker → MCP

- Go API: Organization-scoped domain logic, OIDC identity and RBAC.
- PostgreSQL: Portfolio, tenancy, rent, maintenance and outbox state.
- Object storage: Document objects with database metadata.
- Outbox worker: Durable notification processing through a delivery provider.
- MCP: Agent access through authenticated domain APIs.

## Current scope

MCP calls the same authenticated HTTP API as other clients and has no direct database connection. Advanced financial writes and other domains remain subject to the project’s implemented tool scope.

Source: https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md
