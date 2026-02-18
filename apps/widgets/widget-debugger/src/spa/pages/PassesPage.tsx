import React from "react";

import { useBsportWidget } from "../hooks/useBsportWidget";

const PassesPage: React.FC = () => {
  const widgetId = useBsportWidget(
    {
      widgetType: "pass",
      companyId: 2,
      config: {
        pass: { paymentPackCategories: [], privatePassCategories: [] },
      },
    },
    "passes",
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Passes</h1>
        <p className="page-description">
          Test your passes widget in this SPA page
        </p>
      </div>
      <div id={widgetId}></div>
    </div>
  );
};

export default PassesPage;
