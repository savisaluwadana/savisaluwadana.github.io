# Concurrent Booking: Prevent Overselling with Transactions

> Prevent overselling in booking systems using atomic capacity checks, database transactions, uniqueness constraints and safe retries.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-11-24  
Updated: 2026-11-24  
Canonical: https://savisaluwadana.github.io/insights/concurrent-booking/

Booking correctness depends on protecting the capacity invariant under concurrent writes. Reading availability and inserting a reservation as separate unprotected operations can oversell even when each individual request appears valid.

## How can a booking system prevent overselling?

**Answer:** Treat capacity checking and reservation creation as one atomic database operation. Use a conditional update or row lock within a transaction, enforce uniqueness for logical reservations and roll back if any required write fails. A successful request should consume capacity exactly once, including after a timeout and retry.

## Why checking availability first is unsafe

Suppose three seats remain and eight concurrent requests read the same count before any transaction writes. Every request may decide there is space. Without an atomic check-and-write boundary, all eight could be accepted and exceed capacity by five.

A web client's displayed availability is advisory. The application must resolve the authoritative result when it commits a reservation. Rejecting a request because the last seat was taken is a valid business outcome, not necessarily an infrastructure error.

## An atomic capacity update in PostgreSQL

One implementation pattern is to update the capacity row with a predicate such as remaining > 0 and inspect the number of rows returned. If one row is updated, create the reservation within the same database transaction. If none is updated, return a full-or-unavailable outcome.

If reservation insertion or another invariant fails, roll the transaction back, including the capacity decrement. A unique constraint on the operation identity or appropriate reservation business key helps prevent duplicate requests. Return an existing outcome for a valid retry rather than decrementing capacity again.

This is an illustrative pattern for a single capacity row. Multiple resources, cancellation, holds, expiry and deadlocks require additional domain rules and transaction design.

## Apply the invariant to a real project boundary

[EventMesh](https://savisaluwadana.github.io/projects/eventmesh/) is event discovery and matching software in development with a Go-backed API and PostgreSQL. Booking capacity and duplicate reservation prevention are documented engineering concerns. This guide describes a proposed verification approach, not a production load-test result or claim that every technique has been implemented.

## How can I test concurrent reservations?

**Answer:** Start with a known capacity and issue more simultaneous requests than available seats. Count committed reservations, rejected requests and remaining capacity. Assert that committed reservations never exceed capacity, remaining capacity is nonnegative, and retries of successful requests do not consume additional seats.

Try the [interactive reservation model](https://savisaluwadana.github.io/lab/#reservations) with three seats and eight contenders. The unsafe interleaving oversells by five; the serialized teaching model accepts three. Then use real PostgreSQL integration tests with concurrent transactions to verify an actual implementation.

## Related technical references

[EventMesh architecture](https://savisaluwadana.github.io/projects/eventmesh/) · [Go modular monolith for SaaS](https://savisaluwadana.github.io/insights/go-modular-monolith-saas/) · [Idempotent retry model](https://savisaluwadana.github.io/lab/#retries)
