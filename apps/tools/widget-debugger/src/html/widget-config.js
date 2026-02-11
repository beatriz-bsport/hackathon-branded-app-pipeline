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

window.globalWidgetConfig = {
  companyId,
  cdnUrl,
  widgetScriptUrl,
};
