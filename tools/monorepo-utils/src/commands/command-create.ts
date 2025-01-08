import type { Command } from "commander";
import fs from "fs";
import path from "path";
import kebabCase from "lodash/kebabCase";
import camelCase from "lodash/camelCase";
import { commandCase } from "@bsport/typescript-string-utils";

const template = (commandName: string) => `
import type { Command } from 'commander'

export default function ${camelCase(commandName)}(program: Command) {
  program
    .command('${commandCase(commandName)}')
    .description('TODO: Add description here.')
    // .argument(
    //   '<arg-name>',
    //   'Argument of the command (Uncomment to add an argument to the command).',
    // )
    .option('-q, --quiet', 'suppress all output, unless an error occurs.', false)
    .action(action)
  return program
}

/**
 * Runs the command.
 */
async function action({
  quiet,
  /* options here */
}: { quiet: boolean }) {
  const print = (...args) => !quiet && console.log(...args)

  // Command's source code
}
`;

/**
 * Runs the command.
 */
async function action(commandName: string, { quiet }: { quiet: boolean }) {
  const print = (...args) => !quiet && console.log(...args);

  const fileName = kebabCase(commandName);
  const templateContent = template(commandName);

  const fileFullPath = path.resolve(__dirname, `${fileName}.ts`);
  fs.writeFileSync(fileFullPath, templateContent);
  print(`ℹ️  File path: ${fileFullPath}`);

  // Add the file in the index.js
  const indexFile = path.resolve(__dirname, "index.ts");
  const indexFileContent = fs.readFileSync(indexFile, "utf8");

  const newContent = indexFileContent
    .replace(
      /\/\/ DO NOT REMOVE THIS LINE: IMPORTS/,
      `import ${camelCase(
        commandName,
      )} from './${fileName}'\n// DO NOT REMOVE THIS LINE: IMPORTS`,
    )
    .replace(
      /\/\/ DO NOT REMOVE THIS LINE: COMMANDS/,
      `${camelCase(commandName)},\n  // DO NOT REMOVE THIS LINE: COMMANDS`,
    );

  fs.writeFileSync(indexFile, newContent);
  print(`Path added to ${indexFile}`);

  print("✅  All good!");
  print(`ℹ️  Open the file to start developing: "${fileFullPath}"`);
  print(
    `ℹ️  Run from the following command form to test: pnpm run -w utils ${commandName} -h`,
  );
}

export default function createCommand(program: Command) {
  program
    .command("command:create")
    .description("Creates a new command in the monorepo-utils project.")
    .argument(
      "<command-name>",
      "Command name usually named as {namespace}:{action} (ex: project:create, command:delete...)",
    )
    .option(
      "--dir <dirPath>",
      "You can specify a custom target directory for the script (default: src/commands/commandName).",
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
