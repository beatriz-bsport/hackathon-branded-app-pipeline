/** Folder where events files should be stored */
export const EVENTS_FOLDER = "src/events";

/** File path to the file where Event Zod schemas are exported */
export const REGISTER_FILE = `${EVENTS_FOLDER}/register.ts`;

/** Several loggers to give information in the terminal when the script is running */
export const LOGGER = {
  event: (eventName: string) => console.log(`🔵 Event ${eventName}`),

  eventGroup: (projectName: string) => console.group(`\n🔎 ${projectName}`),

  invalidSchema: () =>
    console.log(
      "🔴 Invalid Event Schema declaration. Missing eventType or eventType.default",
    ),

  missingRegister: () =>
    console.log(`🔴 No file found at ${REGISTER_FILE} path !`),

  projectWithEvent: (projectName: string) => console.log(`🟢 ${projectName}`),

  projectWithEventGroup: () => console.group("\n🚀 Projects with events"),

  fileCreated: (outputPath: string) =>
    console.log(`\n📄 Event documentation generated at: ${outputPath}`),

  endGroup: () => console.groupEnd(),

  unexpectedObject: (registerFile: string) =>
    console.warn(`🟡 Get an unexpected object from ${registerFile}`),

  failedToDetectEventsFolder: ({
    projectName,
    error,
  }: {
    projectName: string;
    error: unknown;
  }) => console.error(`An error happened with project ${projectName}: `, error),
};

/**
 * Parameters to get from the Event Zod Schema for the documentation
 * @param eventType Name of the event
 * @param description String provided to the `describe` of the Zod Schema
 * @param params Record where keys are parameters' name and values are parameters' description
 */
export type EventDoc = {
  eventType: string;
  description?: string;
  params: Record<string, string>;
};
