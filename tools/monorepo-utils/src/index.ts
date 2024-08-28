import { program } from "commander";
import packageJson from "../package.json";
import commandPromises from "./commands";

program.name(packageJson.name).description(packageJson.description);

Promise.all(commandPromises).then((commands) => {
  commands.forEach((command) => {
    command(program);
  });
  program.parse();
});
