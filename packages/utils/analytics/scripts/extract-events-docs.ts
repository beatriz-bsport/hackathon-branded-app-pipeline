import { existsSync } from "fs";
import path from "path";
import {
  type JsonSchema7ObjectType,
  zodToJsonSchema,
} from "zod-to-json-schema";

import {
  getMonorepoBasePathSync,
  getProjectsPackageJsons,
} from "@bsport/typescript-monorepo-utils";

import { EVENTS_FOLDER, type EventDoc, LOGGER, REGISTER_FILE } from "./utils";

const ICHIZEN_ROOT_PATH = getMonorepoBasePathSync();

/**
 * Parameters of projects used in the script
 * @param name Name of a project, application or package (e.g. @bsport/sm-host)
 * @param rootPath Absolute path from the Ichizen root to the project folder (e.g. apps/applications/studio-manager/host)*
 */
export type ProjectWithEvents = {
  name: string;
  rootPath: string;
};

/**
 * Retrieve from the codebase all the projects (applications or packages) that
 * contain a `src/events` folder.
 * @returns List of projects with events formatted as ProjectWithEvents
 */
async function getProjectsWithEvents() {
  const projects = await getProjectsPackageJsons({ isAbsolutePath: true });

  const filteredProjects: ProjectWithEvents[] = [];

  for (const projectConfig of Object.values(projects).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const { name, path: rootPath } = projectConfig;

    const eventsPath = path.join(rootPath, EVENTS_FOLDER);
    try {
      if (existsSync(eventsPath)) {
        filteredProjects.push({
          name,
          rootPath,
        });
      }
    } catch (error) {
      LOGGER.failedToDetectEventsFolder({ projectName: name, error });
    }
  }

  LOGGER.projectWithEventGroup();
  for (const project of filteredProjects) {
    LOGGER.projectWithEvent(project.name);
  }
  LOGGER.endGroup();

  return filteredProjects;
}

/**
 * Output when injecting a zodSchema into zodToJsonSchema
 */
type ZodJsonSchema = JsonSchema7ObjectType & { description?: string };

/**
 * Extract from a ZodJsonSchema the adequate properties for the Event documentation
 * @param jsonSchema
 * @returns EventDoc object
 */
function formatJsonSchema(jsonSchema: ZodJsonSchema): EventDoc | undefined {
  const properties = jsonSchema.properties ?? {};

  const { eventType, ...otherProperties } = properties;

  if (!eventType || !eventType.default) {
    LOGGER.invalidSchema();
    return;
  }

  LOGGER.event(eventType.default);

  const docContent = {
    eventType: eventType.default,
    description: jsonSchema.description || "",
    params: Object.fromEntries(
      Object.entries(otherProperties).map(([propName, propParams]) => [
        propName,
        propParams?.description ?? "missing description",
      ]),
    ),
  };

  return docContent;
}

/**
 * Given a project (application or package), retrieve all exported events schemas to parse their docs
 * @param project Config information of a project with events
 * @returns A list of EventDocs, with one EventDoc per event schema
 */
async function getProjectEvents(
  project: ProjectWithEvents,
): Promise<EventDoc[]> {
  const registerFile = path.resolve(project.rootPath, REGISTER_FILE);

  if (existsSync(registerFile)) {
    const registerContent = await import(registerFile);
    const objects = Object.values(registerContent);

    const validatedSchema: ZodJsonSchema[] = [];
    for (const obj of objects) {
      try {
        // Security in case someone exported other things than Zod Schemas from its register file
        // @ts-expect-error unknown object, not Zod schema
        const output: ZodJsonSchema = zodToJsonSchema(obj);
        validatedSchema.push(output);
      } catch (error) {
        LOGGER.unexpectedObject(path.relative(ICHIZEN_ROOT_PATH, registerFile));
      }
    }

    return validatedSchema
      .map(formatJsonSchema)
      .filter((a) => !!a)
      .sort((a, b) => a.eventType.localeCompare(b.eventType));
  } else {
    LOGGER.missingRegister();
  }

  return [];
}

/**
 * Retrieve each project with a src/events folder and retrieve their events docs
 * @returns A mapping of a project name to its list of EventDocs
 */
export async function extractEventsDocs(): Promise<Record<string, EventDoc[]>> {
  const docs: Record<string, EventDoc[]> = {};

  const projectsWithEvents = await getProjectsWithEvents();

  // Retrieve for each project its list of EventDocs
  for (const project of projectsWithEvents) {
    LOGGER.eventGroup(project.name);
    const projectDocs = await getProjectEvents(project);
    LOGGER.endGroup();

    docs[project.name] = projectDocs;
  }

  return docs;
}
