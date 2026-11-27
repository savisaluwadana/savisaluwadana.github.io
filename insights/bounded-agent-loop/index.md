# The Bounded Agent Loop: Plan, Act, Observe, Stop

> Understand how to implement a bounded AI agent loop with tool validation, progress checks, retries, approvals and explicit termination.

By [Savi Saluwadana](https://savisaluwadana.github.io/about/)  
Published: 2026-11-28  
Updated: 2026-11-28  
Canonical: https://savisaluwadana.github.io/insights/bounded-agent-loop/

## How does a safe agent loop work?

**Answer:** A bounded agent loop repeatedly obtains a model decision, validates any proposed tool action, executes permitted work, observes the result and checks whether to continue. A runtime enforces termination conditions independently of the model, including successful validation, budget exhaustion, cancellation, policy denial or a need for human approval.

## Define the run contract before the loop

Specify an objective, allowed tools, success predicate, deadline and resource budgets. A task such as collecting public product data should finish when required fields are validated, not merely when the model declares success. Record a final outcome such as succeeded, failed, cancelled, exhausted or awaiting approval.

## Differentiate iteration from retry

A new iteration uses updated observations to choose a next action. A retry reattempts the same logical operation after a transient failure. Apply bounded backoff with jitter only when retrying is safe. A timeout after an external mutation leaves the outcome unknown; query the authoritative service or use its idempotency contract before reissuing the mutation.

## Detect stalled runs

Maintain a fingerprint of proposed tool names, normalized arguments and relevant observed state. Repeating the same call is not always wrong, but repeated calls without new evidence should trigger escalation or a bounded stop. A tool failure should be represented as structured data so the next decision can distinguish bad arguments from temporary unavailability.

## Make approval an explicit pause

Persist the proposed action and the exact parameters a human is authorizing. Resume from that checkpoint after approval, rechecking expiry and authorization before execution. Do not let a new model proposal silently substitute different parameters. Separate read-only tasks from write operations and validate the output before returning it.

## How can I verify this design?

Use a deterministic mock tool and model script to exercise successful completion, a denied action, an endless repeat, cancellation and a timed-out mutation. Assert finite termination, explicit reason codes and no duplicate external effects. Compare tool calls and wall time, not just the final text.

## Related engineering notes

- [AI Agent Harness Architecture: Beyond the Model](https://savisaluwadana.github.io/insights/ai-agent-harness-architecture/)
- [Evaluating AI Agents: Outcomes, Traces and Safety](https://savisaluwadana.github.io/insights/agent-evaluation-observability/)
- [Durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/)
- [Agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/)
- [Interactive authorization model](https://savisaluwadana.github.io/lab/#permissions)

## Primary technical references

- [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Workflow and autonomous agent patterns.
- [OpenAI — Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) — Runtime limits, approval and resumable runs.
