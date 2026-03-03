# FileTree Explorer

Internal React module for loading JSON file-tree structures, browsing nested folders/files, and opening node details.

## Run

```bash
npm install
npm run dev
```

## Stack

- React 19 (compatible with React 18+ requirement)
- TypeScript (strict mode enabled in `tsconfig.app.json`)
- React Router v6 (`react-router-dom`)
- Vite
- Plain CSS (custom responsive UI)

## Implemented Features

- `/` import page:
  - paste JSON
  - upload `.json` file
  - sample JSON shortcut
  - when a tree is already loaded, textarea is prefilled with current JSON
- `/tree` tree explorer:
  - recursive expand/collapse folders
  - links to node details
  - full-tree search by name
  - results include full root-based path
- `/tree/:nodePath` node details:
  - file details: name, formatted size, full path
  - folder details: name, direct child count, total subtree file size, children links
- Refresh persistence:
  - loaded tree persisted in `localStorage`
  - returning from `/tree` to `/` shows the persisted tree JSON in textarea
  - search query persisted in URL query string (`/tree?q=...`)

## Architectural Decisions

- Centralized tree state in `TreeDataContext`:
  - single source of truth for loaded tree across all routes
  - localStorage hydration and persistence in one place
- Strong runtime validation (`src/utils/tree.ts`):
  - input is user-provided JSON, so runtime checks are required beyond TypeScript types
  - root must be a folder; files require numeric `size`; folders require `children`
- Path model:
  - internal node paths are stored relative to root (`src/components/Button.tsx`)
  - route segment uses URL-safe encoding so deep paths still fit `/tree/:nodePath`
  - helper functions isolate path encode/decode and display path formatting
- Recursive rendering component (`TreeNodeItem`):
  - simple, predictable rendering for arbitrarily deep tree depth
  - expand/collapse state handled as `Set<string>` of expanded folder paths

## With More Time

- Add automated tests:
  - unit tests for validation, indexing, search, and size aggregation
  - component tests for routing and expand/collapse behavior
- Improve UX for very large trees:
  - virtualized rendering
  - debounced search input
  - lazy subtree loading in UI
- Add import/export improvements:
  - drag-and-drop upload
  - JSON schema preview before load
  - option to download currently loaded tree snapshot
- Better accessibility

## Known Limitations

- Search is substring-based and case-insensitive; no fuzzy ranking.
- Expand/collapse UI state is not persisted after refresh (tree and search are persisted).
- Very large JSON trees may affect performance due to full recursive render and full-tree search on each query change.