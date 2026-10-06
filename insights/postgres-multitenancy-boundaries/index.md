# PostgreSQL Multi-Tenancy: Define Authorization Boundaries Before Schema Tricks

> A practical approach to PostgreSQL multi-tenancy: resolve tenant context early, scope every domain operation, enforce ownership consistently, and use database isolation as defense in depth rather than the only authorization layer.

By Savi Saluwadana  
Published: 2026-10-07  
Canonical: https://savisaluwadana.github.io/insights/postgres-multitenancy-boundaries/

Multi-tenancy is primarily an authorization and ownership problem. Database techniques matter, but the system first needs a reliable answer to a simpler question: which tenant is this operation acting for, and why is the caller allowed to act there?

## What is the most important rule in multi-tenant SaaS?

**Answer:** Resolve tenant context before executing domain work and carry that context through every query and mutation. A request should never “discover” its tenant by reading whichever record happens to match an unscoped identifier.

Tenant identity should come from an authenticated membership, trusted routing context or another explicit application mechanism.

## Make tenant scope part of repository contracts

If repository methods accept only a record ID, it is easy for callers to forget tenant scope. Prefer contracts that require both tenant and record identity for tenant-owned data. This turns isolation from a convention into an interface requirement.

Queries should also be reviewed for indirect relationships. A child record may not contain a tenant ID itself, so the join path still needs to prove that the parent belongs to the active tenant.

## Use PostgreSQL constraints and RLS as defense in depth

Application authorization and database protection solve related but different problems. The application understands business roles and workflow rules. PostgreSQL constraints, schemas and Row Level Security can reduce the blast radius of mistakes.

RLS is strongest when the application establishes trusted tenant context consistently and tests the policies as part of the data-access layer. It should not become a substitute for understanding authorization in the application.

## Separate global identities from tenant memberships

A user account can be global while roles and permissions are tenant-specific. Modeling membership explicitly avoids confusing “who is this person?” with “what may this person do in this organization?”

This becomes especially important for operators who belong to multiple organizations or for service accounts and agents that need tightly scoped capabilities.

## Audit cross-tenant and privileged operations

Some administrative workflows legitimately cross tenant boundaries. Those operations should be rare, explicit and auditable. A support or migration capability should not reuse an ordinary tenant-scoped endpoint with a hidden bypass.

The more privileged the operation, the more useful it is to record the actor, target tenant, reason and resulting state change.

## How this connects to my system design work

[Property Management OS](/products/property-os/) documents organization-scoped operations in a Go/PostgreSQL application. [Advance HRIS](/products/advance-hris/) also describes tenant-scoped access in a hybrid web and desktop system. Their workflows differ, but both reinforce the same principle: tenant ownership belongs in the application model, not only in URL structure or UI state.

For backend structure around these boundaries, see [Go modular monolith architecture for SaaS](/insights/go-modular-monolith-saas/).

## Sources and implementation references

- https://savisaluwadana.github.io/products/property-os/
- https://savisaluwadana.github.io/products/advance-hris/
- https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md
- https://github.com/savisaluwadana/Advance-HIRS-System/blob/main/README.md

## Related engineering notes

- [Go Modular Monolith Architecture for SaaS: Boundaries Before Microservices](https://savisaluwadana.github.io/insights/go-modular-monolith-saas/)
- [MCP Permission Boundaries: Keep Agent Tools Behind the Application API](https://savisaluwadana.github.io/insights/mcp-permission-boundaries/)
