import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildRuntimeEnvSource,
  runtimeEnvPlugin,
} from "../runtimeEnvPlugin.js";

const tempDirs: string[] = [];

const createTempDir = () => {
  const dirPath = mkdtempSync(join(tmpdir(), "runtime-env-plugin-"));
  tempDirs.push(dirPath);
  return dirPath;
};

describe("runtimeEnvPlugin", () => {
  afterEach(() => {
    tempDirs.splice(0).forEach((dirPath) => {
      rmSync(dirPath, { recursive: true, force: true });
    });
  });

  it("injects env.js in the HTML head", () => {
    const rootDir = createTempDir();
    const plugin = runtimeEnvPlugin({
      rootDir,
      envScriptPath: "/studio/env.js",
    });

    const result = plugin.transformIndexHtml?.(
      "<html><head></head><body></body></html>",
    );

    expect(result).toEqual({
      html: "<html><head></head><body></body></html>",
      tags: [
        {
          tag: "script",
          attrs: { src: "/studio/env.js" },
          injectTo: "head-prepend",
        },
      ],
    });
  });

  it("emits a deterministic env.js asset when no public/env.js file exists", () => {
    const rootDir = createTempDir();
    const plugin = runtimeEnvPlugin({
      rootDir,
      envScriptPath: "/env.js",
    });
    const emitFile = vi.fn();

    plugin.generateBundle?.call({ emitFile } as never);

    expect(emitFile).toHaveBeenCalledOnce();
    expect(emitFile).toHaveBeenCalledWith({
      type: "asset",
      fileName: "env.js",
      source: buildRuntimeEnvSource(),
    });
  });

  it("emits a neutral env.js asset by default", () => {
    const rootDir = createTempDir();
    const plugin = runtimeEnvPlugin({
      rootDir,
      envScriptPath: "/env.js",
    });
    const emitFile = vi.fn();

    plugin.generateBundle?.call({ emitFile } as never);

    expect(emitFile).toHaveBeenCalledWith({
      type: "asset",
      fileName: "env.js",
      source: buildRuntimeEnvSource(),
    });
  });

  it("does not emit env.js when a public/env.js file already exists", () => {
    const rootDir = createTempDir();
    const publicDir = join(rootDir, "public");
    mkdirSync(publicDir);
    writeFileSync(join(publicDir, "env.js"), "window.runtime = { env: {} };");

    const plugin = runtimeEnvPlugin({
      rootDir,
      envScriptPath: "/env.js",
    });
    const emitFile = vi.fn();

    plugin.generateBundle?.call({ emitFile } as never);

    expect(emitFile).not.toHaveBeenCalled();
  });
});
