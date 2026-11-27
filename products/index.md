# Projects by industry.

Explore projects by the industry and business problem they serve. Each overview documents its users, workflow, architecture, source references and current scope.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/
Reviewed: 2026-11-12

## Featured development projects

Two active development projects have dedicated architecture and scope summaries. They are separate from the documented product directory below.

- [Saelior](https://savisaluwadana.github.io/projects/saelior/) — agentic business operating platform in development.
- [EventMesh](https://savisaluwadana.github.io/projects/eventmesh/) — event discovery and matching software in development.

## Real estate & property

Property discovery, rentals and property operations.

| Product | Purpose and architecture |
| --- | --- |
| [Avara Real Estate](https://savisaluwadana.github.io/products/avara/) | Sri Lankan property discovery and intelligence, with existing transaction and host workflows. Next.js API → MongoDB; separate S3 and PayHere integrations |
| [Property Management OS](https://savisaluwadana.github.io/products/property-os/) | Multi-tenant rental operations and controlled agent-assisted work. Next.js → Go modular monolith → PostgreSQL → Outbox worker → MCP |

## Healthcare & mental health

Practitioner discovery, consultations and clinic operations.

| Product | Purpose and architecture |
| --- | --- |
| [TimelyHelp.lk](https://savisaluwadana.github.io/products/timelyhelp/) | Product and frontend work for practitioner discovery and consultation journeys. Next.js 15 → NextAuth → practitioner APIs → Zoom Video SDK |
| [MediCare](https://savisaluwadana.github.io/products/medicare/) | Patient administration, appointments, clinical records and billing. Next.js → Go API + scheduling service → PostgreSQL |

## Food, retail & hospitality

Food commerce, checkout, inventory and restaurant operations.

| Product | Purpose and architecture |
| --- | --- |
| [FreshPick / FreshOnTime](https://savisaluwadana.github.io/products/freshpick/) | Food commerce, producer onboarding and scheduled recurring deliveries in Colombo. Next.js → Prisma / PostgreSQL → recurring delivery + media storage |
| [NexusPOS](https://savisaluwadana.github.io/products/nexus-pos/) | Checkout and store operations with an optional Electron desktop shell. Next.js / React → Prisma → MongoDB + Electron |
| [Plate Restaurant OS](https://savisaluwadana.github.io/products/restaurantos/) | Restaurant point of sale and coordinated order operations. Next.js → authenticated API routes → MongoDB |

## Home & professional services

Service discovery, bookings and fulfillment.

| Product | Purpose and architecture |
| --- | --- |
| [Blu.lk](https://savisaluwadana.github.io/products/blu/) | Home-service discovery, booking and fulfillment in Sri Lanka. Customer + provider experiences → Laravel API → MySQL |

## Finance & accounting

Financial operations, ledger integrity and reporting.

| Product | Purpose and architecture |
| --- | --- |
| [Acme Accounting](https://savisaluwadana.github.io/products/acme-accounting/) | Single-company financial operations backed by a double-entry ledger. Next.js → MongoDB / Mongoose → double-entry ledger |

## Human resources

Employee records and workforce operations.

| Product | Purpose and architecture |
| --- | --- |
| [Advance HRIS](https://savisaluwadana.github.io/products/advance-hris/) | Hybrid web and local-first desktop HR operations. Next.js Web + Wails / React Desktop → Go API → PostgreSQL |

## Education

Student, academic and fee operations.

| Product | Purpose and architecture |
| --- | --- |
| [Academix](https://savisaluwadana.github.io/products/academix/) | Student, academic and fee operations in a role-aware workspace. Next.js → MongoDB / Mongoose → notification integrations |

## Events & procurement

Event service discovery and procurement workflows.

| Product | Purpose and architecture |
| --- | --- |
| [EventOS](https://savisaluwadana.github.io/products/eventos/) | Quick provider matching and full event procurement. Next.js → PostgreSQL → transactional workflows + file storage |

## Marketing & advertising

Campaign analysis and reporting.

| Product | Purpose and architecture |
| --- | --- |
| [Ad Performance Analysis Agent](https://savisaluwadana.github.io/products/ad-performance-agent/) | An advertising analytics and reporting prototype. React / Vite → Express → CSV analysis + Gemini → email |

## Technology, media & research

Developer publishing and evidence-led research software.

| Product | Purpose and architecture |
| --- | --- |
| [RapidReach](https://savisaluwadana.github.io/products/rapidreach/) | Developer publishing and tool discovery with a small CMS. Next.js → MongoDB → object storage |
| [Pain Intelligence Lab](https://savisaluwadana.github.io/products/pain-intelligence/) | Local research software for exploring repeated needs and evidence-backed project ideas. Next.js dashboard → Rust API → PostgreSQL; separate desktop app |

## Read each product in context

This directory covers products I’ve built and worked on, including development projects, prototypes and frontend contributions. A listed product is not a claim that every capability is commercially deployed. Each product page states the documented boundary.

Read the [architecture reference](https://savisaluwadana.github.io/engineering/) to compare agent permissions, desktop data, tenant isolation and transaction workflows. Visit [About Savi](https://savisaluwadana.github.io/about/) for engineering focus and public profile links.
