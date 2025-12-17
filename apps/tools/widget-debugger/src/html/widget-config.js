const companyId = parseInt(localStorage.getItem("widget:companyId")) || 2;
const cdnUrl =
  localStorage.getItem("widget:cdnUrl") || "https://cdn.dev.bsport.io";
const widgetScriptUrl =
  localStorage.getItem("widget:widgetScriptUrl") ||
  `${cdnUrl}/scripts/widget.js`;

window.globalWidgetConfig = {
  companyId,
  cdnUrl,
  widgetScriptUrl,
};
