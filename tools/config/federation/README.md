# `@bsport/config-federation`

Import this in your `vite.config.ts` and use the functions you need.

## API

### `getAppPort`

Gets the port for a specific app.

### `getLocalFederationRemotes`

Gets the list of remotes for local development.

### `getConfig`

Generates and validates configuration for a federated module. This function helps set up Module Federation in a Vite application by providing standardized configuration based on the app type and environment.

#### Parameters

```typescript
interface ConfigParams {
  appType: AppTypes; // Type of the application (hosts, shared, core-data, etc.)
  mode: "development" | "production" | "preview"; // Build mode
  packageJson: PackageJson; // package.json configuration
}
```

#### Returns

Returns a validated configuration object containing:

- `base`: Base URL configuration
- `server`: Vite server configuration
- `preview`: Vite preview configuration
- `define`: Global constants
- `federation`: Module Federation configuration
- `pathsToWatch`: Paths to watch for development

#### Package.json Federation Configuration

Your `package.json` must include a `federation` section that follows this schema:

```json
{
  "federation": {
    "devPort": number,     // Required: Development port (must be within valid range for app type)
    "name": string,       // Optional: Module name if not provided it will use the package name
    "remotes": {         // Optional: Remote modules configuration
      "[moduleName]": {
        "devPort": number,   // Required: Port of the remote module
        "watchPath": string  // Optional: Path to watch for changes e.g. "../navigation-sidebar/src/**/*"
      }
    },
    "exposes": {         // Optional: Exposed modules
      "[path]": "[module]"  // e.g., "./Button": "./src/components/Button"
    }
  }
}
```

#### Port Ranges

Each app type has a designated port range to avoid conflicts:

- `hosts`: 4000-4049
- `shared`: 4050-4099
- `core-data`: 4100-4149
- `buyables`: 4150-4199
- `booking`: 4200-4249
- `financial-services`: 4250-4299
- `customer-data-platform`: 4300-4349
- `business-insights`: 4350-4399
- `communication`: 4400-4449

#### Example Usage

```typescript
// vite.config.ts
import { defineConfig } from "vite";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  const config = getConfig({
    appType: "hosts",
    mode,
    packageJson,
  });

  return {
    base: config.base,
    server: config.server,
    preview: config.preview,
    define: config.define,
    plugins: [
      // ... other plugins
      federation(config.federation),
    ],
  };
});
```

#### Example package.json Federation Config

Here are two examples showing both a host app and a remote module configuration:

##### Host App (e.g., main application)

```json
{
  "federation": {
    "devPort": 4000,
    "remotes": {
      "navigation-sidebar": {
        "devPort": 4050,
        "watchPath": "../navigation-sidebar/src/**/*"
      }
    }
  }
}
```

##### Remote Module (e.g., navigation-sidebar)

```json
{
  "federation": {
    "devPort": 4050,
    "exposes": {
      "./NavigationSidebar": "./src/components/NavigationSidebar"
    }
  }
}
```

The configuration will be validated to ensure:

- The port is within the valid range for the app type
- All required fields are present
- Remote module configurations are valid
