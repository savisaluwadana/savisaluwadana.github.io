# Durable Agentic Workflows: State, Idempotency and Human Approval

> How to design agentic workflows that survive retries and failures: persist state, separate proposals from side effects, make mutations idempotent, and model human approval explicitly.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-10-07  
Updated: 2026-11-24  
Canonical: https://savisaluwadana.github.io/insights/durable-agentic-workflows/

An agent becomes operationally useful when its work can survive retries, partial failures and human review. That requires more than a model loop: it requires durable state, explicit transitions and clear ownership of side effects.

## What makes an agentic workflow durable?

**Answer:** A durable agentic workflow stores enough state to resume safely after interruption and separates reasoning from side effects. The system should know what was requested, what evidence was gathered, which step completed, which action is awaiting approval and whether an external side effect has already happened.

If that state exists only in a model conversation, the workflow is difficult to resume and difficult to audit.

## Persist business state, not just chat history

Conversation history can explain how the agent reasoned, but the application still needs structured records for jobs, approvals, actions and outcomes. A research job might store its question, sources, evidence quality and validation result. An operations workflow might store the requested mutation, approval status, execution attempt and delivery status.

Structured state creates a stable contract between the model, workers, APIs and humans.

## Use idempotency where retries can create duplicate effects

Retries are normal in distributed systems. They become dangerous when repeating the same call can create a second payment, send a duplicate notification or create multiple records. For consequential mutations, the caller should provide or derive a stable idempotency key and the application should record the accepted operation.

Idempotency is not needed everywhere. It matters most at boundaries where a repeated request would create a second externally visible effect.

## Model approval as a state transition

A prompt that says “ask before sending” is weaker than an application state machine that says a draft must be `approved` before a delivery worker can process it. The second design can be tested, queried and audited.

This also makes responsibilities clearer: the model can prepare a recommendation, a person can approve it, and a worker can execute it. Each step has a different failure mode and a different owner.

## Keep asynchronous work observable

Long-running work should expose status that can be inspected without reopening the original model session. Useful states include queued, running, waiting-for-approval, succeeded, failed and cancelled. The record should capture error context that helps an operator understand whether the failure came from policy, validation, a provider or infrastructure.

In [Pain Intelligence Lab](/products/pain-intelligence/), research state and evidence remain in the application while reasoning is performed through a connected MCP host. This workflow benefits from explicit state.

## Design for recovery before adding more agents

Multi-agent collaboration can add useful specialization, but it also multiplies coordination problems. Before introducing more agents, make one workflow resumable, inspectable and safe under retry. Once state transitions are explicit, specialized agents can operate on well-defined pieces of work instead of passing opaque conversational context between one another.

Durability is therefore an application architecture problem first and an agent orchestration problem second.

## How can I verify that a retry is idempotent?

**Answer:** Send the same logical request repeatedly with the same operation identity and compare durable effects against unique requests. In the teaching model, five unique requests with two extra delivery attempts produce fifteen deliveries but only five effects when deduplication is enabled. Real systems must also test concurrent attempts and crash recovery.

Related portfolio evidence: [Interactive retry model](https://savisaluwadana.github.io/lab/#retries).

## Sources and implementation references

- https://savisaluwadana.github.io/engineering/agentic-systems/
- https://savisaluwadana.github.io/products/pain-intelligence/
- https://github.com/savisaluwadana/Reddit-post-Analyzer/blob/main/README.md

## Related engineering notes

- [MCP Permission Boundaries: Keep Agent Tools Behind the Application API](https://savisaluwadana.github.io/insights/mcp-permission-boundaries/)
- [Platform Engineering: Build a Paved Road Without Hiding the System](https://savisaluwadana.github.io/insights/platform-engineering-paved-road/)

## Primary technical references

These references support the engineering concepts discussed here; they are not endorsements of this portfolio or evidence of production results.

- [Amazon Builders’ Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — Stable caller-provided request identities and the implications of delayed retries.
