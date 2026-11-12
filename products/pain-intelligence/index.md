# Pain Intelligence Lab

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/pain-intelligence/
Reviewed: 2026-11-12

An early community research project for exploring recurring needs using source-linked evidence. The current repository provides a local Next.js and Rust web app and a separate desktop app.

## Users and purpose

Builders, product teams and market researchers.

Local research software for exploring repeated needs and evidence-backed project ideas.

## Capabilities

- Source-linked research observations and evidence review.
- Local Next.js web dashboard and Rust API using PostgreSQL.
- Separate native desktop application with different capabilities.
- Documented research quality and external data-use constraints.

## Workflow

1. Choose and configure the self-hosted web or native desktop edition.
2. The web dashboard sends research requests to the Rust API.
3. The API manages research records and evidence in PostgreSQL.
4. Review linked evidence, limits and validation before drawing conclusions.

## Architecture

Next.js dashboard → Rust API → PostgreSQL; separate desktop app

- Next.js dashboard: Local research workspace and evidence review.
- Rust API: Research endpoints and evidence operations.
- PostgreSQL: Web edition research data and job state.
- Desktop edition: Separate native application; see its README for supported capabilities.

## Current scope

The repository describes an early community alpha for local use. Web and desktop have different capabilities; third-party content retains its own terms.

## Run locally

Configure .env from example; docker compose up --build -d --wait

## Design decision and trade-off

The repository offers a local Next.js/Rust/PostgreSQL web stack and a separate desktop edition.

Trade-off: Local research keeps the data close to the user but two editions have distinct setup and capabilities.

## Unfinished

Early community alpha: README lists connector, import and third-party data limitations.

Licence: MIT

Source: https://github.com/savisaluwadana/Pain-Point-Analyzer/blob/main/README.md
