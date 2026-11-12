# Public repositories and design notes.

I build software with source code and design decisions that others can inspect. Public repository access does not automatically grant an open-source licence.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/open-source/
Reviewed: 2026-11-12

## Public repositories you can inspect

| Project and source | Architecture | Licence | Run locally |
| --- | --- | --- | --- |
| [Avara Real Estate](https://github.com/RealEstateSassApplication/AvaraRealEstate) · [Details](https://savisaluwadana.github.io/products/avara/) | Next.js → MongoDB → S3 → PayHere | Proprietary, all rights reserved | Configure MongoDB and environment variables; npm install; npm run dev |
| [FreshPick / FreshOnTime](https://github.com/FreshOnTime/newfreshontimewebsite) · [Details](https://savisaluwadana.github.io/products/freshpick/) | Next.js → Prisma / PostgreSQL → recurring delivery + media storage | No licence identified | Set development environment variables; npm ci; npm run db:migrate; npm run dev |
| [Property Management OS](https://github.com/RealEstateSassApplication/property-management-OS) · [Details](https://savisaluwadana.github.io/products/property-os/) | Next.js → Go modular monolith → PostgreSQL → Outbox worker → MCP | No licence identified | Set values from .env.example; docker compose up --build |
| [RapidReach](https://github.com/savisaluwadana/RapidReachBloWebsite) · [Details](https://savisaluwadana.github.io/products/rapidreach/) | Next.js 16 → MongoDB → Vercel Blob | No licence identified | Configure MongoDB in .env.local; npm install; npm run dev |
| [Advance HRIS](https://github.com/SilverLine-Ravija/Advance-HIRS-System) · [Details](https://savisaluwadana.github.io/products/advance-hris/) | Next.js Web + Wails / React Desktop → Go API → PostgreSQL | No licence identified | Configure .env from example; docker compose up --build (demo setup) |
| [Academix](https://github.com/savisaluwadana/student-management-system-saas) · [Details](https://savisaluwadana.github.io/products/academix/) | Next.js → MongoDB / Mongoose → notification integrations | No licence identified | Configure environment and database; npm install; npm run dev |
| [Pain Intelligence Lab](https://github.com/savisaluwadana/Pain-Point-Analyzer) · [Details](https://savisaluwadana.github.io/products/pain-intelligence/) | Next.js dashboard → Rust API → PostgreSQL; separate desktop app | MIT | Configure .env from example; docker compose up --build -d --wait |

## How to inspect the work

Start with the repository README, then read each project's design trade-offs and unfinished work. Check the licence before reuse.

## Architecture and contact

[Engineering reference](https://savisaluwadana.github.io/engineering/) · [Contact](https://savisaluwadana.github.io/contact.html)
