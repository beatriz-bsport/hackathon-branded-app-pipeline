import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const [distDir, bucketName, s3Prefix] = process.argv.slice(2);

if (!distDir || !bucketName || !s3Prefix) {
  console.error(
    "Usage: node scripts/upload-static-routes.mjs <dist-dir> <bucket-name> <s3-prefix>",
  );
  process.exit(1);
}

const indexPath = path.join(distDir, "index.html");
const staticRoutesPath = path.join(distDir, "static-routes.json");

function routeToKeys(route) {
  const prefix = s3Prefix.replace(/^\/+|\/+$/g, "");
  const cleanRoute = route.replace(/^\/+/, "");
  return cleanRoute ? [`${prefix}/${cleanRoute}`] : [prefix, `${prefix}/`];
}

function putRouteObject(key) {
  const result = spawnSync(
    "aws",
    [
      "s3api",
      "put-object",
      "--bucket",
      bucketName,
      "--key",
      key,
      "--body",
      indexPath,
      "--acl",
      "public-read",
      "--content-type",
      "text/html",
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  const raw = await readFile(staticRoutesPath, "utf-8");
  const { routes } = JSON.parse(raw);
  const keys = new Set();

  if (!Array.isArray(routes)) {
    throw new Error("static-routes.json must contain a routes array.");
  }

  for (const route of routes) {
    if (typeof route !== "string" || !route.startsWith("/")) {
      throw new Error(`Invalid static route: ${String(route)}`);
    }
    routeToKeys(route).forEach((key) => keys.add(key));
  }

  for (const key of keys) {
    putRouteObject(key);
  }

  console.log(`[upload-static-routes] uploaded ${keys.size} route objects`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
