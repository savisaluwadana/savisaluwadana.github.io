# Agentic systems: tools, state and human review.

An agent becomes useful when its tools connect to a real workflow. These project walkthroughs show where an agent enters the system, where state is recorded, and which service controls the resulting action.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/engineering/agentic-systems/
Reviewed: 2026-10-04

## Different agent entry points

The model, tool interface and domain service have different responsibilities. The model can propose an action, while the application still needs to determine whether that action is permitted and what record it changes. The examples below expose those boundaries rather than treating every AI feature as the same architecture.

| Project | Agent boundary | What controls the result |
| --- | --- | --- |
| [Property Management OS](https://savisaluwadana.github.io/products/property-os/) | MCP tools call the authenticated Go API. | Organization scope and domain rules remain in the API. PostgreSQL stores business records and notification intents. |
| [Pain Intelligence Lab](https://savisaluwadana.github.io/products/pain-intelligence/) | A connected MCP host performs semantic research and synthesis. | The Express application records evidence and research state, and applies quality and scoring checks. The application does not call model APIs directly. |
| [DevRelOS](https://savisaluwadana.github.io/products/devrelos/) | Dashboard and authenticated MCP clients access workspace workflows. | The Go API checks membership; workers handle configured providers and approved delivery. Consequential outreach requires approval. |
| [Ad Performance Analysis Agent](https://savisaluwadana.github.io/products/ad-performance-agent/) | Gemini assists with summaries after CSV analysis. | Threshold logic computes flags. Account connectors are mocks, so this prototype is not a durable live-account ingestion system. |

## Follow a rental-operations request

In [Property Management OS](https://savisaluwadana.github.io/products/property-os/), an agent uses the same authenticated HTTP boundary as another client. Adding a tool interface does not create an alternative route around tenant permissions or domain rules.

1. A manager or agent requests an operation through the authenticated API.
2. The Go modular monolith applies organization scope and domain rules.
3. PostgreSQL stores records and notification intents; documents use S3-compatible storage.
4. A Go worker consumes the outbox and delivers notifications through configured providers.

The recorded domain operation and notification delivery have separate responsibilities. The database holds the record and notification intent; an outbox worker performs delivery through a configured provider. That separation is useful when inspecting whether a business action was accepted versus whether its notification was delivered.

The documented MCP scope matters: advanced financial writes and other domains should be checked against the implemented tools. The existence of an API endpoint is not evidence that an agent has permission to perform every operation.

## Follow an evidence-led research task

[Pain Intelligence Lab](https://savisaluwadana.github.io/products/pain-intelligence/) separates host reasoning from the application that stores research evidence. A question becomes a research job; the host gathers and annotates evidence through tools while the application retains the project state.

1. A researcher creates a market question and research job.
2. The MCP host gathers evidence and sends it through the platform’s tool boundary.
3. Express stores evidence and workflow state in MongoDB and applies quality/scoring checks.
4. Host reasoning annotates and clusters evidence before opportunities are validated or rejected.

The output is evaluated as evidence, not just generated text. Source diversity, duplicate checks, independent stories and competitor or pricing validation affect whether an opportunity survives the research process. A job can correctly finish with no validated opportunity.

This boundary also changes how the system is configured: the connected host provides semantic reasoning, while the platform provides storage, inspection and quality checks. Model-provider behavior should not be inferred from the Express application alone.

## Approvals in developer operations

[DevRelOS](https://savisaluwadana.github.io/products/devrelos/) connects source-backed signals, workspace membership, background work and approval-gated outreach. Its domain API and workers serve different parts of that process.

1. Connectors or an operator bring source-backed signals into a workspace.
2. The Go API validates membership and stores domain state in PostgreSQL.
3. Background workers run connector, media and approved outreach tasks.
4. The dashboard and MCP clients inspect work and track its outcomes through the domain API.

A research signal or draft is different from an external action. Evidence can inform a workflow while the delivery step still needs approval and provider configuration. The self-hosted beta’s scope notes describe those prerequisites; they should be retained when evaluating the system.

## What I want to develop further

My broader interests include durable orchestration, multi-agent collaboration, retrieval and evaluation. The following are design questions I want to explore, rather than claims that every project already implements the same capabilities.

- How should a tool make repeated requests safe when an agent or worker retries?
- Which state should persist so a long-running task can resume after failure?
- How can agents share evidence and responsibilities without losing provenance?
- What evaluation catches unauthorized actions, weak evidence and incorrect outcomes before they reach a user?
- Which actions need human review, and how should that decision be recorded?

## Inspect the current implementation

- [Property Management OS repository documentation](https://github.com/RealEstateSassApplication/property-management-OS/blob/main/README.md)
- [Pain Intelligence Lab repository documentation](https://github.com/savisaluwadana/Reddit-post-Analyzer/blob/main/README.md)
- [DevRelOS repository documentation](https://github.com/savisaluwadana/DevRelOS/blob/main/README.md)

See the [broader architecture reference](https://savisaluwadana.github.io/engineering/) for local-first data, tenancy and transaction comparisons, or the [public source index](https://savisaluwadana.github.io/open-source/) to browse repository references. [About Savi](https://savisaluwadana.github.io/about/) describes my engineering and collaboration interests.
