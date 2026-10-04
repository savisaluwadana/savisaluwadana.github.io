# Ad Performance Analysis Agent

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/ad-performance-agent/
Reviewed: 2026-10-04

A campaign-performance analysis prototype that parses ad-data CSVs, compares weekly metrics, highlights risks and wins, and uses Gemini to help produce actionable summaries.

## Users and purpose

Marketing operators and teams reviewing campaign performance.

An advertising analytics and reporting prototype.

## Capabilities

- CSV parsing of campaign dates, spend, clicks, impressions and conversions.
- Week-over-week metrics and threshold-based risk/win flags.
- Gemini-assisted summaries and email reporting paths.

## Workflow

1. An operator supplies campaign data as CSV.
2. The analysis module normalizes rows and compares current and previous periods.
3. Threshold logic identifies risks and wins; Gemini helps summarize next steps.
4. The reporting interface displays results and the email path can send a summary when configured.

## Architecture

React / Vite → Express → CSV analysis + Gemini → email

- React interface: Campaign-data input and analysis views.
- Express API: Prototype configuration, scheduling and reporting endpoints.
- Analysis module: CSV normalization, weekly comparison and threshold flags.
- Gemini + Resend: Configured AI summarization and email-report delivery.

## Current scope

Google Ads and Supermetrics connection endpoints are currently mocks. Scheduled demonstration runs use generated sample CSVs and in-memory configuration, rather than a durable live account-ingestion pipeline.

Repository is private; this is a public product summary.
