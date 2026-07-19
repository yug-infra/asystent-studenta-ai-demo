# Backlog

This backlog mirrors the main GitHub Issues used to build the public demo step by step.

## Current Development Track

| Issue | Area | Goal | Status |
|---|---|---|---|
| #2 | Scope | Document prototype scope and architecture choices | Done |
| #3 | Planning | Add roadmap, backlog, release notes and architecture docs | Done |
| #4 | Analysis | Define user stories and use cases | Done |
| #5 | Domain | Add schedule dataset and domain normalization | Done |
| #6 | Shared | Add localization foundation | Done |
| #7 | UI Foundation | Add theme foundation | In review |
| #8 | App Shell | Build desktop-first layout shell | Planned |
| #9 | Schedule MVP | Implement schedule widgets and application flow | Planned |
| #10 | Integration Boundary | Add Teams transition adapter | Planned |
| #11 | AI Prototype | Add AI prototype catalog and chat flow | Planned |
| #12 | Release | Prepare public demo release and GitHub Pages | Planned |

## Product Backlog

### Schedule

- Display normalized schedule entries.
- Filter classes by group, subject, type and teacher.
- Highlight current and upcoming classes.
- Keep raw schedule data separated from display aggregation.

### Teams Context

- Show a clear transition point from schedule context to Teams context.
- Keep the current public demo safe and frontend-only.
- Replace demo transition adapter with Microsoft Graph / Teams integration when API access is available.

### AI Prototype

- Provide a limited set of prepared student questions.
- Keep chat history visible and cumulative.
- Open visual response panels from AI answers.
- Make the demo status explicit: simulated assistant, not production AI.

### Future Integrations

- Teams assignments and class materials.
- On-demand learning resources.
- Moodle or similar LMS.
- Browser extension cache/storage.
- Real AI API adapter.

## Documentation Backlog

- User stories and use cases.
- Mermaid diagrams rendered by GitHub.
- Optional PlantUML source files in `docs/diagrams`.
- Architecture decisions and adapter boundaries.
- Public release notes.

## Technical Debt Watch

The public prototype may contain demo/stub behavior by design. Each stub should be documented with:

- location;
- reason;
- risk;
- replacement plan.

Expected initial stubs:

- Teams transition adapter;
- AI answer catalog / fixtures;
- browser extension storage/cache placeholder.
