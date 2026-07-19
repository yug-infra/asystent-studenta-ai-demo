# Asystent Studenta AI Demo

Public prototype demo of a student AI assistant concept for Microsoft Teams schedule workflow.

This repository is a standalone public demo extracted from a larger browser-plugin idea. The target product is not a separate student portal. It is designed as a desktop browser add-on / overlay for a user who is already signed in to Microsoft Teams in the browser.

## Current Prototype Scope

The current prototype focuses on the schedule workflow:

- showing and filtering student schedule data;
- preparing a UI layer that can sit on top of the Teams browser experience;
- simulating AI assistant interactions for review and competition presentation;
- demonstrating how the UI can later connect to real platform APIs through adapters.

The schedule part is implemented as working frontend logic. The AI assistant area is a prototype/demo layer: it shows the intended interaction model, visual responses and future extension points, but it is not connected to a production AI or Microsoft API backend in this public demo.

## Intended Product Context

The intended product is a desktop-first browser extension or plugin for students who already use Microsoft Teams. In this model, the user is authenticated in Teams by Microsoft, and the assistant layer helps the student navigate study-related information faster.

Planned future directions include:

- tracking assignments and class materials from Microsoft Teams;
- connecting to on-demand learning resources;
- connecting to Moodle or a similar learning management system;
- replacing demo adapters with real integrations where API access is available.

## Why Vanilla JavaScript

This demo intentionally uses Vanilla JavaScript instead of React or another frontend framework.

The goal is to make the architecture, mechanics and design decisions visible for evaluation. The project is small enough to show the patterns directly without hiding the flow behind framework abstractions.

This choice helps demonstrate:

- explicit state and rendering flow;
- separation between domain logic and UI adapters;
- simple dependency direction;
- framework-independent frontend architecture;
- readable prototype mechanics for educational review.

A React version could be built later, but the first public prototype keeps the implementation close to the browser platform.

## Architecture Approach

The frontend is organized as a lightweight Hexagonal Architecture + DDD-inspired structure:

- `domain` contains schedule and AI-demo concepts;
- `application` contains use-case style services and facades;
- `adapters` contains browser UI rendering and external transition points;
- `shared` contains cross-cutting support such as localization.

Some adapters currently behave as demo/stub adapters. This is intentional: they define where real integrations can be attached later without rewriting the domain layer or the main application flow.

Possible future adapter replacements:

- Microsoft Graph / Teams adapter;
- Moodle adapter;
- on-demand resources adapter;
- real AI assistant API adapter;
- browser extension storage/cache adapter.

## Documentation Plan

The repository will use Markdown documentation for GitHub readability. Mermaid diagrams can be embedded directly in Markdown because GitHub renders them natively.

PlantUML sources may also be stored in `docs/diagrams` as architecture source files. Because GitHub does not render PlantUML natively, generated SVG/PNG diagrams can be committed alongside `.puml` files when visual rendering is needed.

## License And Usage

This repository is published as a public prototype demo for educational and competition review purposes.

All rights reserved. The source code, UI concept, documentation and prototype materials may not be copied, reused, redistributed or used as a basis for derivative work without written permission from the author.
