# AGENTS.md

This repository contains a Vim learning game with a TUI mainline product and a legacy browser prototype.

## Commands

```bash
npm start
npm run web:start
npm test
node --test tests/evaluate.test.js
node --test tests/vimSession.test.js
```

Notes:

- `npm start` launches the TUI campaign and requires a real TTY plus `/usr/bin/vim`.
- `npm run web:start` starts the old browser prototype. It is still kept in the repo, but it is not the main product.

## Product Shape

The current main product is the TUI campaign:

- real system Vim
- sandboxed level files
- post-run evaluation based on final text + final cursor
- approximate move counting from `vim -W` keylogs
- optional technique-gated levels via `required_sequences`

The browser prototype exists only as a legacy sample.

## Architecture

### CLI / TUI mainline

Entry:

- `src/cli.js`

Core modules:

- `src/tui/prompt.js`
  - terminal prompt helper
- `src/tui/renderers.js`
  - menu, level detail, and result rendering
- `src/tui/levelLoop.js`
  - per-level interaction flow
- `src/tui/vimSession.js`
  - sandbox creation, `setup.vim` generation, system Vim launch
- `src/tui/evaluate.js`
  - keylog parsing and result evaluation
- `src/tui/progressStore.js`
  - `~/.vim-breach-lab/progress.json` persistence

Level flow:

1. `buildSandbox()` creates a temp directory and writes the level file, metadata, keylog path, and `setup.vim`
2. `setup.vim` opens a read-only scratch help window above the training buffer
3. the player edits in real Vim
4. `Q` / `ZZ` exits through the custom quit path
5. the app reads final buffer text, cursor position, and keylog
6. `evaluateResult()` grades the run

### Shared game data

- `src/game/levels/`
  - level definitions split by chapter/theme
- `src/game/levels/index.js`
  - aggregates all chapter files
- `src/game/levels.js`
  - compatibility re-export
- `src/game/diff.js`
  - line diff utility shared by TUI and browser prototype

### Legacy browser prototype

- `index.html`
- `server.js`
- `src/main.js`
- `src/game/vimEngine.js`
- `src/game/storage.js`

This path is not the current product focus. Prefer preserving behavior unless explicitly asked to work on it.

## Level Data Rules

Each level object is expected to define:

- `id`
- `chapter`
- `title`
- `snippet`
- `cursor_start`
- `goal_description`
- `concept_tags`
- `par_moves`
- `recommended_solution`
- `target_state.text`
- `target_state.cursor`

Optional but commonly used:

- `required_sequences`
- `hints`
- `guided_tip`

Important semantics:

- passing the task means `target_state.text` and `target_state.cursor` both match
- technique training is separate; `required_sequences` can fail even when the task itself is completed
- `par_moves` should be checked carefully against the actual recommended solution token count

## Keylog / Evaluation Notes

`src/tui/evaluate.js` currently does two jobs:

- parse raw `vim -W` byte logs
- evaluate text, cursor, technique, and grade

Important behavior:

- Vim special-key triplets beginning with `0x80` are ignored
- known quit suffixes are stripped from scored moves
- grades are based on scored moves only

When changing level recommendations or adding new key-heavy features, verify that:

- display formatting still makes sense in result output
- required sequences match what the parser actually emits

## Testing Guidance

There are two test layers:

- `tests/evaluate.test.js`
  - pure evaluation / keylog tests
- `tests/vimSession.test.js`
  - real system Vim integration tests

When adding or changing levels:

- add at least one evaluation test if the change affects technique rules or key parsing
- add or update a Vim integration test when introducing a new kind of action or motion

## Editing Guidance

- Prefer small, behavior-preserving refactors.
- Keep TUI behavior stable unless the task explicitly changes UX.
- When updating levels, keep course order intentional. This repo is curriculum-driven, not just a bag of examples.
- If a recommended solution is not actually the cleanest route, update the level data rather than explaining around a bad default.

## Current Refactor State

Recent structural changes already landed:

- `src/game/levels.js` was split into themed files under `src/game/levels/`
- `src/cli.js` was reduced to a thin entrypoint
- rendering and level flow moved into `src/tui/renderers.js` and `src/tui/levelLoop.js`

Prefer extending that structure rather than collapsing code back into the old large files.
