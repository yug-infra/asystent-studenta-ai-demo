# Roadmap

This roadmap describes the intended public development path of the Asystent Studenta AI demo.

## Stage 1: Public Scope

Goal: explain what the prototype is and what it is not.

Status: completed in the first documentation PR.

Scope:

- define the standalone public demo scope;
- describe the desktop browser plugin / Teams overlay context;
- distinguish working schedule logic from AI prototype simulation;
- publish English and Polish overview documentation.

## Stage 2: Planning And Architecture Docs

Goal: make the project direction visible before adding the implementation.

Scope:

- roadmap;
- backlog;
- release notes;
- architecture overview;
- diagram strategy for GitHub-readable documentation.

## Stage 3: User Stories And Use Cases

Goal: connect the product idea with explicit student scenarios.

Scope:

- user stories;
- use-case descriptions;
- Mermaid diagrams for GitHub rendering;
- mapping between use cases and future application services.

## Stage 4: Schedule Dataset And Domain Layer

Goal: introduce the real schedule foundation without mixing it with UI code.

Scope:

- schedule dataset;
- teacher and group helpers;
- normalized schedule records;
- aggregation of duplicated raw class rows into display-ready entries.

## Stage 5: Localization Foundation

Goal: add language support before building full widgets.

Scope:

- Polish and English UI labels;
- shared i18n resources;
- UI text separated from domain and application logic.

## Stage 6: Theme Foundation

Goal: introduce semantic visual tokens and theme switching.

Scope:

- day/night modes;
- CSS variables for surfaces, text, accent colors and states;
- design rules separated from schedule logic.

## Stage 7: Desktop-First Layout Shell

Goal: prepare the static GitHub Pages-compatible application shell.

Scope:

- `index.html` entry point;
- application bootstrap;
- top navigation;
- schedule and AI areas;
- responsive behavior for smaller screens.

## Stage 8: Working Schedule Widgets

Goal: implement the schedule MVP as the first working part of the demo.

Scope:

- filters;
- class list/cards;
- current and upcoming class interactions;
- application service connection;
- DOM adapter rendering.

## Stage 9: Teams Transition Adapter

Goal: isolate Teams-related transitions behind an adapter boundary.

Scope:

- demo-safe transition behavior;
- clear replacement point for Microsoft Graph / Teams API;
- no exposure of private experimental addressing syntax in the public demo.

## Stage 10: AI Prototype Demo

Goal: add the simulated AI assistant layer.

Scope:

- prepared questions;
- chat history;
- visual details panel;
- fixture/catalog-based answers;
- clear prototype/demo status.

## Stage 11: Public Demo Release

Goal: prepare the repository and GitHub Pages link for teacher and competition review.

Scope:

- final README links;
- Pages verification;
- release notes;
- public demo version tag.
