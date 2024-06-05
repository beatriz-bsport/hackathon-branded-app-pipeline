import type { Command } from "commander";
import path from "path";
import { program } from "commander";
import fs from "fs-extra";
import kebabCase from "lodash/kebabCase";
import pkg from "../../package.json";

enum OutputType {
  CLI = "cli",
  README = "readme",
}

enum FormatType {
  JSON = "json",
  TEXT = "text",
  MARKDOWN = "markdown",
}

type CommandJSON = {
  name: string;
  subcommand: string;
  description: string;
  args: {
    term: string;
    description: string;
  }[];
  options: {
    term: string;
    description: string;
  }[];
};

const README_START_MARKER = "----CommandListStart----";
const README_END_MARKER = "----CommandListEnd----";

/**
 * Runs the command.
 */
async function action({
  quiet,
  output,
  format,
}: {
  quiet: boolean;
  output: OutputType;
  format: FormatType;
}) {
  try {
    validateInput({ quiet, output, format });

    const print = (...args) => !quiet && console.log(...args);

    const helper = program.createHelp();
    const commands = helper.visibleCommands(program);

    const formattedCommands: CommandJSON[] = commands
      .map((cmd) => ({
        name: cmd.name(),
        subcommand: helper.subcommandTerm(cmd),
        description: helper.subcommandDescription(cmd),
        args: helper.visibleArguments(cmd).map((arg) => ({
          term: helper.argumentTerm(arg),
          description: helper.argumentDescription(arg),
        })),
        options: helper.visibleOptions(cmd).map((option) => ({
          term: helper.optionTerm(option),
          description: helper.optionDescription(option),
        })),
      }))
      .filter((cmd) => cmd && cmd.name !== "help")
      .sort((a, b) => a.name.localeCompare(b.name));

    const result = getCommandsAsText(formattedCommands, format);

    if (output === OutputType.README) {
      const readmePath = path.resolve(__dirname, "../../README.md");
      if (!fs.existsSync(readmePath)) {
        throw new Error(`README.md not found at ${readmePath}`);
      }

      const readme = await fs.readFile(readmePath, "utf8");
      const readmeCommandsStart = readme.indexOf(README_START_MARKER);
      const readmeCommandsEnd = readme.indexOf(README_END_MARKER);

      if (readmeCommandsStart === -1 || readmeCommandsEnd === -1) {
        throw new Error(
          `README.md does not contain the command list start / end markers.\nPlease add the following to the README.md file:\n${README_START_MARKER}\n${README_END_MARKER}`
        );
      }

      let readmeContent = readme.slice(0, readmeCommandsStart);
      readmeContent += `${README_START_MARKER}\n\n`;
      readmeContent += getTableOfContents(formattedCommands);
      readmeContent += "\n\n";
      readmeContent += result;
      readmeContent += `${README_END_MARKER}\n`;
      readmeContent += readme.slice(
        readmeCommandsEnd + README_END_MARKER.length + 1
      );

      await fs.writeFile(readmePath, readmeContent);
      print("✅ README.md updated. Please commit the changes.");
      print(`See changes here: ${readmePath}`);
    } else {
      console.log(result);
    }
  } catch (err) {
    console.error(`❌ ${err.message}}`);
    process.exit(1);
  }
}

function validateInput(...args: Parameters<typeof action>) {
  if (!Object.values(OutputType).includes(args[0].output)) {
    throw new Error(
      `Error in the output type. Please use one of the following: ${Object.values(
        OutputType
      ).join(", ")}`
    );
  }
  if (!Object.values(FormatType).includes(args[0].format)) {
    throw new Error(
      `Error in the format type. Please use one of the following: ${Object.values(
        FormatType
      ).join(", ")}`
    );
  }
  if (
    args[0].output === OutputType.README &&
    args[0].format !== FormatType.MARKDOWN
  ) {
    throw new Error(
      `Please set format to ${FormatType.MARKDOWN} if you want to output to README.md.`
    );
  }
}

function getCommandsAsText(
  commands: CommandJSON[],
  format: FormatType
): string {
  let result = "";

  switch (format) {
    case FormatType.JSON:
      result = JSON.stringify(commands, null, 2);
      break;
    case FormatType.MARKDOWN:
      commands.forEach((cmd) => {
        result += `### \`${cmd.name}\`\n\n`;
        result += `${cmd.description}\n\n`;
        result += `__Usage:__ \`${pkg.name} ${cmd.subcommand}\`\n\n`;

        if (cmd.args.length) {
          result += "| Arg | Description |\n|:----:|:----:|\n";
          cmd.args.forEach((arg) => {
            result += `| \`${arg.term}\` | ${arg.description} |\n`;
          });
          result += "\n";
        }

        if (cmd.options.length) {
          result += "| Option | Description |\n|:----:|:----:|\n";
          cmd.options.forEach((opt) => {
            result += `| \`${opt.term}\` | ${opt.description} |\n`;
          });
          result += "\n";
        }
      });
      break;
    case FormatType.TEXT:
    default: {
      const optionTermMaxLength =
        commands.reduce(
          (acc, cmd) =>
            Math.max(
              acc,
              [...cmd.args, ...cmd.options].reduce(
                (accOptions, option) =>
                  Math.max(accOptions, option.term.length),
                0
              )
            ),
          0
        ) + 2;

      result = "";
      commands.forEach((cmd) => {
        result += `Command: ${cmd.name}\n\n`;
        result += `  Usage: ${pkg.name} ${cmd.subcommand}\n\n`;
        result += `  ${cmd.description}\n`;
        result += cmd.args.length ? "\nArguments:\n" : "";
        cmd.args.forEach((arg) => {
          result += `  ${arg.term.padEnd(optionTermMaxLength, " ")} ${
            arg.description
          }\n`;
        });
        result += cmd.options.length ? "\nOptions:\n" : "";
        cmd.options.forEach((opt) => {
          result += `  ${opt.term.padEnd(optionTermMaxLength, " ")} ${
            opt.description
          }\n`;
        });
        result += `\n\n${"-".repeat(optionTermMaxLength)}\n\n`;
      });
    }
  }
  return result;
}

function getTableOfContents(commands: CommandJSON[]) {
  let result = "### Table of Contents\n\n";
  result += commands
    .map((cmd) => `[${cmd.name}](#${kebabCase(cmd.name.replace(":", ""))})`)
    .join("\n");
  return result;
}

export default function commandList(program: Command) {
  program
    .command("command:list")
    .description("Allows to list all the utils command from the monorepo.")
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false
    )
    .option(
      "-o, --output <output>",
      "output the list of commands in a file.",
      OutputType.CLI
    )
    .option(
      "-f, --format <format>",
      "output the list of commands in a file.",
      FormatType.TEXT
    )
    .action(action);
  return program;
}
