import {
  type ExecutorContext,
  createProjectGraphAsync,
  detectPackageManager,
  getPackageManagerCommand,
  joinPathFragments,
  logger,
  output,
  readJsonFile,
  workspaceRoot,
} from "@nx/devkit";
import { type ChildProcess, spawn } from "child_process";
import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import type { DevExecutorSchema } from "./schema";

interface FederationConfig {
  devPort: number;
  remotes?: Record<string, { devPort: number; watchPath?: string }>;
  exposes?: Record<string, string>;
}

interface PackageJson {
  name: string;
  federation?: FederationConfig;
  dependencies?: Record<string, string>;
}

export default async function runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const projectName = context.projectName;

  if (!projectName) {
    output.error({ title: "No project name provided" });
    return { success: false };
  }

  const project = context.projectsConfigurations?.projects[projectName];

  if (!project) {
    output.error({ title: `Project ${projectName} not found` });
    return { success: false };
  }

  const projectRoot = project.root;

  const packageJsonPath = joinPathFragments(
    workspaceRoot,
    projectRoot,
    "package.json",
  );
  const packageJson = readJsonFile<PackageJson>(packageJsonPath);
  const federation = packageJson.federation;

  if (!federation) {
    output.error({
      title: "No federation config found",
      bodyLines: [
        `Project ${projectName} does not have a federation config in package.json`,
      ],
    });
    return { success: false };
  }

  const pm = detectPackageManager();
  const pmc = getPackageManagerCommand(pm);

  const processes: ChildProcess[] = [];

  const remotesToStart = getRemotesToStart(options, federation);

  output.log({
    title: `Starting ${projectName} dev server`,
    bodyLines: [
      `Port: ${federation.devPort}`,
      `Remotes: ${remotesToStart.length > 0 ? remotesToStart.join(", ") : "none"}`,
      `Watching deps: ${options.watchDeps !== false}`,
    ],
  });

  // Start remotes in parallel
  for (const remote of remotesToStart) {
    const remoteProcess = startRemote(remote, pmc, options.debug ?? false);
    if (remoteProcess) {
      processes.push(remoteProcess);
    }
  }

  // Start dependency watcher
  if (options.watchDeps !== false) {
    const watcherProcess = await startDepWatcher(projectName, pmc, context);
    if (watcherProcess) {
      processes.push(watcherProcess);
    }
  }

  // Start main vite dev server
  const viteProcess = startVite(projectRoot, pmc);
  processes.push(viteProcess);

  // Cleanup handler
  const cleanup = () => {
    logger.info("Shutting down dev servers...");
    for (const p of processes) {
      if (!p.killed) {
        p.kill("SIGTERM");
      }
    }
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  return new Promise((resolve) => {
    viteProcess.on("close", (code) => {
      cleanup();
      resolve({ success: code === 0 });
    });
  });
}

function getRemotesToStart(
  options: DevExecutorSchema,
  federation: FederationConfig,
): string[] {
  // If remotes explicitly provided (even empty array), use that
  if (options.remotes !== undefined) {
    return options.remotes;
  }

  if (!federation.remotes) {
    return [];
  }

  // Map remote federation names to package names
  // sm-navigation-sidebar -> @bsport/sm-navigation-sidebar
  return Object.keys(federation.remotes).map((name) => `@bsport/${name}`);
}

function startRemote(
  packageName: string,
  pmc: ReturnType<typeof getPackageManagerCommand>,
  debug: boolean,
): ChildProcess | null {
  logger.info(`Starting remote: ${packageName}`);

  const proc = spawn(pmc.exec, ["nx", "run", `${packageName}:dev:single`], {
    cwd: workspaceRoot,
    stdio: debug ? "inherit" : ["ignore", "ignore", "pipe"],
    shell: true,
  });

  if (!debug && proc.stderr) {
    proc.stderr.on("data", (data: Buffer) => {
      output.error({
        title: `Error from ${packageName}`,
        bodyLines: [data.toString().trim()],
      });
    });
  }

  proc.on("error", (err) => {
    output.error({
      title: `Failed to start ${packageName}`,
      bodyLines: [err.message],
    });
  });

  return proc;
}

async function getAllDependencies(
  projectName: string,
  context: ExecutorContext,
): Promise<string[]> {
  const graph = await createProjectGraphAsync();
  const visited = new Set<string>();
  const queue = [projectName];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = graph.dependencies[current] || [];
    for (const dep of deps) {
      // Only include workspace projects (those starting with @bsport/)
      if (!visited.has(dep.target) && dep.target.startsWith("@bsport/")) {
        queue.push(dep.target);
      }
    }
  }

  visited.delete(projectName); // Remove the project itself
  return Array.from(visited);
}

async function startDepWatcher(
  projectName: string,
  pmc: ReturnType<typeof getPackageManagerCommand>,
  context: ExecutorContext,
): Promise<ChildProcess | null> {
  output.note({
    title: "Dependency watcher started",
    bodyLines: ["Changes to workspace dependencies will trigger rebuilds"],
  });

  // Get all transitive dependencies
  const allDeps = await getAllDependencies(projectName, context);
  const projectsToWatch = [projectName, ...allDeps].join(",");

  logger.info(`[watch] Watching ${allDeps.length + 1} projects`);

  // Create a temporary script file to handle the build command
  // This avoids shell quoting issues and allows us to derive project from file changes
  const scriptPath = join(tmpdir(), `nx-watch-${Date.now()}.sh`);
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
    "",
  ].join("\n");
  writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

  const watchCmd = `${pmc.exec} nx watch --projects=${projectsToWatch} -- ${scriptPath}`;

  const proc = spawn(watchCmd, {
    cwd: workspaceRoot,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  // Clean up script file on process exit
  proc.on("close", () => {
    try {
      require("fs").unlinkSync(scriptPath);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  proc.stdout?.on("data", (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) {
      logger.info(`[watch] ${msg}`);
    }
  });

  proc.stderr?.on("data", (data: Buffer) => {
    logger.warn(`[watch] ${data.toString().trim()}`);
  });

  return proc;
}

function startVite(
  projectRoot: string,
  pmc: ReturnType<typeof getPackageManagerCommand>,
): ChildProcess {
  output.success({
    title: "Starting Vite dev server",
  });

  const proc = spawn(pmc.exec, ["vite"], {
    cwd: joinPathFragments(workspaceRoot, projectRoot),
    stdio: "inherit",
    shell: true,
  });

  return proc;
}
