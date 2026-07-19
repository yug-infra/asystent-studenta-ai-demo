# Architecture Overview

The public demo is organized as a frontend-only prototype using a lightweight Hexagonal Architecture + DDD-inspired structure.

The goal is not to imitate a backend-heavy enterprise system. The goal is to keep the browser prototype understandable, replaceable and ready for future real integrations.

## Analysis Documents

The implementation plan is driven by student-facing scenarios:

- [User Stories](USER_STORIES.md)
- [Use Cases](USE_CASES.md)

These documents define the behavior that later code layers should satisfy.

## Layers

| Layer | Responsibility | Example |
|---|---|---|
| Domain | Core concepts and rules | schedule records, teachers, AI demo catalog |
| Application | Use-case services and facades | schedule service, AI assistant service |
| Adapters | Browser and external boundaries | DOM renderer, shell renderer, Teams transition adapter |
| Shared | Cross-cutting frontend utilities | i18n resources/translator facade, theme tokens/service facade |
| Data | Static demo data | schedule dataset |

## Dependency Direction

Domain logic should not depend on DOM rendering, browser events or external platform APIs. UI and integration details should point inward to application/domain services.

```mermaid
flowchart TD
    UI["UI Adapter"] --> APP["Application Services"]
    APP --> DOMAIN["Domain Layer"]
    DATA["Static Demo Data"] --> APP
    TEAMS["Teams Adapter"] --> APP
    SHARED["Shared i18n/theme"] --> UI
```

## App Shell

The GitHub Pages entry point is intentionally thin:

| File | Responsibility |
|---|---|
| `index.html` | Static browser entry point and script composition order |
| `src/main.js` | Application bootstrap and dependency wiring |
| `src/adapters/ui/shell-renderer.js` | Desktop-first shell rendering, tabs and UI events |
| `src/adapters/ui/styles.css` | CSS variables, layout rules and responsive shell behavior |

This keeps the page host separate from the UI adapter and prepares the next PRs to attach schedule and AI widgets without rewriting the shell.

## Shared Localization

Localization is decomposed into small shared files instead of one large utility file:

| File | Responsibility |
|---|---|
| `src/shared/i18n/resources.js` | Stores supported languages and translation dictionaries |
| `src/shared/i18n/translator.js` | Provides internal language normalization, fallback lookup and translator factory |
| `src/shared/i18n/index.js` | Exposes the public i18n module facade used by application/UI code |

This keeps UI text out of domain code while avoiding a large mixed-purpose helper.

## Shared Theme

Theme handling follows the same small-module rule as localization:

| File | Responsibility |
|---|---|
| `src/shared/theme/tokens.js` | Stores semantic theme names, spacing/radius tokens and day/night palettes |
| `src/shared/theme/theme-service.js` | Normalizes theme names, creates theme state and applies CSS variables to a target element |
| `src/shared/theme/index.js` | Exposes the public theme facade used by UI adapters |

The theme module is shared infrastructure. It does not know about schedule records, AI answers or Teams navigation.

## Why This Shape

The prototype needs to show both working behavior and future growth points:

- schedule logic works now without a backend;
- AI is represented as a demo catalog / fixture flow;
- Teams navigation is isolated behind an adapter;
- future Microsoft Graph, Moodle, on-demand and AI APIs can replace demo adapters.

## Application Flow

The application flow should stay close to use cases:

1. User changes filter or selects an action.
2. UI adapter reads the event and calls an application service.
3. Application service prepares view data from domain/data modules.
4. UI adapter renders the result.
5. External transitions, such as Teams navigation, go through an adapter boundary.

```mermaid
sequenceDiagram
    participant Student
    participant UI as UI Adapter
    participant App as Application Service
    participant Domain
    participant Adapter as External Adapter

    Student->>UI: Selects schedule action
    UI->>App: Calls use-case facade
    App->>Domain: Normalizes or queries schedule data
    Domain-->>App: View-ready result
    App-->>UI: Response model
    UI-->>Student: Rendered schedule / details
    UI->>Adapter: Optional Teams transition
```

## Current Demo Boundaries

Some parts are intentionally demo/stub implementations:

| Boundary | Current form | Future replacement |
|---|---|---|
| Teams transition | Frontend demo adapter | Microsoft Graph / Teams API adapter |
| AI responses | Fixture/catalog data | Real AI assistant API adapter |
| Learning resources | Planned only | Moodle / on-demand resources adapter |
| Storage/cache | Planned only | Browser extension storage/cache adapter |

## Documentation And Diagrams

GitHub renders Mermaid diagrams directly in Markdown, so public documentation should prefer Mermaid for diagrams that need to be visible in the repository.

PlantUML can still be useful as architecture source files. If PlantUML is used, store `.puml` files in `docs/diagrams` and optionally commit generated `.svg` or `.png` files for direct viewing.
