const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const defaultCdnUrl = isLocal
  ? "http://localhost:3100"
  : "https://cdn.dev.bsport.io";

const companyId = parseInt(localStorage.getItem("widget:companyId")) || 2;
const cdnUrl = localStorage.getItem("widget:cdnUrl") ?? defaultCdnUrl;
const widgetScriptUrl =
  localStorage.getItem("widget:widgetScriptUrl") ??
  (isLocal ? `${cdnUrl}/widget.js` : `${cdnUrl}/scripts/widget.js`);

const storedDialogMode = localStorage.getItem("widget:dialogMode");
const dialogMode = storedDialogMode ? parseInt(storedDialogMode) : 1;

window.globalWidgetConfig = {
  cdnUrl,
  companyId,
  dialogMode,
  widgetScriptUrl,
};

// Create and inject the configuration form
function createConfigForm() {
  const css = `
    #widget-config-form { position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; font-family: Arial, sans-serif; font-size: 14px; max-width: 300px; }
    #config-header { padding: 12px; background: #f5f5f5; border-bottom: 1px solid #ddd; cursor: move; display: flex; justify-content: space-between; align-items: center; border-radius: 7px 7px 0 0; }
    #config-toggle { font-size: 18px; margin-left: 8px; }
    #config-body { padding: 12px; }
    .config-field { margin-bottom: 10px; }
    .config-field:last-of-type { margin-bottom: 15px; }
    .config-label { display: block; margin-bottom: 4px; font-weight: bold; }
    .config-input, .config-select { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    #config-save-btn { width: 100%; padding: 8px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
  `;

  const dialogModes = [
    { value: "0", label: "Tab (0)" },
    { value: "1", label: "Iframe (1)" },
    { value: "2", label: "Popup (2)" },
    { value: "3", label: "In-page (3)" },
  ];

  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

  const formHtml = `
    <div id="widget-config-form">
      <div id="config-header">
        <strong>Widget Config</strong>
        <span id="config-toggle">▶</span>
      </div>
      <div id="config-body" style="display: none;">
        <div class="config-field">
          <label class="config-label">Company ID:</label>
          <input type="number" id="config-company-id" class="config-input" value="${companyId}">
        </div>
        <div class="config-field">
          <label class="config-label">CDN URL:</label>
          <input type="text" id="config-cdn-url" class="config-input" value="${cdnUrl}">
        </div>
        <div class="config-field">
          <label class="config-label">Widget Script URL:</label>
          <input type="text" id="config-widget-script-url" class="config-input" value="${widgetScriptUrl}">
        </div>
        <div class="config-field">
          <label class="config-label">Dialog Mode:</label>
          <select id="config-dialog-mode" class="config-select">
            ${dialogModes.map((m) => `<option value="${m.value}" ${dialogMode === parseInt(m.value) ? "selected" : ""}>${m.label}</option>`).join("")}
          </select>
        </div>
        <button id="config-save-btn">Save & Refresh</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", formHtml);

  const panel = document.getElementById("widget-config-form");
  const header = document.getElementById("config-header");
  const body = document.getElementById("config-body");
  const toggle = document.getElementById("config-toggle");

  let isCollapsed = true;
  let hasDragged = false;

  header.addEventListener("click", (e) => {
    if (hasDragged) {
      hasDragged = false;
      return;
    }
    isCollapsed = !isCollapsed;
    body.style.display = isCollapsed ? "none" : "block";
    toggle.textContent = isCollapsed ? "▶" : "▼";
  });

  // Simple drag behaviour for the panel
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragStartX = 0;
  let dragStartY = 0;

  header.addEventListener("mousedown", (e) => {
    // Only start drag if primary button
    if (e.button !== 0) return;
    isDragging = true;
    hasDragged = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = panel.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
  });

  function onDragMove(e) {
    if (!isDragging) return;
    const deltaX = Math.abs(e.clientX - dragStartX);
    const deltaY = Math.abs(e.clientY - dragStartY);
    // Only consider it a drag if mouse moved more than 5px
    if (deltaX > 5 || deltaY > 5) {
      // Switch from right-anchored to left-anchored once dragging starts
      if (!hasDragged) panel.style.right = "auto";
      hasDragged = true;
    }
    panel.style.top = `${e.clientY - dragOffsetY}px`;
    panel.style.left = `${e.clientX - dragOffsetX}px`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
  }

  document.getElementById("config-save-btn").addEventListener("click", () => {
    localStorage.setItem(
      "widget:companyId",
      document.getElementById("config-company-id").value,
    );
    localStorage.setItem(
      "widget:cdnUrl",
      document.getElementById("config-cdn-url").value,
    );
    localStorage.setItem(
      "widget:widgetScriptUrl",
      document.getElementById("config-widget-script-url").value,
    );
    localStorage.setItem(
      "widget:dialogMode",
      document.getElementById("config-dialog-mode").value,
    );
    window.location.reload();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createConfigForm);
} else {
  createConfigForm();
}
