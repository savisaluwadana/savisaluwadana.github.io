# FreshPick / FreshOnTime

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/freshpick/
Reviewed: 2026-10-04

A premium food-commerce platform for Colombo bringing together fresh groceries, local products, prepared meals, recurring delivery and business ordering in one customer experience.

## Users and purpose

Grocery shoppers, local producers, business buyers and administrators.

Food commerce, producer onboarding and scheduled recurring deliveries in Colombo.

## Capabilities

- Catalog browsing, product discovery and customer shopping.
- Producer onboarding, admin operations and business enquiries.
- Subscription baskets and recurring-order delivery scheduling.
- Public read-only catalog tools through MCP.

## Workflow

1. A shopper chooses catalog items or a recurring basket.
2. Next.js validates the request and domain services persist orders through Prisma.
3. PostgreSQL holds catalog, order and delivery state; scheduling advances due deliveries.
4. Media and transactional messages use their configured storage and email integrations.

## Architecture

Next.js → Prisma / PostgreSQL → recurring delivery + media storage

- Next.js: Storefront, producer and admin interfaces, API routes and public MCP catalog access.
- Prisma + PostgreSQL: Catalog, order, subscription and delivery records.
- Scheduled workflows: Recurring deliveries and transactional communications.
- Storage adapter: Durable product and editorial images.

## Current scope

Customer checkout and subscription baskets currently use cash on delivery. Automatic recurring card charging is not implemented. Subscription baskets and recurring grocery orders are distinct workflows.

Source: https://github.com/FreshOnTime/newfreshontimewebsite/blob/main/README.md
