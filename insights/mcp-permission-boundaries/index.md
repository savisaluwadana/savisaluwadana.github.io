# MCP Permission Boundaries: Keep Agent Tools Behind the Application API

> A practical architecture for MCP tools: authenticate at the application boundary, keep authorization in domain services, record state in the system of record, and require approval for consequential actions.

By Savi Saluwadana  
Published: 2026-10-07  
Canonical: https://savisaluwadana.github.io/insights/mcp-permission-boundaries/

The safest default for an MCP-enabled application is simple: the model should not become a second authority path. Agent tools should call the same authenticated application boundary used by other clients, while authorization, tenant scope, validation and durable state remain inside the application.

## What is the right permission boundary for MCP tools?

**Answer:** Put MCP behind the application API, not beside it. The tool interface can translate an agent request into an application operation, but the application should still decide whether the caller is allowed to perform that operation, which tenant or workspace it belongs to, and which invariants must hold.

This keeps the model from becoming a privileged shortcut around the system. It also makes agent activity easier to reason about because the same domain rules protect web, mobile, CLI and agent clients.

## Why direct database access is usually the wrong default

A database understands rows and transactions; it does not automatically understand business permission. If an agent can write directly to tables, authorization logic can fragment between prompts, tools and schema assumptions. That is difficult to audit and easy to get wrong.

A stronger design keeps the database as the system of record while routing mutations through domain services. The API can validate identity, organization scope, allowed state transitions and required side effects before anything is committed.

## Separate tool availability from business authorization

An MCP server may expose a tool named `create_maintenance_request`, `publish_content` or `send_outreach`. The existence of that tool should not imply unconditional permission. The application still needs to evaluate the authenticated principal, workspace membership, object ownership and current state.

This distinction matters because tool discovery is an interface concern while authorization is a domain concern. Keeping them separate makes permission changes possible without redesigning the agent layer.

## Treat consequential actions differently from analysis

Reading records, summarizing evidence and proposing an action are different from sending a message, changing money-related state or mutating production configuration. Consequential operations should have stronger controls: explicit scopes, approval states, idempotency keys where appropriate, audit records and clear failure reporting.

Human approval is most useful when it is represented as application state rather than a vague instruction inside a prompt. A draft can be created by an agent, reviewed by a person and only then become eligible for delivery.

## What this looks like in my project architecture

In [Property Management OS](/products/property-os/), the documented MCP boundary calls the authenticated Go API rather than connecting directly to PostgreSQL. In [DevRelOS](/products/devrelos/), workspace membership and approval-gated outreach remain application concerns. Those projects differ in domain, but the same architectural principle applies: the agent proposes or requests work; the application remains authoritative.

For a broader walkthrough, see [Agentic systems: tools, state and human review](/engineering/agentic-systems/).

## A compact design checklist

- Authenticate the caller before the tool reaches domain logic.
- Resolve tenant or workspace scope inside the application.
- Authorize the specific operation, not just access to the MCP server.
- Validate domain invariants before persistence.
- Record consequential actions and approvals as durable state.
- Make retries safe for operations that may be repeated.
- Return explicit failure reasons that can be inspected without exposing secrets.

The goal is not to make agents powerless. It is to give them useful capabilities without creating a second, weaker security model.

## Sources and implementation references

- https://savisaluwadana.github.io/products/property-os/
- https://savisaluwadana.github.io/products/devrelos/
- https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md
- https://github.com/savisaluwadana/DevRelOS/blob/main/README.md

## Related engineering notes

- [Durable Agentic Workflows: State, Idempotency and Human Approval](https://savisaluwadana.github.io/insights/durable-agentic-workflows/)
- [PostgreSQL Multi-Tenancy: Define Authorization Boundaries Before Schema Tricks](https://savisaluwadana.github.io/insights/postgres-multitenancy-boundaries/)
