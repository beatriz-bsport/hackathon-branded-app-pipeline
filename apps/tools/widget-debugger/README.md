# Widget Debugger

Two isolated test environments for debugging widgets locally.

## Overview

This tool provides two separate environments to test how widgets behave in different contexts:

1. **SPA Environment** - Single Page Application using React and React Router
2. **HTML Environment** - Static HTML pages simulating SSR platforms (WordPress, Wix, Webflow, etc.)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run SPA Environment

```bash
pnpm dev:spa
```

The SPA will be available at `http://localhost:3210`

### Run HTML Environment

```bash
pnpm dev:html
```

The static HTML pages will be available at `http://localhost:5500`

### Deploy HTML Environment

The HTML environment is automatically deployed to GitLab Pages when changes are pushed to the default branch. The site is published at:

**https://bsport.gitlab.io/ichizen/**

This allows you to test widgets in a production-like environment without running the development server locally. The deployment is configured in `tools/ci/deploy-widget-test-site.yml` and publishes the `apps/tools/widget-debugger/src/html` directory.

## How to Use

### SPA Environment

1. Run `pnpm dev:spa`
2. Navigate between pages using the responsive navbar (burger menu on mobile)
3. The navbar includes a persistent login button widget that stays mounted across navigation
4. To test widgets on individual pages, use the `useBsportWidget` hook:

**Example - Using the useBsportWidget hook:**

```tsx
import React from "react";

import { useBsportWidget } from "../hooks/useBsportWidget";

function HomePage() {
  const widgetId = useBsportWidget(
    {
      widgetType: "calendar",
      companyId: 2,
      config: {
        // Your widget configuration
      },
    },
    "calendar", // Unique widget name
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Home</h1>
        <p className="page-description">Testing widget in SPA</p>
      </div>
      <div id={widgetId}></div>
    </div>
  );
}
```

The `useBsportWidget` hook automatically:

- Generates unique IDs for widgets to ensure proper re-mounting
- Handles widget mounting with the BsportWidget library
- Cleans up widgets when components unmount
- Includes retry logic for widget initialization

**For persistent components (like Navbar):**
Use a fixed ID with `widgetMountedRef` to prevent remounting on every render:

```tsx
const widgetMountedRef = useRef(false);

useEffect(() => {
  if (!widgetMountedRef.current) {
    widgetMountedRef.current = true;
    mountBSportWidget({
      parentElement: "bsport-widget-navbar-login",
      // ... config
    });
  }
}, []);
```

### HTML Environment

1. Run `pnpm dev:html`
2. Navigate between pages using the responsive navbar (burger menu on mobile)
3. All pages use a shared `burger-menu.js` script for consistent navigation behavior
4. To test a widget:
   - Open the HTML file you want to test (e.g., `src/html/index.html`)
   - Paste your widget code snippet in there
   - Save the file - Vite will automatically reload

**Example - Adding widget in HTML:**

```html
<!-- Widget Area: Paste your widget code here -->
<script id="insert-bsport-widget-cdn">
  !(function (b, s, p, o, r, t) {
    // Your widget CDN loader
  })(document, "script", "https://your-cdn.com/widget.js");
</script>

<script>
  MountBsportWidget({
    parentElement: "bsport-widget",
    companyId: 123,
    franchiseId: 456,
    // ... your config
  });
</script>

<div id="bsport-widget"></div>
```

## Development Tips

- Use browser DevTools console for debugging
- Each environment runs on a different port (3210 for SPA, 5500 for HTML)
- You can run both environments simultaneously
- In HTML mode, widgets reset on navigation (full page reload)
- In SPA mode, use `useBsportWidget` hook for page widgets (automatically cleans up and remounts)
- For persistent widgets (navbar), use fixed IDs with `widgetMountedRef` pattern
- The burger menu is responsive and activates at 768px breakpoint
- Widget mounting includes retry logic and detailed console logging
- Test environment using the GitLab Pages deployment at https://bsport.gitlab.io/ichizen/

## Widget Utilities

### `useBsportWidget` Hook (SPA)

Located in `src/spa/hooks/useBsportWidget.ts`, this hook simplifies widget integration:

- Generates unique widget IDs using timestamps
- Automatically mounts widgets when component loads
- Cleans up widget containers on unmount
- Handles widget retry logic

**Usage:**

```tsx
const widgetId = useBsportWidget(widgetConfig, "widget-name");
```

### `mountWidget` Utility

Located in `src/utils/mountWidget.ts`:

- `mountBSportWidget`: Loads the BsportWidget script and mounts the widget
- `mountWidget`: Internal function with retry logic (up to 50 attempts)
- Includes detailed console logging for debugging
- Validates DOM elements before mounting
