# Format date & time utils

Package providing utilities to format date in the monorepository, including the actual used formats.

## How to use

1. First add it by adding it in tthe dependencies of your `package.json`

   ```json
   {
     "dependencies": {
       "@bsport/datetime-format-utils": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import any format directly in your project

```tsx
import { DATE_FORMATS } from "@bsport/datetime-format-utils";

// ...
```
