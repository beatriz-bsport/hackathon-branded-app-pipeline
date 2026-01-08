// Declare global types for BsportWidget
declare global {
  interface Window {
    BsportWidget?: {
      mount: (config: any) => void;
    };
  }
}

// Mount widget helper function
const mountWidget = (config: any, repeat = 1) => {
  if (repeat > 50) {
    console.error("Failed to mount BsportWidget after 50 attempts");
    return;
  }
  if (!window.BsportWidget) {
    setTimeout(() => {
      mountWidget(config, repeat + 1);
    }, 100 * repeat);
    return;
  }

  // Check if the parent element exists before mounting
  const parentElement = document.getElementById(config.parentElement);
  if (!parentElement) {
    console.error(`Parent element #${config.parentElement} not found in DOM`);
    return;
  }

  // Clear any existing content in the parent element
  parentElement.innerHTML = "";

  console.log("✅ Mounting widget to:", config.parentElement);
  try {
    window.BsportWidget.mount(config);
    console.log("✅ Widget mounted successfully");
  } catch (error) {
    console.error("❌ Error mounting widget:", error);
  }
};

// This function meant to reproduce the scripts of the widget code snippet. What it does :

// load widget.js from the cdn
// get the parent element (div) to mount the widget into
// call window.BsportWidget.mount(config) recursively to actually mount the widget (and render widget Root.tsx)

const WIDGET_URLS = {
  local: "http://localhost:3100/widget.js",
  dev: "https://cdn.dev.bsport.io/scripts/widget.js",
} as const;

export const mountBSportWidget = (config: any) => {
  // Load BsportWidget script if not already loaded
  if (!document.getElementById("bsport-widget-cdn")) {
    const script = document.createElement("script");
    script.id = "bsport-widget-cdn";
    const stage = (import.meta.env.VITE_STAGE ||
      "dev") as keyof typeof WIDGET_URLS;
    script.src = WIDGET_URLS[stage];
    script.async = true;

    script.onload = () => {
      console.log("✅ BsportWidget script loaded");
      // Mount the widget once the script is loaded
      mountWidget(config);
    };

    script.onerror = () => {
      console.error("❌ Failed to load BsportWidget script");
    };

    document.head.appendChild(script);
  } else {
    // Script already loaded, mount immediately
    mountWidget(config);
  }
};
