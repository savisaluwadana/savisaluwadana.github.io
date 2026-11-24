# Offline-First Sync: Queues, Conflicts and Recovery

> Design offline-first mobile and desktop sync using durable queues, version checks, conflict handling and an authoritative backend.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-11-24  
Updated: 2026-11-24  
Canonical: https://savisaluwadana.github.io/insights/offline-first-sync/

Offline-first software must preserve local work without silently replacing newer server state. A durable operation queue, versioned writes and explicit conflict handling separate a responsive client from an authoritative backend.

## How should an offline-first application synchronize data?

**Answer:** Persist each local edit and its pending operation together, assign a stable operation identity, then retry synchronization when connectivity returns. The backend validates identity, authorization and record version before committing. Acknowledge successful operations, retain rejected changes for inspection, and reconcile downloaded records without overwriting unresolved local edits.

## Separate cached records from pending intent

A local record and a queued operation serve different purposes. The record makes the UI responsive; the operation records what the user intends to change. Write both atomically in the local database, store the base version and operation ID, and represent pending, acknowledged and conflicted states explicitly.

If the device crashes after sending a request but before recording the acknowledgement, retry with the same operation ID. The server needs a durable deduplication rule, not merely a client-side flag.

## A version conflict is not a network failure

Imagine a client reads employee record version 7, edits a field while offline, and later submits that edit after another client has committed version 8. A conditional update against version 7 fails. Retrying unchanged forever cannot fix this conflict.

Keep the pending edit and retrieve the current authorized server state. Depending on the domain, ask the user to resolve the conflict or apply a deliberately defined merge rule. Blind last-write-wins can erase business changes; it is not a universal default.

## Preserve authorization and data authority

A local cache is not a grant of server permissions. Authenticate again when reconnecting, enforce tenant scope and business invariants on every mutation, and consider how local sensitive records are encrypted, expired and removed after access is revoked.

The [Advance HRIS architecture](https://savisaluwadana.github.io/products/advance-hris/) documents a local SQLite queue for the desktop console, a Go API and an authoritative PostgreSQL database. This article generalizes the design; it does not claim that every proposed mobile sync technique is implemented there.

## How can I test offline synchronization?

**Answer:** Test an edit while offline, a crash before acknowledgement, duplicated delivery, a stale base version, expired access and an incoming refresh while a local change remains pending. Verify that intent is preserved, unauthorized writes fail and one accepted logical operation causes at most one effect.

The [interactive retry model](https://savisaluwadana.github.io/lab/#retries) demonstrates the simplified replay invariant. It does not simulate a real database or mobile device. For a production evaluation, add process-kill tests, transactional integration tests and reconciliation checks.

## Implementation and related reading

[Advance HRIS project overview](https://savisaluwadana.github.io/products/advance-hris/) · [Durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/) · [Architecture reference](https://savisaluwadana.github.io/engineering/)
