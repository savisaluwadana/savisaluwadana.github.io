# Pain Intelligence Lab

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/pain-intelligence/
Reviewed: 2026-10-04

A cross-source research platform for discovering repeated customer pain, costly workarounds and product opportunities using saved evidence, quality checks and an MCP-connected research host.

## Users and purpose

Builders, product teams and market researchers.

Cross-source pain research and evidence-backed opportunity validation.

## Capabilities

- Manual evidence ingestion and native Reddit deep research.
- Autonomous research jobs executed by a connected MCP host.
- Semantic clustering, jobs-to-be-done and opportunity synthesis.
- Source diversity, duplicate checks and competitor/pricing validation.

## Workflow

1. A researcher creates a market question and research job.
2. The MCP host gathers evidence and sends it through the platform’s tool boundary.
3. Express stores evidence and workflow state in MongoDB and applies quality/scoring checks.
4. Host reasoning annotates and clusters evidence before opportunities are validated or rejected.

## Architecture

React / Vite + MCP host → Express API → MongoDB

- React workspace: Research questions, saved evidence and project inspection.
- Express platform: Storage, evidence-quality scoring and workflow state.
- MCP host: Browsing, annotation, semantic reasoning and synthesis.
- MongoDB: Evidence, research projects, snapshots and job state.

## Current scope

The application does not call model-provider APIs directly; semantic reasoning runs in the connected MCP host. A research job may correctly produce no validated opportunity.

Source: https://github.com/savisaluwadana/Reddit-post-Analyzer/blob/main/README.md
