#!/usr/bin/env node
import { createProjectGraphAsync, readCachedProjectGraph } from "@nx/devkit";
import path from "path";
import process from "process";

// Get the project name from the command line arguments
const projectName = process.argv[2];

if (!projectName) {
  console.error("Error: Project name argument is required.");
  console.error("Usage: node scripts/get-app-path.mjs <project-name>");
  process.exit(1);
}

async function getProjectGraph() {
  try {
    // First try to read from cache
    return readCachedProjectGraph();
  } catch (_error) {
    // If cache fails, create a new project graph
    return await createProjectGraphAsync();
  }
}

try {
  const projectGraph = await getProjectGraph();
  const projectNode = projectGraph.nodes[projectName];

  if (!projectNode) {
    console.error(
      `Error: Project '${projectName}' not found in the Nx project graph.`,
    );
    process.exit(1);
  }

  // The project configuration data is nested within the node
  const projectRoot = projectNode.data?.root; // Access the root property

  if (projectRoot === undefined || projectRoot === null) {
    console.error(
      `Error: Could not find the 'root' property for project '${projectName}' in the project graph data.`,
    );
    process.exit(1);
  }

  // Output the root path to stdout
  console.log(path.normalize(projectRoot));

  process.exit(0);
} catch (error) {
  console.error(
    `Error reading project graph or finding project '${projectName}':`,
  );
  if (error.message) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}
