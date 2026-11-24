# Saelior

Saelior is an agentic business operating platform in development. It explores how departments can coordinate AI-assisted tasks, workflows and human decisions within a shared business context.

By: Savi Saluwadana
Canonical page: https://savisaluwadana.github.io/projects/saelior/
Reviewed: 2026-11-24

## The problem

Business work often crosses departmental boundaries. Information, approvals and operational tools are fragmented across systems. Saelior explores how agents and structured workflows can coordinate work without removing human accountability.

## Architecture direction

| Layer | Responsibility |
| --- | --- |
| Department context | Organize work around business functions and their responsibilities. |
| Agents and tools | Connect task-oriented agents to permitted capabilities and relevant business context. |
| Workflow coordination | Represent work, dependencies and handoffs between departments. |
| Human review | Keep consequential decisions subject to explicit human oversight. |

The intended architecture separates orchestration and business authority. This is a product direction, not a claim that every runtime component is implemented or deployed.

## Engineering questions

- How should workflows preserve state, support retries and avoid duplicate side effects?
- How should tool permissions be enforced independently of model-generated requests?
- How can teams inspect execution, human decisions and outcomes?
- How can the same platform support different departmental workflows without hard-coding business rules?

Read [agentic systems architecture](https://savisaluwadana.github.io/engineering/agentic-systems/) and [durable agentic workflows](https://savisaluwadana.github.io/insights/durable-agentic-workflows/) for related engineering principles.

## Current status and evidence

The platform is in development. The public website presents the product vision and illustrative workflows; these do not establish production availability, customer adoption or commercial outcomes.

Visit the [official Saelior website](https://saelior.com/) for the public product overview. Source code is not listed as public in this portfolio.
