# RapidReach

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/rapidreach/
Reviewed: 2026-11-12

A developer publication and tool-discovery product with editorial workflows, comments, likes, search, tool profiles, media uploads and a deliberately small CMS.

## Users and purpose

Readers, developers exploring tools and editorial administrators.

Developer publishing and tool discovery with a small CMS.

## Capabilities

- Articles, categories, search, comments, likes and sharing.
- Tool profiles, category browsing and tool upvotes.
- Editorial draft/publish workflows and media uploads.
- Structured metadata, feeds and machine-readable discovery surfaces.

## Workflow

1. An editor creates a draft and attaches uploaded media.
2. The CMS stores editorial and tool records in MongoDB.
3. Published pages and tool profiles render from the same Next.js application.
4. Readers discover content through the site, search and published feeds.

## Architecture

Next.js → MongoDB → object storage

- Next.js: Public pages, tool directory, CMS and API routes in one application.
- MongoDB: Editorial records, tool records, comments and categories.
- object storage: Public media objects referenced by content records.

## Current scope

RapidReach uses one Next.js application with MongoDB and Blob storage; there is no separate backend service. Publishing and media require a configured deployment.

## Run locally

Configure MongoDB in .env.local; npm install; npm run dev

## Design decision and trade-off

Next.js handles the CMS, page delivery and APIs, backed by MongoDB and blob media.

Trade-off: One deployable app reduces boundaries, but media and publishing rely on configured external services.

## Unfinished

Production media storage and environment configuration remain deployment responsibilities.

Licence: No licence identified

Source: https://github.com/savisaluwadana/RapidReachBloWebsite/blob/main/README.md
