# Blu.lk

By / portfolio contribution: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/products/blu/
Reviewed: 2026-10-04

A Sri Lankan home-services platform connecting customers with skilled professionals across electrical, plumbing, cleaning, AC, carpentry and other services, with customer, provider and worker-facing workflows.

## Users and purpose

Customers, service providers, workers and operations teams.

Home-service discovery, booking and fulfillment in Sri Lanka.

## Capabilities

- Service categories and customer booking journeys.
- Provider and worker coordination around scheduled jobs.
- Administrative management of services, users and operational status.

## Workflow

1. A customer discovers a service and supplies booking details.
2. The Laravel platform records the request and its status in MySQL.
3. Providers and workers coordinate assignment and fulfillment through their product experiences.
4. Operations teams manage service records and follow the booking lifecycle.

## Architecture

Customer + provider experiences → Laravel API → MySQL

- Customer interfaces: Service discovery and booking requests.
- Laravel platform: Booking, provider, worker and administrative workflows.
- MySQL: Persistent service and operational records.

## Current scope

This diagram covers the core service platform. Payment-provider availability depends on integration configuration; no specific online payment launch is claimed here.

Source: https://blu.lk/
