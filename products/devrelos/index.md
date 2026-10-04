# DevRelOS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/devrelos/
Reviewed: 2026-10-04

An operating system for discovering developer signals, managing community and content workflows, connecting developer feedback to product work, and measuring outcomes from one operational surface.

## Users and purpose

Developer-relations teams and developer-community operators.

A self-hosted beta for discovery, engagement and outcome measurement.

## Capabilities

- Signal Radar, pain-point intelligence and developer feedback.
- Events, CFPs, reusable talks, contacts and relationships.
- Content, campaigns, media workflows and approval-gated outreach.
- Authenticated MCP tools and workspace-scoped access.

## Workflow

1. Connectors or an operator bring source-backed signals into a workspace.
2. The Go API validates membership and stores domain state in PostgreSQL.
3. Background workers run connector, media and approved outreach tasks.
4. The dashboard and MCP clients inspect work and track its outcomes through the domain API.

## Architecture

Next.js → Go API → PostgreSQL → Workers → MCP

- Next.js dashboard: Operator workspaces and same-origin API proxy.
- Go domain API: Authenticated workflows, membership checks and business rules.
- PostgreSQL: Workspace data, evidence, workflow state and audit history.
- Go workers: Connector ingestion, media rendering and approved delivery.
- MCP: Authenticated domain tools; no parallel database access path.

## Current scope

This project is a self-hosted beta. External providers require credentials and policy configuration; consequential outreach follows approval workflows.

Source: https://github.com/savisaluwadana/DevRelOS/blob/main/README.md
