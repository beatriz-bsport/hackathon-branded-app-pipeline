import type { Command } from "commander";

import { getProjectsDependencies } from "@bsport/typescript-monorepo-utils";

enum FormatType {
  JSON = "json",
  TEXT = "text",
  MARKDOWN = "markdown",
}

/**
 * Runs the command.
 */
async function action(options: {
  format: FormatType;
  projects?: string;
  onlyDependencies?: boolean;
  onlyUsedBy?: boolean;
}) {
  const projects = await getProjectsDependencies(
    options?.projects?.split(","),
  ).then((projects) => {
    if (options.onlyDependencies) {
      Object.entries(projects).forEach(([project, { dependencies }]) => {
        projects[project] = { dependencies, usedBy: undefined };
      });
    }
    if (options.onlyUsedBy) {
      Object.entries(projects).forEach(([project, { usedBy }]) => {
        projects[project] = { dependencies: undefined, usedBy };
      });
    }
    return projects;
  });

  console.log(formatOutput(projects, options));
}

function formatOutput(
  projects: { [key: string]: { dependencies?: string[]; usedBy?: string[] } },
  options: Parameters<typeof action>[0],
): string {
  switch (options.format) {
    case FormatType.JSON:
      return JSON.stringify(projects, null, 2);
    case FormatType.TEXT: {
      let result = "";
      const maxNameLength = Object.keys(projects).reduce(
        (acc, project) => Math.max(acc, project.length),
        0,
      );
      Object.entries(projects).forEach(
        ([project, { dependencies, usedBy }], index) => {
          result += `${project}\n\n`;
          if (usedBy) {
            result += `  Used by:${!usedBy.length ? " -" : ""}\n`;
            usedBy.forEach((project) => {
              result += `  - ${project}\n`;
            });
          }
          if (dependencies) {
            result += `  Dependencies:${!dependencies.length ? " -" : ""}\n`;
            dependencies.forEach((project) => {
              result += `  - ${project}\n`;
            });
          }
          if (index < Object.keys(projects).length - 1) {
            result += "\n" + "-".repeat(maxNameLength) + "\n\n";
          }
        },
      );
      return result;
    }
    case FormatType.MARKDOWN: {
      let result = "";
      Object.entries(projects).forEach(
        ([project, { dependencies, usedBy }]) => {
          result += `## \`${project}\`\n`;
          if (usedBy) {
            result += `\n**Used by:**${!usedBy.length ? " none" : ""}\n\n`;
            usedBy.forEach((project) => {
              result += `- \`${project}\`\n`;
            });
            if (usedBy.length) result += "\n";
          }
          if (dependencies) {
            result += `**Dependencies:**${
              !dependencies.length ? " none" : ""
            }\n\n`;
            dependencies.forEach((project) => {
              result += `- \`${project}\`\n`;
            });
            if (dependencies.length) result += "\n";
          }
        },
      );
      return result;
    }
  }
}

export default function projectDependenciesList(program: Command) {
  program
    .command("project:dependencies:list")
    .description(
      "List for a list of projects their monorepo dependencies and which monorepo projects are using them.",
    )
    .option(
      "-p, --projects <project-names>",
      "Project names to list dependencies for (as comma separated string). If empty, list all projects.",
    )
    .option("-d, --only-dependencies", "Only list dependencies.", false)
    .option(
      "-u, --only-used-by",
      "Only list projects that use the project.",
      false,
    )
    .option(
      "-f, --format <format>",
      `format of the output. Available options: ${Object.values(
        FormatType,
      ).join(", ")}`,
      FormatType.TEXT,
    )
    .action(action);
  return program;
}
