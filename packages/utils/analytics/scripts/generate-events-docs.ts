import { mkdirSync, writeFileSync } from "fs";
import path from "path";

import { extractEventsDocs } from "./extract-events-docs";
import { type EventDoc, LOGGER } from "./utils";

// ==================================================

// #region INPUTS

const DOCS_FILENAME = "events-docs";

const OUTPUT_FOLDER = path.resolve(process.cwd(), "./docs");

// #endregion

// ==================================================

// #region FORMATTERS

/**
 * Remove the `@bsport/` prefix to a project name
 * @param name Name of the project to sanitize
 */
function sanitizeAppName(name: string) {
  return name.replace("@bsport/", "");
}

function inlineParams({
  params,
  separator = "\n",
}: {
  params: Record<string, string>;
  separator?: string;
}) {
  return Object.entries(params)
    .map(
      ([paramName, paramDescription]) =>
        `\`${paramName}\`: ${paramDescription}`,
    )
    .join(separator);
}

// #endregion

// ==================================================

// #region GENERATORS

/**
 * Write a file at the desired outputPath with the provided string content
 * @param outputPath Filepath where to generate the file
 * @param content Stringified content to put inside the file
 */
function generateFile({
  outputPath,
  content,
}: {
  outputPath: string;
  content: string;
}) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    mkdirSync(dir, { recursive: true });

    writeFileSync(outputPath, content, "utf-8");
  } catch (error) {
    console.error(`Failed to write file to ${outputPath}:`, error);
    throw error;
  }
}

/**
 * Generate a JSON documentation out of a map between a project name and a list of events docs
 * @param eventsDocs Extracted events docs map from the codebase
 */
function generateAsJson(eventsDocs: Record<string, EventDoc[]>) {
  const outputPath = path.resolve(OUTPUT_FOLDER, `${DOCS_FILENAME}.json`);

  generateFile({
    outputPath,
    content: JSON.stringify(eventsDocs, null, 2),
  });

  LOGGER.fileCreated(outputPath);
}

/**
 * Generate a Markdown documentation out of a map between a project name and a list of events docs
 * @param eventsDocs Extracted events docs map from the codebase
 */
function generateAsMarkdown(eventsDocs: Record<string, EventDoc[]>) {
  const outputPath = path.resolve(OUTPUT_FOLDER, `${DOCS_FILENAME}.md`);

  const formatEventDocMdSection = (doc: EventDoc) => {
    const { params, eventType, description } = doc;
    const formattedParams = inlineParams({ params });
    return `### \`${eventType}\`\n\n**Description:** ${description}\n\n**Parameters:**\n${formattedParams}\n`;
  };

  const fileTitle = "# Events List";

  const markdownDocs = Object.entries(eventsDocs)
    .map(([appName, appEvents]) => {
      const appDocs = appEvents.map(formatEventDocMdSection).join("\n\n");
      return [`## ${sanitizeAppName(appName)}`, appDocs].join("\n\n");
    })
    .join("\n---\n\n");

  generateFile({
    outputPath,
    content: [fileTitle, markdownDocs].join("\n---\n\n"),
  });

  LOGGER.fileCreated(outputPath);
}

/**
 * Generate a Markdown table documentation out of a map between a project name and a list of events docs
 * @param eventsDocs Extracted events docs map from the codebase
 */
function generateAsMarkdownTable(eventsDocs: Record<string, EventDoc[]>) {
  const outputPath = path.resolve(OUTPUT_FOLDER, `${DOCS_FILENAME}-table.md`);

  const formatEventDocMdRow = ({
    doc,
    appName,
  }: {
    doc: EventDoc;
    appName: string;
  }) => {
    const { params, eventType, description } = doc;
    // Allow multi line descriptions
    const sanitizedDescription = description
      ? String(description).replace(/\|/g, "\\|").replace(/\r?\n/g, " ")
      : "";
    const formattedParams = inlineParams({
      params,
      separator: "<br>",
    });
    return `| ${sanitizeAppName(appName)} | \`${eventType}\` | ${sanitizedDescription} | ${formattedParams} |`;
  };

  const eventsList = Object.entries(eventsDocs).map(([appName, appEvents]) =>
    appEvents.map((doc) => formatEventDocMdRow({ doc, appName })),
  );

  const concatEventsList = eventsList.reduce((acc, nextValue) => {
    return acc.concat(nextValue);
  }, []);

  const markdownDocs = [
    "# Events Table\n",
    "| Project | Event type | Description | Parameters |",
    "|---:|---|:---|:---|",
    ...concatEventsList,
  ].join("\n");

  generateFile({ outputPath, content: markdownDocs });

  LOGGER.fileCreated(outputPath);
}

// #endregion

// ==================================================

// #region MAIN

async function main() {
  const eventsDocs = await extractEventsDocs();
  generateAsJson(eventsDocs);
  generateAsMarkdown(eventsDocs);
  generateAsMarkdownTable(eventsDocs);
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

// #endregion
