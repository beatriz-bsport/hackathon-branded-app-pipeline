import type { Command } from "commander";

import commandCreate from "./command-create";
import commandList from "./command-list";
import projectCreate from "./project-create";
import projectImport from "./project-import";
import projectList from "./project-list";
import projectDependenciesList from "./project-dependencies-list";
import dbSync from "./db-sync";
// DO NOT REMOVE THIS LINE: IMPORTS

const COMMANDS: ((program: Command) => Promise<Command> | Command)[] = [
  commandCreate,
  projectImport,
  projectCreate,
  commandList,
  projectList,
  projectDependenciesList,
  dbSync,
  // DO NOT REMOVE THIS LINE: COMMANDS
];

export default COMMANDS;
