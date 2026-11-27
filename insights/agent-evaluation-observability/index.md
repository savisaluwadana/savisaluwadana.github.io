# Evaluating AI Agents: Outcomes, Traces and Safety

> Build repeatable AI agent evaluations using outcome assertions, tool traces, failure fixtures, cost budgets and safety checks.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-11-28  
Updated: 2026-11-28  
Canonical: https://savisaluwadana.github.io/insights/agent-evaluation-observability/

## How should AI agents be evaluated?

**Answer:** Evaluate an agent on whether it completes the requested task in a controlled environment while respecting safety and resource constraints. Check the resulting application state rather than relying only on the final response. Record tool calls, latency, cost and policy events to distinguish successful outcomes from lucky or unsafe trajectories.

## Test outcomes in a resettable environment

Build task fixtures with seeded state and explicit expectations. In a booking example, evaluate the reservation record, tenant ownership and remaining capacity rather than whether the agent says the booking succeeded. Reset fixtures between trials so prior runs cannot affect the next result.

## Separate correctness from efficiency

Report task success, denied operations, unintended side effects, elapsed time, model usage and tool calls separately. A cheap run that violates tenant isolation is not successful; an expensive but correct run is a candidate for optimization. Compare distributions over repeated trials and retain the model and harness versions.

## Use adversarial and operational cases

Include missing permissions, malicious instructions embedded in tool output, stale information, provider timeouts and approval rejection. Instrument the policy layer and verify that rejected operations never reach mutation endpoints. Test cancellation and recovery as first-class scenarios, not just happy paths.

## Make traces useful without leaking data

Propagate a run ID across model calls, application services and workers. Collect redacted input/output summaries and explicit error categories; avoid storing access tokens or sensitive payloads. Use traces to diagnose regressions, then turn the failure into a reproducible fixture. Trace collection is not itself proof that the agent is safe.

## How can I verify this design?

Design ten seeded tasks with a deterministic pass condition and run each several times against two harness versions using the same fixture and comparable model configuration. Report task success, policy violations, p95 latency and median tool calls, plus the sample size and limitations. This is an experiment proposal; no performance claim is made.

## Related engineering notes

- [AI Agent Harness Architecture: Beyond the Model](https://savisaluwadana.github.io/insights/ai-agent-harness-architecture/)
- [The Bounded Agent Loop: Plan, Act, Observe, Stop](https://savisaluwadana.github.io/insights/bounded-agent-loop/)
- [Durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/)
- [Agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/)
- [Interactive authorization model](https://savisaluwadana.github.io/lab/#permissions)

## Primary technical references

- [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) — Evaluation of agent outcomes and trajectories.
- [OpenAI — Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) — Tracing and runtime observability controls.
