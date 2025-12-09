# @bsport/timezone

Utility functions for handling timezone storage in web applications.

## Installation

Add the package as a dependency in your `package.json` file:

```json
{
  "dependencies": {
    "@bsport/timezone-utils": "workspace:*"
    // other dependencies...
  }
}
```

## Features

- Store and retrieve company timezone in `localStorage` or `sessionStorage`

## Usage

### Managing timezone in Storage

```typescript
import { getCompanyTimezone, setCompanyTimezone } from "@bsport/timezone-utils";

// Set timezone
setCompanyTimezone("America/Toronto");

// Get timezone
const timezone = getCompanyTimezone(); // e.g. "America/Toronto"
```

## API

### Storage

- `getCompanyTimezone(): string`  
  Retrieves the stored timezone (`sessionStorage` first, then `localStorage`). Defaults to `"Europe/Paris"`.

- `setCompanyTimezone(value: string, storage?: "local" | "session"): void`  
  Stores the timezone in the specified storage (default: `"local"`).
