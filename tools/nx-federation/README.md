# @bsport/nx-federation

Nx plugin for Module Federation development workflow in Studio Manager apps.

## Features

- **Auto-detect remotes**: Automatically reads `federation.remotes` from `package.json` and starts them
- **Dependency watching**: Uses `nx watch` to rebuild workspace dependencies (`@bsport/*` packages) when they change
- **Nx-native utilities**: Built with `@nx/devkit` for proper integration with Nx ecosystem
- **Graceful error handling**: Remote failures show errors but don't block the main app development
- **Inferred targets**: Automatically creates `dev-mfe` and `dev-mfe:single` targets for all SM apps

## Problem It Solves

### Before

- Manual remote management via shell scripts
- No automatic dependency rebuilding
- Complex `concurrently` setups in each app
- Manual port management

### After

- Single `nx run` command
- Automatic remote detection from federation config
- Automatic dependency watching and rebuilding
- Unified development experience

## Usage

### Run a Studio Manager app with auto-detected remotes

```bash
npx nx dev-mfe @bsport/sm-giftcard
```

This will:

1. Read `federation.remotes` from the app's `package.json`
2. Start each remote in the background (e.g., `sm-navigation-sidebar`)
3. Watch workspace dependencies and rebuild them when they change
4. Start the main app's Vite dev server

### Run standalone (no remotes)

```bash
npx nx dev-mfe @bsport/sm-giftcard --remotes=
```

### Run with debug output (show all remote logs)

```bash
npx nx dev-mfe @bsport/sm-giftcard --debug
```

### Disable dependency watching

```bash
nx dev-mfe @bsport/sm-giftcard --watchDeps=false
```

### Run the host with all remotes

```bash
nx dev-mfe @bsport/sm-host
```

This will start all 18+ remote apps defined in the host's `federation.remotes`.

## How It Works

### 1. Plugin (Inferred Targets)

The plugin uses Nx's `createNodesV2` API to automatically infer targets for apps with `federation.devPort` in their `package.json`:

- `dev-mfe`: Uses the custom executor with remote detection and dep watching
- `dev-mfe:single`: Runs vite directly (for use by other apps as a remote)

### 2. Executor

The executor (`@bsport/nx-federation:dev`) does the following:

1. **Read federation config** from `package.json`
2. **Determine remotes to start**:
   - Auto-detect from `federation.remotes` (default)
   - Or use `--remotes` flag to override
3. **Start remotes in parallel** using `pnpm exec nx run <remote>:dev-mfe:single`
4. **Start dependency watcher** (if enabled):
   - Traverses the Nx project graph to find all transitive `@bsport/*` dependencies
   - Creates a temporary bash script to handle build triggers
   - Starts `nx watch --projects=<app-and-all-deps>` to monitor file changes
   - When a file changes, derives the affected project and runs `nx run <project>:build`
   - Nx cache ensures unchanged dependencies are instant cache hits
5. **Start main Vite dev server**
6. **Handle cleanup** on exit (SIGINT/SIGTERM)

## Technical Decisions & Challenges

This section documents the technical challenges encountered while building the dependency watcher and the reasoning behind our solutions. This context helps future maintainers understand why certain approaches were chosen.

### Challenge 1: Dependency Rebuild Strategy

**Problem:** When a library like `@bsport/kaizen-primitive-core` changes, we need to rebuild only that library—not all its upstream dependencies or unrelated packages.

**Initial Approach:**

```bash
nx watch --projects=<app> --includeDependentProjects -- nx run-many -t build -p $NX_PROJECT_NAME
```

**Issues Encountered:**

1. **Cascading Builds:** Due to `dependsOn: ["^build"]` in `nx.json`, running `nx run-many -t build` triggered builds for all upstream dependencies, even unchanged ones. A simple change to `kaizen-primitive-core` would rebuild `currency`, `datetime-formatting`, `i18n`, and many other unrelated packages.

2. **`--no-dependencies` Flag:** Adding this flag broke builds when dependencies weren't pre-built, as it skipped necessary upstream builds entirely.

3. **`nx affected` Approach:** Using `nx affected -t build --files=$NX_FILE_CHANGES` didn't detect changes because `nx affected` compares against a git base branch, not the current file system state.

**Final Solution:**

1. Use `createProjectGraphAsync()` from `@nx/devkit` to traverse all transitive dependencies
2. Filter to only `@bsport/*` packages (excludes external deps like `react`, `lodash`, etc.)
3. Watch those specific projects (~29 for a typical SM app vs 800+ with `--all`)
4. Use `nx show projects --affected --files=$NX_FILE_CHANGES` to determine which project actually changed
5. Run `nx run <changed-project>:build` — Nx cache handles dependencies automatically

**Result:** When you change `@bsport/kaizen-primitive-core`:

- Only that library rebuilds
- Its 7 upstream dependencies hit the cache (instant)
- Unrelated packages are not touched
- Typical output: `Nx read the output from the cache instead of running the command for 7 out of 8 tasks`

---

### Challenge 2: Shell Variable Expansion

**Problem:** `nx watch` sets environment variables (`$NX_PROJECT_NAME`, `$NX_FILE_CHANGES`) that need to be passed to the build command, but Node.js `spawn()` doesn't expand shell variables.

**Attempts:**

1. **Array Arguments:**

   ```typescript
   spawn(pmc.exec, ["nx", "run", "$NX_PROJECT_NAME:build"]);
   ```

   **Result:** `$NX_PROJECT_NAME` passed literally, not expanded. Error: "Both project and target have to be specified"

2. **Inline `sh -c`:**

   ```typescript
   spawn("sh", ["-c", `${pmc.exec} nx run $NX_PROJECT_NAME:build`]);
   ```

   **Result:** Quoting issues with `pnpm exec` (contains a space). Output showed pnpm help instead of running the command.

3. **Single Command String:**

   ```typescript
   spawn(
     `${pmc.exec} nx watch ... -- sh -c '${pmc.exec} nx run $NX_PROJECT_NAME:build'`,
     { shell: true },
   );
   ```

   **Result:** Same quoting issues—nested quotes with shell expansion proved unreliable.

**Final Solution:** Write a temporary bash script to disk:

```typescript
const scriptContent = [
  "#!/bin/bash",
  `cd "${workspaceRoot}"`,
  "",
  "# Derive the project name from the changed files",
  `PROJECT=$(${pmc.exec} nx show projects --affected --files=$NX_FILE_CHANGES 2>/dev/null | head -n 1)`,
  "",
  'if [ -n "$PROJECT" ]; then',
  '  echo "Building: $PROJECT"',
  `  ${pmc.exec} nx run "$PROJECT:build"`,
  "fi",
].join("\n");

writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
```

Then execute via:

```bash
npx nx watch --projects=<deps> -- /tmp/nx-watch-<timestamp>.sh
```

**Why This Works:**

- Bash script handles variable expansion natively
- No nested quoting issues
- Script is cleaned up on process exit
- Array-style string building keeps the script readable and maintainable

---

### Challenge 3: `$NX_PROJECT_NAME` Empty When Watching Specific Projects

**Problem:** When using `nx watch --projects=<specific-projects>` (not `--all`), the `$NX_PROJECT_NAME` environment variable is empty. Only `$NX_FILE_CHANGES` is populated.

**Discovery:** Testing revealed:

```bash
NX_PROJECT_NAME is: []
NX_FILE_CHANGES is: [packages/design-system/kaizen/primitive/core/src/index.ts]
```

**Solution:** Derive the project name from the file changes using:

```bash
PROJECT=$(pnpm exec nx show projects --affected --files=$NX_FILE_CHANGES | head -n 1)
```

This queries Nx's project graph to determine which project owns the changed file.

---

### Challenge 4: `--includeDependentProjects` Semantics

**Problem:** The flag name is misleading. `--includeDependentProjects` watches projects that **depend ON** the specified project, not the project's **dependencies**.

**Example:**

- `pnpm exec nx watch --projects=@bsport/sm-giftcard --includeDependentProjects`
- Watches: `sm-giftcard` and any projects that depend on it (none, typically)
- Does NOT watch: `kaizen-primitive-core`, `currency`, etc. (the actual dependencies)

**Solution:** Manually build the list of projects to watch by traversing the dependency graph:

```typescript
async function getAllDependencies(projectName: string): Promise<string[]> {
  const graph = await createProjectGraphAsync();
  const visited = new Set<string>();
  const queue = [projectName];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = graph.dependencies[current] || [];
    for (const dep of deps) {
      // Only include workspace projects
      if (dep.target.startsWith("@bsport/")) {
        queue.push(dep.target);
      }
    }
  }

  visited.delete(projectName);
  return Array.from(visited);
}
```

This gives us the app plus all its transitive `@bsport/*` dependencies to watch.

---

### Design Decision: Array-Style Script Content

**Problem:** The bash script content was initially a template string with escape characters (`\$`), making it hard to read and maintain.

**Options Considered:**

1. **Template String:** Hard to read, escape-heavy
2. **External File + Templating:** Clean but requires build configuration to copy assets
3. **Array Join:** Each line is a separate string, joined with newlines

**Chosen Approach:** Array join for inline maintainability:

```typescript
const scriptContent = [
  "#!/bin/bash",
  `cd "${workspaceRoot}"`,
  "",
  "# Comment explaining the next line",
  `ACTUAL_COMMAND_HERE`,
].join("\n");
```

**Benefits:**

- Each line is readable
- No escape character confusion
- Easy to add/remove/reorder lines
- Interpolation only where needed (backtick lines)
- Can be migrated to external template file later if needed

## Architecture

```
tools/nx-federation/
├── package.json              # Plugin metadata
├── tsconfig.json             # TypeScript config
├── executors.json            # Executor registry
└── src/
    ├── index.ts              # Plugin entry point
    ├── plugin.ts             # createNodesV2 implementation
    └── executors/
        └── dev/
            ├── executor.ts   # Main executor logic
            ├── schema.json   # Options schema
            └── schema.d.ts   # TypeScript types

# Runtime (temporary)
/tmp/nx-watch-<timestamp>.sh  # Generated build script (cleaned up on exit)
```

## Configuration

The plugin is registered in `nx.json`:

```json
{
  "plugins": [
    {
      "plugin": "@bsport/nx-federation",
      "options": {
        "devTargetName": "dev-mfe",
        "devSingleTargetName": "dev-mfe:single",
        "watchDeps": true
      }
    }
  ]
}
```

## Executor Options

| Option      | Type       | Default       | Description                                          |
| ----------- | ---------- | ------------- | ---------------------------------------------------- |
| `remotes`   | `string[]` | Auto-detected | Override remotes to start. Pass `[]` for standalone. |
| `watchDeps` | `boolean`  | `true`        | Watch workspace dependencies and rebuild on changes  |
| `debug`     | `boolean`  | `false`       | Show all output from remotes                         |

## Migration Guide

Currently, the plugin creates `dev-mfe` targets to avoid conflicts with existing `dev` npm scripts. To fully migrate:

### Option 1: Keep both (Recommended for gradual migration)

- Use `nx dev-mfe` for the new experience
- Keep `pnpm run dev` for the old experience
- Gradually migrate team members

### Option 2: Full migration

1. Remove `dev` and `dev:single` scripts from SM app `package.json` files
2. Update `nx.json` plugin options:

   ```json
   {
     "devTargetName": "dev",
     "devSingleTargetName": "dev:single"
   }
   ```

3. Run `pnpm exec nx reset` to regenerate project graph
4. Use `nx dev` instead of `nx dev-mfe`

## Troubleshooting

### Plugin not loading

```bash
# Reset Nx cache
pnpm exec nx reset

# Check if plugin is recognized
pnpm exec nx list
```

### Targets not appearing

Make sure:

1. The app has `federation.devPort` in its `package.json`
2. The app is in `apps/applications/studio-manager/` directory
3. You've run `pnpm install` after adding the plugin

### Port already in use

If you see "Port XXXX is already in use", make sure no other dev servers are running on that port.

## Examples

### Example 1: Develop sm-giftcard with navigation

```bash
pnpm exec nx dev-mfe @bsport/sm-giftcard
```

Output:

```
NX  Starting @bsport/sm-giftcard dev server
Port: 4150
Remotes: @bsport/sm-navigation-sidebar
Watching deps: true

Starting remote: @bsport/sm-navigation-sidebar
NX  Dependency watcher started
    Changes to workspace dependencies will trigger rebuilds
NX  Starting Vite dev server
  VITE v5.4.11  ready in 250 ms
  ➜  Local:   http://localhost:4150/
```

### Example 2: Develop standalone (no navigation)

```bash
pnpm exec nx dev-mfe @bsport/sm-giftcard --remotes=
```

### Example 3: Debug remote issues

```bash
pnpm nx dev-mfe @bsport/sm-giftcard --debug
```

This will show full output from all remotes, useful for debugging startup issues.

## Benefits

1. **DX Improvement**: Single command instead of complex shell scripts
2. **Auto-detection**: No manual remote configuration needed
3. **Dependency watching**: Automatic rebuilds when `@bsport/*` packages change
4. **Error visibility**: Clear error messages from remotes
5. **Nx integration**: Uses Nx project graph for dependency tracking
6. **Type-safe**: Built with TypeScript and `@nx/devkit`
7. **Maintainable**: Centralized logic instead of scattered scripts

## Future Enhancements

- [ ] Parallel remote startup with progress tracking
- [ ] Smart dependency detection using `projectGraph`
- [ ] Pre-build dependencies on first startup
- [ ] Configuration profiles (dev, debug, minimal)
- [ ] Integration with Nx task scheduling
