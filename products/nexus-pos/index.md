# NexusPOS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/nexus-pos/
Reviewed: 2026-10-04

A retail POS and store-operations system covering touch checkout, barcode workflows, inventory, staff roles, cash shifts, refunds, reconciliation, audit history and native receipt printing.

## Users and purpose

Cashiers, store managers and retail administrators.

Checkout and store operations with an optional Electron desktop shell.

## Capabilities

- Touch checkout, barcode/SKU input, held orders and receipts.
- Inventory, authenticated staff roles and store settings.
- Cash shifts, refunds, reconciliation and audit history.

## Workflow

1. A cashier builds a basket and applies eligible discounts or loyalty.
2. Authenticated server routes calculate checkout totals and validate stock.
3. Prisma persists retail records to MongoDB.
4. The optional Electron shell provides native receipt printing while the browser supports print fallback.

## Architecture

Next.js / React → Prisma → MongoDB + Electron

- Next.js + React: Cashier and store-administration interfaces.
- Server routes: Authenticated staff actions and server-authoritative checkout.
- Prisma + MongoDB: Products, orders and retail operational records.
- Electron: Optional native desktop packaging and receipt printing.

## Current scope

Electron is an optional desktop shell. The portfolio does not claim a complete offline checkout engine or a tenant-isolated hosted retail service.

Repository is private; this is a public product summary.
