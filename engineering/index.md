# Software architecture across product workflows.

A reference to the boundaries behind my product work: where authority lives, how clients access it, and what a workflow actually guarantees. Each comparison links to the relevant product architecture and current scope.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/engineering/
Reviewed: 2026-10-04

## AI agents and MCP access boundaries

Model Context Protocol gives an agent a tool interface. The useful architectural question is what happens behind that interface: which service authorizes the request, where reasoning runs, and whether an action needs approval.

| Project | Access and reasoning boundary |
| --- | --- |
| [Property Management OS](https://savisaluwadana.github.io/products/property-os/) | MCP calls the same authenticated Go HTTP API used by other clients. Domain rules and tenant permissions remain server-side; the MCP server has no direct database connection. |
| [DevRelOS](https://savisaluwadana.github.io/products/devrelos/) | A Next.js dashboard, Go API and workers share PostgreSQL as the system of record. Provider adapters and evidence provenance support the workflow; consequential outreach passes through approval gates. |
| [Pain Intelligence Lab](https://savisaluwadana.github.io/products/pain-intelligence/) | A React interface and Express/MongoDB application expose research tools to an MCP host. Semantic reasoning runs in the connected host, rather than direct model-provider calls from the application. |

These are different boundaries. An agent tool does not imply unrestricted writes or an autonomous production workflow. Product scope notes describe the implemented tools, provider configuration and evidence requirements.

## Local-first data and desktop packaging

[Advance HRIS](https://savisaluwadana.github.io/products/advance-hris/) combines a Next.js web application with a Wails/React desktop console, encrypted SQLite payloads and a sync queue. The Go API and cloud PostgreSQL database remain authoritative. The local-first boundary belongs to the desktop workflow.

[NexusPOS](https://savisaluwadana.github.io/products/nexus-pos/) has an optional Electron desktop shell around the retail application. Desktop packaging alone does not establish an offline checkout engine. That distinction matters when evaluating a product for disconnected operations.

To assess a local-first system, identify the authoritative record, the queued work, and the conflict-resolution boundary. A local database or desktop executable answers only part of that question.

## Tenant isolation and domain authority

A SaaS interface and a tenant-isolated backend are separate architectural concerns. [Property Management OS](https://savisaluwadana.github.io/products/property-os/) documents multi-tenant rental operations, role-based access and domain rules in its Go API. [Acme Accounting](https://savisaluwadana.github.io/products/acme-accounting/) currently uses one company and one administrator identity per database.

[Academix](https://savisaluwadana.github.io/products/academix/) has role-aware academic workflows and SaaS plan surfaces, while broader tenant-isolation and automated-billing work remain subject to its roadmap. The product labels should be read together with the current implementation boundaries.

The reference point is the server-side rule: who can read or change a record, which organization owns it, and which transaction maintains its integrity. A dashboard or plan selector does not establish those guarantees by itself.

## Bookings, recurring orders and payment workflows

| Project | Documented transaction boundary |
| --- | --- |
| [Avara Real Estate](https://savisaluwadana.github.io/products/avara/) | Property and booking workflows connect to PayHere payment callbacks and S3 media. Payment and storage integrations need deployment-specific configuration. |
| [FreshPick](https://savisaluwadana.github.io/products/freshpick/) | Next.js and PostgreSQL support food commerce and scheduled recurring delivery. Checkout and subscription baskets currently use cash on delivery; automatic recurring card charging is not implemented. |
| [EventOS](https://savisaluwadana.github.io/products/eventos/) | Matching and event procurement use a Next.js/PostgreSQL application. Payment evidence is submitted and reconciled manually in the current MVP. |

A booking, a recurring order and a payment represent different state changes. Keeping those boundaries explicit makes the architecture easier to inspect and prevents a delivery schedule from being mistaken for automated billing.

## Read the source and current scope

This reference summarizes the documented project boundaries. It does not report measured performance, deployment outcomes or customer results. Product pages carry the corresponding architecture diagrams, component responsibilities, review dates and source links.

- [Property Management OS repository documentation](https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md)
- [DevRelOS repository documentation](https://github.com/savisaluwadana/DevRelOS/blob/main/README.md)
- [Pain Intelligence Lab repository documentation](https://github.com/savisaluwadana/Reddit-post-Analyzer/blob/main/README.md)
- [Advance HRIS repository documentation](https://github.com/savisaluwadana/Advance-HIRS-System/blob/main/README.md)
- [Avara repository documentation](https://github.com/RealEstateSassApplication/AvaraRealEstate/blob/main/README.md)
- [FreshPick repository documentation](https://github.com/FreshOnTime/newfreshontimewebsite/blob/main/README.md)
- [Academix repository documentation](https://github.com/savisaluwadana/student-management-system-saas/blob/main/README.md)
