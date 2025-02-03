import { ListLayout, Button } from "@bsport/kaizen-primitive-core";
import OfferListExample from "#src/components/template-examples/OfferListExample";

function ListPage() {
  return (
    <ListLayout>
      <ListLayout.Header
        breadcrumbsItems={[
          {
            text: "Back to home",
            href: "/",
            id: "back-to-home",
          },
        ]}
        callToActionButton={
          <Button
            iconLeft="bell-03"
            intent="call-to-action"
            color="main"
            size="md"
            label="CTA Button"
          />
        }
        pageTabs={{
          tabs: [
            {
              label: "Some tab",
              icon: "user-edit",
            },
          ],
          orientation: "horizontal",
        }}
        pageTitle="Offer list example"
      />
      <ListLayout.Content className="hide-scrollbar">
        <OfferListExample />
      </ListLayout.Content>
    </ListLayout>
  );
}

export default ListPage;
