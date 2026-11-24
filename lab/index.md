# Engineering laboratory

Explore three small, deterministic software engineering models. Change inputs, compare unsafe and protected designs, and inspect the resulting decisions. These are educational simulations, not production benchmarks or measured service performance.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/lab/
Reviewed: 2026-11-24

## 01 / Idempotent retry and duplicate delivery

At-least-once delivery may send the same request more than once. Compare a handler that applies every request with one that remembers processed request identities. The invariant is exactly one side effect per unique request.

Try five requests with two retries. With deduplication, 15 deliveries produce five effects and ten suppressed replays. Without it, 15 effects are applied.

The model uses an in-memory set, not an atomic database transaction. Production code must address persistence, transaction boundaries, concurrent claims and the retention lifetime of idempotency keys. Read [durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/).

## 02 / Concurrent reservation capacity

A check-then-write race can occur when all contenders read the same available capacity before any update becomes visible. Compare that deliberately unsafe schedule with serialized capacity checks and writes. The invariant is that accepted reservations never exceed capacity.

Try three seats and eight contenders. The unsafe schedule accepts eight and oversells by five; the serialized model accepts three and rejects five.

This is an abstract worst-case interleaving, not a concurrent database benchmark. Real implementations need transactional locking or conditional writes, retry handling and isolation testing. See [EventMesh](https://savisaluwadana.github.io/projects/eventmesh/) for related architectural concerns.

## 03 / Agent authorization and human approval

An agent request must be authorized by application policy, not by the model's intention. In this simplified policy, viewers can read, operators can read and write, and admins can also transfer after human approval. Cross-tenant operations are always denied.

Try an admin transfer with and without approval, or any cross-tenant action. The decision trace exposes each policy check; all checks must pass.

This teaching model omits real identity verification, resource-level permissions, approval expiration and replay protection. It is not a security library. Read [MCP permission boundaries](https://savisaluwadana.github.io/insights/mcp-permission-boundaries/).

## Reproduce and extend

The browser and automated tests use the same pure JavaScript models. Inspect the [model source](https://savisaluwadana.github.io/lab/models.mjs), [test source](https://savisaluwadana.github.io/lab/models.test.mjs) and [portfolio repository](https://github.com/savisaluwadana/savisaluwadana.github.io). From a local clone with Node.js 22, run node --test lab/models.test.mjs.

Tests cover bounded inputs, protected and deliberately unsafe cases, and role/action/tenant/approval combinations. These tests establish properties of the simplified models only. Real-service throughput, latency, recovery and distributed failure experiments remain separate work.
