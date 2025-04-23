import { spawnSync } from "child_process";
import type { Command } from "commander";
import inquirer from "inquirer";

const DATABASES = {
  "UAT-1": { project: "maps-gke-uat1-655", instance: "main-db-master" },
  "UAT-2": { project: "maps-gke-uat2-655", instance: "main-db-master" },
  "UAT-3": { project: "maps-gke-uat3-655", instance: "main-db-master" },
  "UAT-4": { project: "maps-gke-uat4-655", instance: "main-db-master" },
  Staging: { project: "maps-gke-staging-655", instance: "main-db-master" },
  "Dev (staging-core-services)": {
    project: "staging-core-services",
    instance: "staging-core-data-mysql-node",
  },
};

const questions = [
  {
    type: "list",
    name: "target",
    message: "Select target database:",
    choices: Object.keys(DATABASES),
  },
];

/**
 * Runs the command.
 */
async function action(envName) {
  const target =
    envName && envName in DATABASES
      ? envName
      : (await inquirer.prompt(questions)).target;
  const database = DATABASES[target];

  try {
    const result = spawnSync(
      `gcloud sql import sql ${database.instance} gs://innovation_mysql_backups/latest.sql --project ${database.project} --async --quiet`,
      { stdio: "inherit", shell: true },
    );

    if (result.status === 0) {
      console.log("It may take up to 2 hours to import data");
    } else {
      console.error("Failed to trigger data sync to target DB");
    }
  } catch (e) {
    console.error(`Failed to trigger data sync to target DB: ${e.message}`);
    console.error(`Please make sure you have the following permissions:
  - Cloud SQL Admin (for the instance ${database.instance} in https://console.cloud.google.com/sql/instances?project=${database.project})
  - Storage Admin (for the bucket innovation_mysql_backups in https://console.cloud.google.com/iam-admin/iam?project=innovation-268910)`);
  }
}
export default function dbImport(program: Command) {
  program
    .command("db:sync")
    .description("Sync production DB backup to other environment")
    .argument(
      "[env_name]",
      `Environement name to feed data to. Valid inputs: ${Object.keys(
        DATABASES,
      ).join(", ")}`,
    )
    .action(action);
  return program;
}
