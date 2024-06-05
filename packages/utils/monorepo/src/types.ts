export type NXPrintAffectedOutput = {
  projects: string[];
  projectGraph: {
    nodes: {};
    dependencies: {
      [projectName: string]: {
        source: string;
        target: string;
        type: string;
      }[];
    };
  };
};

export type { PackageJson } from "type-fest";
