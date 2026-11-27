# Public repositories and design notes.

I build software with source code and design decisions that others can inspect. Public repository access does not automatically grant an open-source licence.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/open-source/
Reviewed: 2026-11-12

## Public repositories you can inspect

These seven repositories are publicly accessible. The project pages link to setup steps, design decisions, trade-offs and unfinished work. Only the research project currently has a confirmed open-source licence.

| Project and source | What to inspect | Licence | Run locally |
| --- | --- | --- | --- |
| [Avara Real Estate](https://github.com/RealEstateSassApplication/AvaraRealEstate) · [Architecture overview](https://savisaluwadana.github.io/products/avara/) | Sri Lankan property discovery and intelligence, with existing transaction and host workflows. Next.js API → MongoDB; separate S3 and PayHere integrations | Proprietary, all rights reserved | Configure MongoDB and environment variables; npm install; npm run dev |
| [FreshPick / FreshOnTime](https://github.com/FreshOnTime/newfreshontimewebsite) · [Architecture overview](https://savisaluwadana.github.io/products/freshpick/) | Food commerce, producer onboarding and scheduled recurring deliveries in Colombo. Next.js → Prisma / PostgreSQL → recurring delivery + media storage | No licence identified | Set development environment variables; npm ci; npm run db:migrate; npm run dev |
| [Property Management OS](https://github.com/RealEstateSassApplication/property-management-OS) · [Architecture overview](https://savisaluwadana.github.io/products/property-os/) | Multi-tenant rental operations and controlled agent-assisted work. Next.js → Go modular monolith → PostgreSQL → Outbox worker → MCP | No licence identified | Set values from .env.example; docker compose up --build |
| [RapidReach](https://github.com/savisaluwadana/RapidReachBloWebsite) · [Architecture overview](https://savisaluwadana.github.io/products/rapidreach/) | Developer publishing and tool discovery with a small CMS. Next.js → MongoDB → object storage | No licence identified | Configure MongoDB in .env.local; npm install; npm run dev |
| [Advance HRIS](https://github.com/SilverLine-Ravija/Advance-HIRS-System) · [Architecture overview](https://savisaluwadana.github.io/products/advance-hris/) | Hybrid web and local-first desktop HR operations. Next.js Web + Wails / React Desktop → Go API → PostgreSQL | No licence identified | Configure .env from example; docker compose up --build (demo setup) |
| [Academix](https://github.com/savisaluwadana/student-management-system-saas) · [Architecture overview](https://savisaluwadana.github.io/products/academix/) | Student, academic and fee operations in a role-aware workspace. Next.js → MongoDB / Mongoose → notification integrations | No licence identified | Configure environment and database; npm install; npm run dev |
| [Pain Intelligence Lab](https://github.com/savisaluwadana/Pain-Point-Analyzer) · [Architecture overview](https://savisaluwadana.github.io/products/pain-intelligence/) | Local research software for exploring repeated needs and evidence-backed project ideas. Next.js dashboard → Rust API → PostgreSQL; separate desktop app | MIT | Configure .env from example; docker compose up --build -d --wait |

## How to inspect the work

For a project, I start with the [source code index](https://savisaluwadana.github.io/open-source/) and the linked README. Each [product detail page](https://savisaluwadana.github.io/products/) points to its architecture, local setup, main design decision, trade-off and current limitations.

A public repository is not necessarily open-source licensed. Check the licence before copying or redistributing code. The source index distinguishes MIT, proprietary and unspecified terms.

## Start with the engineering boundaries

The [agentic systems walkthroughs](https://savisaluwadana.github.io/engineering/agentic-systems/) trace requests through tools, APIs, recorded state and human review. The [architecture reference](https://savisaluwadana.github.io/engineering/) compares local-first workflows, tenant isolation and payment boundaries across products.

These references help identify the service and rule affected by a change. Product diagrams and source links provide the next level of detail; they do not replace checking the current repository.

## Discuss code or documentation work

For a specific change, start with the repository's README and issue tracker. You can also [contact me](https://savisaluwadana.github.io/contact.html) with the relevant repository and a reproducible problem.
