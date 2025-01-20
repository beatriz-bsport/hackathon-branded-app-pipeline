import type { Command } from "commander";

import commandCreate from "./command-create";
import commandList from "./command-list";
import legacyMigrate from "./legacy-migrate";
import openBranchList from "./open-branch-list";
import projectClean from "./project-clean";
import projectCreate from "./project-create";
import projectImport from "./project-import";
import projectList from "./project-list";
import projectDependenciesList from "./project-dependencies-list";
import dbSync from "./db-sync";
import setApiEnvironment from './set-api-environment'
// DO NOT REMOVE THIS LINE: IMPORTS

const COMMANDS: ((program: Command) => Promise<Command> | Command)[] = [
  commandCreate,
  commandList,
  dbSync,
  legacyMigrate,
  openBranchList,
  projectClean,
  projectCreate,
  projectDependenciesList,
  projectImport,
  projectList,
  setApiEnvironment,
  // DO NOT REMOVE THIS LINE: COMMANDS
];

export default COMMANDS;
