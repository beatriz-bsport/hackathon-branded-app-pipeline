import chokidar from "chokidar";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(DOCS_ROOT, "..", "..");

const KAIZEN_COMPONENTS = path.join(
  REPO_ROOT,
  "packages",
  "design-system",
  "kaizen",
  "primitive",
  "core",
  "src",
  "components",
);

let pending = null;

function runBuild() {
  if (pending) clearTimeout(pending);
  pending = setTimeout(() => {
    const child = spawn(
      process.execPath,
      [path.join(HERE, "extract-props.mjs")],
      { cwd: DOCS_ROOT, stdio: "inherit" },
    );
    child.on("error", (error) => console.error(error));
  }, 200);
}

runBuild();

const watcher = chokidar.watch(
  path.join(KAIZEN_COMPONENTS, "**/*.tsx"),
  { ignoreInitial: true },
);

watcher.on("add", runBuild);
watcher.on("change", runBuild);
watcher.on("error", (error) => console.error("[watch] error:", error));
console.log("[watch-props] watching Kaizen primitive component sources");
