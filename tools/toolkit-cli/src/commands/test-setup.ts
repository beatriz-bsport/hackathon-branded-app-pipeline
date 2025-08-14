import type { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import { select as selectWithSearch } from "inquirer-select-pro";
import path from "path";

import {
  type PackageJson,
  getMonorepoBasePath,
  getProjectsPackageJsons,
} from "@bsport/typescript-monorepo-utils";

export default function testSetup(program: Command) {
  program
    .command("test:setup")
    .description(
      "Interactive setup for Vitest testing configuration in packages and tools",
    )
    .argument("[package-path]", "Optional package path or name to configure")
    .option(
      "--dry-run",
      "Show what would be generated without creating files",
      false,
    )
    .option("--force", "Overwrite existing configuration files", false)
    .option("--env <environment>", "Test environment: node|browser")
    .option("--react", "Include React Testing Library setup")
    .option("--msw", "Include MSW mock server setup")
    .option("--handlers", "Generate basic MSW handlers template")
    .option("-q, --quiet", "Suppress output except errors", false)
    .action(action);

  return program;
}

/**
 * Main command action
 */
async function action(
  packagePath?: string,
  options: {
    dryRun?: boolean;
    force?: boolean;
    quiet?: boolean;
    env?: "node" | "browser";
    react?: boolean;
    msw?: boolean;
    handlers?: boolean;
  } = {},
) {
  const print = (...args: string[]) => !options.quiet && console.log(...args);

  try {
    const monorepoBasePath = await getMonorepoBasePath();
    let selectedProject: ProjectWithAnalysis;

    // Get eligible projects
    const projects = await getEligibleProjects();

    if (projects.length === 0) {
      throw new Error(
        "No eligible projects found in packages/ or tools/ directories",
      );
    }

    // Select project
    if (packagePath) {
      selectedProject = projects.find(
        (p) => p.path === packagePath || p.name === packagePath,
      );

      if (!selectedProject) {
        throw new Error(`Project not found: ${packagePath}`);
      }
    } else {
      selectedProject = await selectWithSearch({
        message: "Select package to configure test setup:",
        multiple: false,
        options: (input?: string) => {
          return projects
            .filter((project) =>
              input
                ? project.name.toLowerCase().includes(input.toLowerCase()) ||
                  project.path.toLowerCase().includes(input.toLowerCase())
                : true,
            )
            .map((project) => ({
              name: formatProjectChoice(project),
              value: project,
              disabled: false,
            }));
        },
      });
    }

    // Check if already configured (unless force)
    if (selectedProject.analysis.hasExistingConfig && !options.force) {
      const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
        {
          type: "confirm",
          name: "proceed",
          message: `Package already has vitest.config.ts. Continue anyway?`,
          default: false,
        },
      ]);
      if (!proceed) {
        print("❌ Aborted");
        return;
      }
    }

    // Get configuration options
    let configOptions: TestSetupOptions;

    if (options.env) {
      // Non-interactive mode - use provided options
      configOptions = {
        environment: options.env,
        react: options.react ?? false,
        msw: options.msw ?? false,
        handlers: options.handlers ?? options.msw ?? false,
      };
    } else {
      // Interactive mode - prompt for options
      const { environment, react, msw, handlers } =
        await inquirer.prompt<TestSetupOptions>([
          {
            type: "list",
            name: "environment",
            message: "Test environment:",
            choices: [
              {
                name: "Browser (jsdom) - for React components, DOM testing",
                value: "browser",
              },
              {
                name: "Node.js - for utilities, server-side logic",
                value: "node",
              },
            ],
            default: selectedProject.analysis.suggestedEnv,
          },
          {
            type: "confirm",
            name: "react",
            message: "Include React Testing Library setup?",
            default: selectedProject.analysis.hasReact,
            when: (answers) => answers.environment === "browser",
          },
          {
            type: "confirm",
            name: "msw",
            message: "Include MSW mock server setup?",
            default: selectedProject.analysis.hasMsw,
          },
          {
            type: "confirm",
            name: "handlers",
            message: "Generate basic MSW handlers template?",
            default: true,
            when: (answers) => answers.msw,
          },
        ]);

      configOptions = {
        environment,
        react: react ?? false,
        msw,
        handlers: handlers ?? false,
      };
    }

    // Clean up answers for non-browser environment
    const finalOptions: TestSetupOptions = {
      environment: configOptions.environment,
      react:
        configOptions.environment === "browser" ? configOptions.react : false,
      msw: configOptions.msw,
      handlers: configOptions.handlers,
    };

    // Show summary
    print("\n📋 Configuration Summary:");
    print(`   Package: ${selectedProject.name} (${selectedProject.path})`);
    print(
      `   Environment: ${finalOptions.environment === "browser" ? "Browser (jsdom)" : "Node.js"}`,
    );
    if (finalOptions.react) {
      print("   React setup: Yes");
    }
    if (finalOptions.msw) {
      print("   MSW setup: Yes");
    }
    print("\n✅ Files to be created:");
    print("   - vitest.config.ts");
    print("   - package.json (updated with dependencies & scripts)");
    print(
      "   - src/__tests__/example.test." +
        (finalOptions.react ? "tsx" : "ts") +
        " (basic example test)",
    );
    if (finalOptions.react) {
      print("   - src/__tests__/setup.ts");
    }
    if (finalOptions.msw) {
      print("   - src/__tests__/msw-setup.ts");
    }
    if (finalOptions.handlers) {
      print("   - src/__tests__/mocks/handlers.ts");
    }
    if (options.dryRun) {
      print("\n🔍 Dry run mode - no files would be created");

      return;
    }

    if (!options.force) {
      const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
        {
          type: "confirm",
          name: "confirm",
          message: "Proceed with setup?",
          default: true,
        },
      ]);

      if (!confirm) {
        print("❌ Aborted");
        return;
      }
    }

    // Create files
    const projectAbsPath = path.join(monorepoBasePath, selectedProject.path);
    const testsDir = path.join(projectAbsPath, "src", "__tests__");
    const mocksDir = path.join(testsDir, "mocks");

    // Ensure directories exist
    await fs.ensureDir(testsDir);
    if (finalOptions.handlers) {
      await fs.ensureDir(mocksDir);
    }

    // Update package.json with dependencies and scripts
    await updatePackageJson(projectAbsPath, finalOptions);

    // Write vitest.config.ts
    await fs.writeFile(
      path.join(projectAbsPath, "vitest.config.ts"),
      await generateVitestConfig(finalOptions),
    );

    // Write example test file
    await fs.writeFile(
      path.join(
        testsDir,
        "example.test." + (finalOptions.react ? "tsx" : "ts"),
      ),
      await generateExampleTest(selectedProject.name, finalOptions),
    );

    // Write setup files
    if (finalOptions.react) {
      await fs.writeFile(
        path.join(testsDir, "setup.ts"),
        await generateReactSetup(),
      );
    }

    if (finalOptions.msw) {
      await fs.writeFile(
        path.join(testsDir, "msw-setup.ts"),
        await generateMswSetup(),
      );
    }

    if (finalOptions.handlers) {
      await fs.writeFile(
        path.join(mocksDir, "handlers.ts"),
        await generateMswHandlers(),
      );
    }

    print("\n🎉 Test setup completed successfully!");
    print(`\n📝 Next steps:`);
    print(`   1. Run 'pnpm install' to install new dependencies`);
    print(`   2. Run 'pnpm test' to verify the example test passes`);
    print(`   3. Create your actual tests in src/__tests__/`);
    if (finalOptions.msw && finalOptions.handlers) {
      print(
        `   4. Update src/__tests__/mocks/handlers.ts with your API endpoints`,
      );
    }
  } catch (err) {
    console.error("❌ Error while running test setup command");
    console.error(err);
    process.exit(1);
  }
}

interface PackageJsonWithNx extends PackageJson {
  nx?: {
    tags?: string[];
  };
}

type Project = Awaited<ReturnType<typeof getProjectsPackageJsons>>[string];

interface TestSetupOptions {
  environment: "node" | "browser";
  react: boolean;
  msw: boolean;
  handlers: boolean;
}

interface ProjectWithAnalysis extends Project {
  analysis: {
    hasReact: boolean;
    hasMsw: boolean;
    hasTestingLibrary: boolean;
    suggestedEnv: "node" | "browser";
    hasExistingConfig: boolean;
  };
}

/**
 * Analyze package.json dependencies to suggest defaults
 */
function analyzePackageDependencies(
  packageJson: PackageJson,
  projectPath: string,
): ProjectWithAnalysis["analysis"] {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const hasReact = !!allDeps.react;
  const hasMsw = !!allDeps.msw;
  const hasTestingLibrary = !!allDeps["@testing-library/react"];
  const suggestedEnv = hasReact ? "browser" : "node";

  // Check if vitest.config.ts already exists
  const hasExistingConfig = fs.existsSync(
    path.join(projectPath, "vitest.config.ts"),
  );

  return {
    hasReact,
    hasMsw,
    hasTestingLibrary,
    suggestedEnv,
    hasExistingConfig,
  };
}

/**
 * Get eligible projects (packages and tools only)
 */
async function getEligibleProjects(): Promise<ProjectWithAnalysis[]> {
  const projects = await getProjectsPackageJsons();
  const monorepoBasePath = await getMonorepoBasePath();

  return Object.values(projects)
    .filter(
      (project) =>
        // we only generate unit tests for packages and tools
        project.path.startsWith("packages/") ||
        project.path.startsWith("tools/"),
    )
    .map((project) => ({
      ...project,
      analysis: analyzePackageDependencies(
        project.packageJson,
        path.join(monorepoBasePath, project.path),
      ),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Format project for selection display
 */
function formatProjectChoice(project: ProjectWithAnalysis): string {
  const icon = project.path.startsWith("packages/") ? "📦" : "🔧";
  const status = project.analysis.hasExistingConfig ? " (configured)" : "";

  return `${icon} ${project.name.padEnd(35)} (${project.path})${status}`;
}

/**
 * Generate vitest.config.ts content using templates
 */
async function generateVitestConfig(
  options: TestSetupOptions,
): Promise<string> {
  const configFunction =
    options.environment === "browser"
      ? "createVitestBrowserConfig"
      : "createVitestConfig";

  const setupFiles: string[] = [];

  if (options.react) {
    setupFiles.push("./src/__tests__/setup.ts");
  }

  if (options.msw) {
    setupFiles.push("./src/__tests__/msw-setup.ts");
  }

  if (setupFiles.length === 0) {
    // Use simple node config template
    const template = await loadTemplate("vitest.config.node.ts.template");

    return replaceTemplatePlaceholders(template, {
      CONFIG_FUNCTION: configFunction,
    });
  }

  // Use browser config template with setup files
  const template = await loadTemplate("vitest.config.browser.ts.template");

  return replaceTemplatePlaceholders(template, {
    CONFIG_FUNCTION: configFunction,
    SETUP_FILES: setupFiles.map((f) => `"${f}"`).join(", "),
  });
}

/**
 * Generate React Testing Library setup using template
 */
async function generateReactSetup(): Promise<string> {
  return loadTemplate("test-setup/react.ts.template");
}

/**
 * Generate MSW setup using template
 */
async function generateMswSetup(): Promise<string> {
  return loadTemplate("test-setup/msw.ts.template");
}

/**
 * Generate basic MSW handlers template
 */
async function generateMswHandlers(): Promise<string> {
  return loadTemplate("handlers/example.ts.template");
}

/**
 * Get the path to the test templates directory
 */
async function getTestTemplatesPath(): Promise<string> {
  const monorepoBasePath = await getMonorepoBasePath();
  return path.resolve(monorepoBasePath, "tools/test-templates");
}

/**
 * Load a template file and return its content
 */
async function loadTemplate(templatePath: string): Promise<string> {
  const templatesPath = await getTestTemplatesPath();
  const fullPath = path.join(templatesPath, templatePath);
  return fs.readFile(fullPath, "utf-8");
}

/**
 * Replace placeholders in template content with actual values
 */
function replaceTemplatePlaceholders(
  content: string,
  replacements: Record<string, string>,
): string {
  let result = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${placeholder}}}`, "g");
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * Generate a basic example test file using templates
 */
async function generateExampleTest(
  packageName: string,
  options: TestSetupOptions,
): Promise<string> {
  const packageDisplayName = packageName
    .replace("@bsport/", "")
    .replace(/[^a-zA-Z0-9]/g, " ");

  const templatePath = options.react
    ? "test-examples/react.test.tsx.template"
    : "test-examples/basic.test.ts.template";

  const template = await loadTemplate(templatePath);

  return replaceTemplatePlaceholders(template, {
    PACKAGE_NAME: packageName,
    PACKAGE_DISPLAY_NAME: packageDisplayName,
  });
}

/**
 * Update package.json with test dependencies and scripts
 */
async function updatePackageJson(
  projectPath: string,
  options: TestSetupOptions,
) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson: PackageJsonWithNx = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8"),
  );

  // Add dev dependencies
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }
  packageJson.devDependencies["@bsport/config-vitest"] = "workspace:*";

  if (options.react) {
    packageJson.devDependencies["@testing-library/jest-dom"] = "^6.0.0";
    packageJson.devDependencies["@testing-library/react"] = "^14.0.0";
  }

  if (options.msw) {
    packageJson.devDependencies["msw"] = "^2.0.0";
  }

  // Add test scripts
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  if (!packageJson.scripts.test) {
    packageJson.scripts.test = "vitest run";
  }

  if (!packageJson.scripts["test:watch"]) {
    packageJson.scripts["test:watch"] = "vitest";
  }

  if (!packageJson.scripts["test:coverage"]) {
    packageJson.scripts["test:coverage"] = "vitest run --coverage";
  }

  // Update nx tags to include testing
  if (
    packageJson.nx &&
    packageJson.nx.tags &&
    Array.isArray(packageJson.nx.tags)
  ) {
    if (!packageJson.nx.tags.includes("execute:unit-tests")) {
      packageJson.nx.tags.push("execute:unit-tests");
    }
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
}
