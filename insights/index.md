# Engineering insights by Savi Saluwadana

Original technical notes on software architecture, Go, PostgreSQL, platform engineering, MCP and durable agentic systems.

Canonical: https://savisaluwadana.github.io/insights/

- [MCP Permission Boundaries: Keep Agent Tools Behind the Application API](https://savisaluwadana.github.io/insights/mcp-permission-boundaries/): A practical architecture for MCP tools: authenticate at the application boundary, keep authorization in domain services, record state in the system of record, and require approval for consequential actions.
- [Durable Agentic Workflows: State, Idempotency and Human Approval](https://savisaluwadana.github.io/insights/durable-agentic-workflows/): How to design agentic workflows that survive retries and failures: persist state, separate proposals from side effects, make mutations idempotent, and model human approval explicitly.
- [Go Modular Monolith Architecture for SaaS: Boundaries Before Microservices](https://savisaluwadana.github.io/insights/go-modular-monolith-saas/): A practical way to structure a Go SaaS backend as a modular monolith: organize by domain, keep transactions local, separate workers and integrations, and extract services only when operational boundaries justify it.
- [Platform Engineering: Build a Paved Road Without Hiding the System](https://savisaluwadana.github.io/insights/platform-engineering-paved-road/): A platform engineering design principle: automate common delivery paths while keeping ownership, state, observability and escape hatches visible enough for engineers to debug and extend the platform.
- [PostgreSQL Multi-Tenancy: Define Authorization Boundaries Before Schema Tricks](https://savisaluwadana.github.io/insights/postgres-multitenancy-boundaries/): A practical approach to PostgreSQL multi-tenancy: resolve tenant context early, scope every domain operation, enforce ownership consistently, and use database isolation as defense in depth rather than the only authorization layer.

## Related references

- [Software architecture reference](https://savisaluwadana.github.io/engineering/)
- [Agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/)
- [Product directory](https://savisaluwadana.github.io/products/)
- [Public source index](https://savisaluwadana.github.io/open-source/)
