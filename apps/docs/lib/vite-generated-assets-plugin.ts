import { createReadStream } from "node:fs";
import { cp, stat } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".ico") return "image/x-icon";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function resolveGeneratedFile(root: string, urlPath: string): string | null {
  const relative = urlPath.replace(/^\//, "");
  if (!relative || relative.includes("..")) return null;

  const filePath = path.join(root, relative);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  return filePath;
}

/** Serve and copy `.generated/` assets alongside Vite's committed `public/` folder. */
export function generatedAssetsPlugin(generatedDir: string): Plugin {
  const root = path.resolve(generatedDir);
  let outDir = path.resolve("dist");

  return {
    name: "kaizen-docs-generated-assets",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    configureServer({ middlewares }) {
      middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          next();
          return;
        }

        const urlPath = decodeURIComponent((req.url ?? "/").split(/[?#]/)[0]);
        const filePath = resolveGeneratedFile(root, urlPath);
        if (!filePath) {
          next();
          return;
        }

        try {
          const info = await stat(filePath);
          if (!info.isFile()) {
            next();
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", contentTypeFor(filePath));
          if (req.method === "HEAD") {
            res.end();
            return;
          }

          createReadStream(filePath).pipe(res);
        } catch {
          next();
        }
      });
    },
    async closeBundle() {
      try {
        await stat(root);
      } catch {
        return;
      }

      await cp(root, outDir, { recursive: true });
    },
  };
}
