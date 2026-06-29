# Visual Query Builder

A schema-driven, recursive visual query builder built with Next.js (App Router), TypeScript, Zustand, Tailwind CSS v4, and DnD Kit. Users construct complex, deeply nested filter logic through a graphical interface, with real-time SQL and MongoDB query generation, live execution simulation against a mock dataset, and a full suite of advanced interaction features.

**Live demo:** [your-vercel-url-here]
**Demo video:** [link here]

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Recursive Rendering Strategy](#recursive-rendering-strategy)
- [State Management](#state-management)
- [Query Engine Design](#query-engine-design)
- [Validation Engine](#validation-engine)
- [Performance Optimization](#performance-optimization)
- [Advanced Interactions](#advanced-interactions)
- [Testing](#testing)
- [Trade-offs and Known Limitations](#trade-offs-and-known-limitations)
- [Getting Started](#getting-started)

---

## Architecture Overview

The application is built around a single core data structure: a recursive **query tree**. Every other system in the app — the UI, the query generators, the filter engine, and the validator — is a function that either *reads* this tree or *produces a new version* of it.

src/

├── app/                  # Next.js App Router pages

├── components/builder/   # All query builder UI components

├── store/                # Zustand store (single source of truth)

├── types/                # Core TypeScript types (Rule, Group, Schema, etc.)

├── lib/

│   ├── generators/       # SQL and MongoDB query generators

│   ├── schema/           # Schema definitions and field/operator helpers

│   ├── validateTree.ts   # Validation engine

│   ├── filterDataset.ts  # Query execution simulator

│   └── exportImport.ts   # JSON export/import logic

├── data/                 # Mock dataset for simulated execution

└── tests/            # Unit tests (Vitest)

This separation keeps each concern isolated and independently testable: the query generators don't know about React, the store doesn't know about SQL syntax, and the UI doesn't know how filtering works internally.

---

## Recursive Rendering Strategy

A query is modeled as a tree of two node types:

```typescript
type Rule = {
  id: string
  type: "rule"
  field: string
  operator: Operator
  value: RuleValue
}

type Group = {
  id: string
  type: "group"
  logic: "AND" | "OR"
  children: (Rule | Group)[]
}
```

A `Group`'s `children` array can contain either `Rule` nodes or other `Group` nodes — this is what allows unlimited nesting depth.

The `GroupBlock` component renders this recursively: for each child, if it's a `Rule`, it renders a `RuleRow`; if it's a `Group`, it renders **another `GroupBlock`**. This single recursive call is what gives the UI the ability to render groups nested inside groups inside groups, to any depth, with no special-casing required.

This exact recursive pattern — *check the node type, handle a Rule directly, recurse into Groups* — is reused consistently across the codebase:

- **UI rendering** (`GroupBlock.tsx`)
- **SQL generation** (`sqlGenerator.ts`)
- **MongoDB generation** (`mongoGenerator.ts`)
- **Dataset filtering** (`filterDataset.ts`)
- **Validation** (`validateTree.ts`)
- **Tree mutation helpers in the store** (`addChildToGroup`, `removeNodeFromTree`, etc.)

Keeping this pattern consistent across every layer made the codebase predictable: once you understand the recursion in one file, you understand it in all of them.

---

## State Management

All application state for the query tree lives in a single Zustand store (`src/store/queryStore.ts`). The tree itself is treated as **immutable** — every mutation (`addRule`, `addGroup`, `removeNode`, `updateRule`, `reorderChildren`, etc.) walks the tree recursively and returns a **brand new tree** with the relevant node added, removed, or updated, rather than mutating the existing object in place.

Example — adding a rule to a target group:

```typescript
function addChildToGroup(tree: Group, groupId: string, newChild: QueryNode): Group {
  if (tree.id === groupId) {
    return { ...tree, children: [...tree.children, newChild] }
  }
  return {
    ...tree,
    children: tree.children.map((child) =>
      child.type === "group" ? addChildToGroup(child, groupId, newChild) : child
    ),
  }
}
```

This immutability is what makes the **query history** feature possible: every structural change (add/remove) pushes the *previous* tree onto a history stack before applying the change, so any past state can be restored by simply swapping the tree back in.

Beyond the tree itself, the store also holds:
- **History** — a stack of up to 10 previous tree snapshots
- **Presets** — named, saved trees the user can reload later
- **Theme** — light/dark mode preference

---

## Query Engine Design

Two generator modules translate the tree into real query syntax:

- **`sqlGenerator.ts`** — produces a `SELECT * FROM users WHERE ...` string
- **`mongoGenerator.ts`** — produces a MongoDB-style filter object using `$and`, `$or`, `$gt`, `$lt`, `$regex`, etc.

Both generators share the same recursive shape: a function that handles a single `Rule` (mapping its operator to the correct syntax), and a function that handles a `Group` (recursively generating each child, then joining them with the group's logic operator). Both update live as the user builds their query, via React state subscriptions to the Zustand store.

---

## Validation Engine

`validateTree.ts` walks the tree and returns a flat list of `{ nodeId, message }` errors, which the UI matches back to the specific rule or group that caused them and displays inline.

Two layers of protection work together:
1. **UI-level prevention** — the operator dropdown for each rule is dynamically filtered based on the selected field's type (via `getOperatorsForField`), so it's structurally impossible to select an invalid operator/field combination (e.g. "contains" on a number field) through the interface.
2. **Validator-level safety net** — catches edge cases the UI can't prevent: empty fields, empty values, empty groups, and malformed imported JSON.

---

## Performance Optimization

With deep nesting and many rules, naive re-rendering would cause every component in the tree to re-render on any single change. Three techniques address this:

1. **`React.memo`** on `GroupBlock` and `RuleRow` — these only re-render when their own props actually change, so editing one rule doesn't cascade re-renders through sibling rules or unrelated branches of the tree.
2. **`useMemo`** for derived values — SQL generation, MongoDB generation, dataset filtering, and validation all recompute only when the tree itself changes, not on every render.
3. **Stable keys** — every node uses its persistent `id` as the React key, so list reconciliation (especially during drag-and-drop reordering) is efficient and doesn't unnecessarily remount components.

---

## Advanced Interactions

- **Collapsible groups** — local component state (`useState`) toggles a smooth height/opacity transition, hiding a group's contents while showing a summary count.
- **Drag-and-drop reordering** — built with `@dnd-kit`. Each child has a dedicated drag handle (separate from its interactive content) to avoid drag listeners intercepting clicks/typing within form fields.
- **Query history** — every structural change snapshots the previous tree (capped at 10 entries) for undo/restore.
- **Saved presets** — named tree snapshots persisted in the store, loadable at any time.
- **Export/Import JSON** — exports the tree as a downloadable `.json` file; imports validate the file's basic shape before accepting it, rejecting malformed or unrelated JSON.
- **Keyboard shortcuts** — Ctrl/Cmd+Z (undo), Ctrl/Cmd+Shift+R (add rule), Ctrl/Cmd+Shift+G (add group).
- **Dark/light mode** — a `dark` class toggled on the root `<html>` element, with Tailwind v4's `@custom-variant dark` driving all `dark:` utility classes throughout the app.
- **Animated transitions** — new rules/groups fade and slide in on mount; collapsing groups animate height and opacity smoothly rather than snapping.

---

## Testing

The test suite (Vitest) focuses on business logic rather than UI snapshots, since the recursive logic is where correctness actually matters:

- **`sqlGenerator.test.ts`** — verifies correct SQL output for empty trees, single rules, AND/OR joining, and nested groups
- **`mongoGenerator.test.ts`** — equivalent coverage for MongoDB query objects
- **`validateTree.test.ts`** — confirms empty fields, empty values, and empty groups are correctly flagged
- **`queryStore.test.ts`** — exercises every core store action (add/remove/update/reorder/preset/undo) against the actual Zustand store
- **`filterDataset.test.ts`** — confirms AND/OR logic and nested-group filtering produce correct result sets against mock data

**30 tests, all passing**, covering every recursive logic path in the application.

---

## Trade-offs and Known Limitations

- **Visual indentation at extreme nesting depth.** Each nested group adds a fixed left margin. At very deep nesting (8+ levels), this pushes content toward the edge of the viewport. This was a deliberate trade-off — the underlying logic supports genuinely unlimited nesting, but we chose not to add indentation-capping logic since real-world query trees rarely nest beyond 3-4 levels.
- **Value type coercion.** Input values are stored as strings from HTML form inputs, even for fields typed as numbers. The generators and filter engine coerce types at evaluation time, which works correctly but means raw stored values aren't strictly typed end-to-end.
- **Schema is currently hardcoded.** The app ships with a single example schema (a `users` table). The architecture supports swapping in any schema, but there's currently no UI for the user to define or upload their own schema at runtime.
- **History is session-only.** Query history, presets, and theme preference are not persisted to local storage or a database — refreshing the page resets the session.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run tests:
```bash
npx vitest run
```

Type-check:
```bash
npx tsc --noEmit
```

