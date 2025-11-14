import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

import { mountBSportWidget } from "../../utils/mountWidget";

interface UseBsportWidgetConfig {
  widgetType: string;
  companyId: number;
  franchiseId?: number | null;
  dialogMode?: number;
  showFab?: boolean;
  fullScreenPopup?: boolean;
  styles?: any;
  config?: any;
}

// This hook is made to avoid redundancy, we can use it to pass a minimal configuration object for each widget we want to mount.
export const useBsportWidget = (
  widgetConfig: UseBsportWidgetConfig,
  widgetName: string,
) => {
  const widgetIdRef = useRef(`bsport-widget-${widgetName}-${uuid()}`);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      mountBSportWidget({
        parentElement: widgetIdRef.current,
        companyId: widgetConfig.companyId,
        franchiseId: widgetConfig.franchiseId ?? null,
        dialogMode: widgetConfig.dialogMode ?? 1,
        widgetType: widgetConfig.widgetType,
        showFab: widgetConfig.showFab ?? false,
        fullScreenPopup: widgetConfig.fullScreenPopup ?? false,
        styles: widgetConfig.styles,
        config: widgetConfig.config,
      });
    }, 0);

    // Cleanup: Clear the widget container when component unmounts
    return () => {
      clearTimeout(timer);
      const container = document.getElementById(widgetIdRef.current);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [
    widgetConfig.widgetType,
    widgetConfig.companyId,
    widgetConfig.franchiseId,
    widgetConfig.dialogMode,
    widgetConfig.showFab,
    widgetConfig.fullScreenPopup,
    widgetConfig.styles,
    widgetConfig.config,
  ]);

  return widgetIdRef.current;
};
