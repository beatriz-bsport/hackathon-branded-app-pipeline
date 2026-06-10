import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip, Tooltip } from "@bsport/kaizen-primitive-core";

import { BILLING_PLAN_FINAL_STATUS } from "./constants";
import { useBillingPlanStatusTranslations } from "./get-status";
import { useBillingPlanStatusChipConfigs } from "./use-status-chip-config";

const metaComponentDescription = `
This business component encapsulates several utilities about Membership Plan Status that can be used independently.
It provides client-facing status with translation and chip configuration. 

### Business Context

Use these utilities when you need to display the effective status of a membership plan

- List or Details of a membership plan
- Associated objects with invoice


### How to import ?

\`\`\`tsx
import { 
  getBillingPlanStatus,
  useBillingPlanStatusTranslations,
  useBillingPlanStatusChipConfigs,
  BILLING_PLAN_FINAL_STATUS
} from "@bsport/kaizen-business-components/buyables/billing-plan-status";
\`\`\`
`;

const metaSourceCode = `
const status = getBillingPlanStatus(billingPlan); // Return one of BILLING_PLAN_FINAL_STATUS

const translations = useBillingPlanStatusTranslations(); // Return client-facing name for each membership plan status

const chips = useBillingPlanStatusChipConfigs(); // Return standardized chips configuration for billing plan status

// ----- Full example -----

const baseConfigs = useBillingPlanStatusChipConfigs({ withLabel: true });

const getStatusChip = (billingPlan: BillingPlan): WithTooltip<ChipProps> => {
  const status = getBillingPlanStatus(billingPlan);

  let tooltip = "";
  switch (status) {
    case BILLING_PLAN_FINAL_STATUS.CANCELED:
      tooltip = t("overview.membershipPlanList.statusTooltips.canceled");
      break;
    case BILLING_PLAN_FINAL_STATUS.ENDED:
      tooltip = t("overview.membershipPlanList.statusTooltips.ended");
      break;
    case BILLING_PLAN_FINAL_STATUS.PAUSED:
      tooltip = t("overview.membershipPlanList.statusTooltips.paused");
      break;
    case BILLING_PLAN_FINAL_STATUS.VALID:
      tooltip = t("overview.membershipPlanList.statusTooltips.valid");
      break;
    default:
      break;
  }

  return {
    ...baseConfigs[status],
    tooltipProps: { label: tooltip },
  };
};
`;

const meta: Meta = {
  title: "Buyables/Billing Plan Status Helpers",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  argTypes: {},
  tags: ["autodocs"],
  render: () => {
    const translations = useBillingPlanStatusTranslations();
    const withLabels = useBillingPlanStatusChipConfigs({ withLabel: true });
    const withTooltips = useBillingPlanStatusChipConfigs({ withTooltip: true });
    return (
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-sm py-xs">Key</th>
            <th className="px-sm py-xs">Value</th>
            <th className="px-sm py-xs">Translation</th>
            <th className="px-sm py-xs">Chip</th>
            <th className="px-sm py-xs">Chip with tooltip</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(BILLING_PLAN_FINAL_STATUS).map(
            ([keyString, value]) => {
              const { tooltipProps, ...chipConfig } = withTooltips[value];
              return (
                <tr key={value}>
                  <td className="px-sm py-xs">{keyString}</td>
                  <td className="px-sm py-xs">{value}</td>
                  <td className="px-sm py-xs">{translations[value]}</td>
                  <td className="px-sm py-xs">
                    <Chip {...withLabels[value]} />
                  </td>
                  <td className="px-sm py-xs">
                    <Tooltip {...(tooltipProps ?? { label: "" })}>
                      <Chip {...chipConfig} />
                    </Tooltip>
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    );
  },
};

export default meta;

export const Default: StoryObj = {};
