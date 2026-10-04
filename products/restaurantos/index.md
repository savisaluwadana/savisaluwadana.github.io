# Plate Restaurant OS

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/restaurantos/
Reviewed: 2026-10-04

A restaurant-management product bringing point of sale, table service, direct online ordering, kitchen workflows, menus and inventory into one operational workspace.

## Users and purpose

Restaurant staff, kitchen teams, managers and direct-order customers.

Restaurant point of sale and coordinated order operations.

## Capabilities

- POS, table management and menu administration.
- Direct online ordering and kitchen display workflows.
- Inventory and operational analytics.

## Workflow

1. A customer or staff member creates an order.
2. Authenticated Next.js routes validate the request and persist the order.
3. Kitchen and staff interfaces coordinate preparation and service.
4. Managers maintain menus and inventory and inspect order reports.

## Architecture

Next.js → authenticated API routes → MongoDB

- Next.js interfaces: Ordering, POS, kitchen, menu and manager surfaces.
- Authenticated routes: Restaurant and order domain requests.
- MongoDB + Mongoose: Restaurant, menu, order and inventory records.

## Current scope

The product is under development. POS, kitchen and online ordering share a Next.js application and MongoDB data layer; external integrations require deployment-specific configuration.

Repository is private; this is a public product summary.
