# AI Agent Harness Architecture: Beyond the Model

> Design an AI agent harness with bounded execution, tool policy, durable state, sandboxing and explicit evaluation.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-11-28  
Updated: 2026-11-28  
Canonical: https://savisaluwadana.github.io/insights/ai-agent-harness-architecture/

## What is an AI agent harness?

**Answer:** An agent harness is the software surrounding a model that manages context, tool execution, policy, run state and termination. It turns model-generated proposals into controlled application actions. The harness, not the model alone, determines what the agent can access, how long it may run and how failures are handled.

## Separate the model from the execution boundary

A model proposes a tool call; it does not directly own the filesystem, database or production credentials. A dispatcher validates arguments against a schema and rechecks the caller’s identity and permissions before it invokes a tool. Run untrusted commands in a restricted environment with explicit network and resource limits. Treat tool output as untrusted data rather than instructions.

## Persist a session ledger

Store a run ID, tool-call IDs, accepted actions, checkpoints and terminal status. A new model invocation can reload a compact summary plus selected evidence, but a summary is not a substitute for authoritative state. Use stable operation IDs for mutations and reconcile unknown outcomes before retrying.

## Choose the smallest useful harness

Start with a single bounded loop and a few typed tools. Add specialist agents only if a controlled comparison improves the task outcome enough to justify additional coordination, latency and cost. For a code-review agent, read-only repository inspection and a structured findings schema may suffice; do not grant write permissions just because a tool exists.

## Observe and protect each run

Record model and tool spans, duration, token usage, policy decisions, and termination reason with correlation IDs. Redact secrets before persisting traces. Enforce time, turn and spend budgets at the application boundary, not as prompt instructions. Pause before consequential actions and allow cancellation.

## How can I verify this design?

Create a fake model that returns a valid read request, an unauthorized write, and a repeated mutation. Assert that the read is allowed, the write is denied without side effects, and the repeat does not create another committed effect. Restart the worker after a checkpoint and verify that the ledger resumes consistently. This is a proposed test, not a measured production result.

## Related engineering notes

- [The Bounded Agent Loop: Plan, Act, Observe, Stop](https://savisaluwadana.github.io/insights/bounded-agent-loop/)
- [Evaluating AI Agents: Outcomes, Traces and Safety](https://savisaluwadana.github.io/insights/agent-evaluation-observability/)
- [Durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/)
- [Agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/)
- [Interactive authorization model](https://savisaluwadana.github.io/lab/#permissions)

## Primary technical references

- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) — Incremental progress and durable context across sessions.
- [OpenAI — Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) — Agent runtime, turn limits and continuation.
