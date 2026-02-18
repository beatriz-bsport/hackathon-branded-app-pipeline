import { useBsportWidget } from "../hooks/useBsportWidget";

const MemberAreaPage: React.FC = () => {
  const widgetId = useBsportWidget(
    {
      widgetType: "consumerSpace",
      companyId: 2,
      config: {
        consumerSpace: {
          loginSubtitle: "",
          loginTitle: "",
          showSubtitle: true,
          showTitle: true,
          hideNavigation: false,
          defaultPage: "consumerBooking",
        },
      },
    },
    "member-profile",
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Member Area</h1>
        <p className="page-description">
          Test your member area widget in this SPA page
        </p>
      </div>
      <h1 className="page-title">Member profile</h1>
      <div id={widgetId}></div>
    </div>
  );
};

export default MemberAreaPage;
