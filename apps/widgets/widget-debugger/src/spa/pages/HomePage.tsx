import React from "react";

import { useBsportWidget } from "../hooks/useBsportWidget";

const HomePage: React.FC = () => {
  const widgetId = useBsportWidget(
    {
      widgetType: "calendar",
      companyId: 2,
      config: {
        calendar: {},
      },
    },
    "calendar",
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Home - Calendar Widget</h1>
        <p className="page-description">
          Calendar widget integrated in SPA environment
        </p>
      </div>

      {/* Widget container */}
      <div id={widgetId} style={{ minHeight: "600px" }}></div>
    </div>
  );
};

export default HomePage;
