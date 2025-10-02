import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps, FieldArray } from 'formik';
import * as Yup from 'yup';

import IconButton from '@material-ui/core/IconButton';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import { Theme, makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import { CSS } from '@dnd-kit/utilities';
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import isEqual from 'lodash/isEqual';
// @ts-expect-error
import { SwitchField } from '#src/components/forms';
import { PricingOptionOrdering } from '#src/libs/marketplace/types';

import {
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_STRING_ID,
  PAYMENT_COMBO_BOOKING_FUNNEL_STRING_ID,
  PAYMENT_PACK_BOOKING_FUNNEL_NO_CATEGORY_STRING_ID,
} from '#src/libs/marketplace/constants';
import { PaymentPackCategory } from '#src/libs/payment-packs/types';
import { OptionCallback } from '../../../state/types';

type PricingOptionItemComponentProps = {
  passCategoryName?: string;
  dndPricingOptionId: string;
  pricingOptionType:
    | typeof CONTRACT_BOOKING_FUNNEL_IDENTIFIER
    | typeof PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
    | typeof PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER;
  itemsNumber: number;
};

const PricingOptionItemComponent: React.FC<PricingOptionItemComponentProps> =
  React.memo((props) => {
    const {
      passCategoryName,
      dndPricingOptionId,
      pricingOptionType,
      itemsNumber,
    } = props;

    const { t } = useTranslation([
      'paymentPack',
      'paymentCombo',
      'subscription',
      'theme',
    ]);
    const classes = useStylesPricingOptionItemComponent();

    const { listeners, attributes, setNodeRef, transform, transition } =
      useSortable({ id: dndPricingOptionId });
    return (
      <div ref={setNodeRef}>
        <div
          className={classes.row}
          style={{ transform: CSS.Transform.toString(transform), transition }}
        >
          <IconButton {...listeners} {...attributes}>
            <DragHandleIcon />
          </IconButton>
          <div>
            {pricingOptionType === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER && (
              <Typography variant="body1">
                {passCategoryName ?? t('paymentPack:noCategory.name')}
              </Typography>
            )}
            {pricingOptionType === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER && (
              <Typography variant="body1">
                {t('paymentCombo:pageTitle.list')}
              </Typography>
            )}
            {pricingOptionType === CONTRACT_BOOKING_FUNNEL_IDENTIFIER && (
              <Typography variant="body1">
                {t('subscription:contract.list.title')}
              </Typography>
            )}
            <Typography color="textSecondary" variant="body1">
              {t(
                'theme:forms.productsThemePersonalization.productsOrdering.itemNumberCaption',
                { count: itemsNumber },
              )}
            </Typography>
          </div>
        </div>
        <Divider className={classes.divider} />
      </div>
    );
  }, isEqual);

const useStylesPricingOptionItemComponent = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  divider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

interface FormikValues {
  custom_pricing_option_ordering_enabled: boolean;
  custom_pricing_option_ordering?: PricingOptionOrdering;
}

type OwnProps = {
  onSubmit: (
    companyId: number,
    data: {
      custom_pricing_option_ordering_enabled: boolean;
      custom_pricing_option_ordering?: PricingOptionOrdering;
    },
    options?: OptionCallback,
  ) => void;
  companyId: number;
  customPricingOptionOrderingEnabled: boolean;
  customPricingOptionOrdering: PricingOptionOrdering;
  currentPricingOptionOrdering: PricingOptionOrdering;
  paymentPackCategories: { [key: number]: PaymentPackCategory };
  paymentPackByCategorySummary: {
    id: number | null;
    nbAvailableItems: number;
  }[];
  paymentComboNumberItems: number;
  contractNumberItems: number;
};

type Props = Partial<OwnProps> & FormikProps<FormikValues>;

const idToFunnelConfigMap: Record<string, [number, null]> = {
  [PAYMENT_PACK_BOOKING_FUNNEL_NO_CATEGORY_STRING_ID]: [
    PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
    null,
  ],
  [PAYMENT_COMBO_BOOKING_FUNNEL_STRING_ID]: [
    PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
    null,
  ],
  [CONTRACT_BOOKING_FUNNEL_STRING_ID]: [
    CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
    null,
  ],
};

const ProductsOrderingPersonalizeForm: React.FC<Props> = ({
  isSubmitting,
  isValid,
  handleSubmit,
  setFieldValue,
  values,
  currentPricingOptionOrdering,
  paymentPackCategories,
  paymentPackByCategorySummary,
  paymentComboNumberItems,
  contractNumberItems,
}) => {
  const { t } = useTranslation(['theme']);
  const classes = useStyles();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const computePricingOptionItem: (
    pricingOption: [number, null | number],
  ) => { id: string; categoryName?: string } | null = useCallback(
    (pricingOption) => {
      switch (pricingOption[0]) {
        case PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER:
          const categoryId = pricingOption[1];

          if (!categoryId) {
            // Return the "No category" identifier
            return { id: PAYMENT_PACK_BOOKING_FUNNEL_NO_CATEGORY_STRING_ID };
          }

          const category = paymentPackCategories?.[categoryId];

          if (!category) {
            // Means that the category is not existing in the paymentPackCategories store (e.g. might have been deleted)
            return null;
          }

          return {
            id: String(categoryId),
            categoryName: category.name,
          };
        case PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER:
          return { id: PAYMENT_COMBO_BOOKING_FUNNEL_STRING_ID };
        case CONTRACT_BOOKING_FUNNEL_IDENTIFIER:
          return { id: CONTRACT_BOOKING_FUNNEL_STRING_ID };
        default:
          return null;
      }
    },
    [paymentPackCategories],
  );

  const itemsSortableContext = [
    ...(values.custom_pricing_option_ordering ?? currentPricingOptionOrdering),
  ]
    .filter((pricingOption) =>
      [
        CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
        PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
        PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
      ].includes(pricingOption[0]),
    )
    .map(computePricingOptionItem)
    .filter((item) => !!item);

  const formatToPricingOptionOrdening: (
    pricingOptionItemList: { id: string; categoryName?: string }[],
  ) => Array<null | [number, null | number]> = useCallback(
    (pricingOptionItemList) => {
      return pricingOptionItemList.map((pricingOptionItem) => {
        const itemId = pricingOptionItem.id;

        if (itemId in idToFunnelConfigMap) {
          return idToFunnelConfigMap[itemId];
        }

        if (/^[0-9]+$/.test(itemId)) {
          return [PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER, parseInt(itemId, 10)];
        }

        return null;
      });
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const activeItemStringId = active.id;
        const overItemStringId = over.id;

        const currentOrderPricingOptionItems = [...itemsSortableContext];

        const currentOrderIds = currentOrderPricingOptionItems.map(
          (pricingOptionItem) => pricingOptionItem.id,
        );
        const oldIndex = currentOrderIds.indexOf(activeItemStringId);
        const newIndex = currentOrderIds.indexOf(overItemStringId);

        const newCurrentOrderPricingOptionItems = arrayMove(
          currentOrderPricingOptionItems,
          oldIndex,
          newIndex,
        );
        setFieldValue(
          'custom_pricing_option_ordering',
          formatToPricingOptionOrdening(newCurrentOrderPricingOptionItems),
        );
      }
    },
    [itemsSortableContext, formatToPricingOptionOrdening, setFieldValue],
  );

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.section}>
        <Typography className={classes.namesSubHeader}>
          {t('forms.productsThemePersonalization.productsOrdering.subTitle')}
        </Typography>
        <SwitchField
          helperText={t(
            'forms.productsThemePersonalization.productsOrdering.description',
          )}
          label={t('forms.productsThemePersonalization.productsOrdering.label')}
          name="custom_pricing_option_ordering_enabled"
        />
        <Collapse in={values.custom_pricing_option_ordering_enabled}>
          <FieldArray name="custom_pricing_option_ordering" />
          {currentPricingOptionOrdering && (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={itemsSortableContext}
                strategy={verticalListSortingStrategy}
              >
                {itemsSortableContext.map((pricingOptionItem) => {
                  if (
                    pricingOptionItem?.id &&
                    /^[0-9]+$/.test(pricingOptionItem?.id) &&
                    paymentPackCategories[parseInt(pricingOptionItem.id)]
                  ) {
                    return (
                      <PricingOptionItemComponent
                        key={pricingOptionItem.id}
                        dndPricingOptionId={pricingOptionItem.id}
                        itemsNumber={
                          paymentPackByCategorySummary.find(
                            (catSummary) =>
                              catSummary.id === parseInt(pricingOptionItem.id),
                          )?.nbAvailableItems ?? 0
                        }
                        passCategoryName={pricingOptionItem.categoryName}
                        pricingOptionType={
                          PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
                        }
                      />
                    );
                  }
                  if (
                    pricingOptionItem.id ===
                    PAYMENT_PACK_BOOKING_FUNNEL_NO_CATEGORY_STRING_ID
                  ) {
                    return (
                      <PricingOptionItemComponent
                        key={pricingOptionItem.id}
                        dndPricingOptionId={pricingOptionItem.id}
                        itemsNumber={
                          paymentPackByCategorySummary.find(
                            (catSummary) => catSummary.id === null,
                          )?.nbAvailableItems ?? 0
                        }
                        pricingOptionType={
                          PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
                        }
                      />
                    );
                  }
                  if (
                    pricingOptionItem.id ===
                    PAYMENT_COMBO_BOOKING_FUNNEL_STRING_ID
                  ) {
                    return (
                      <PricingOptionItemComponent
                        key={pricingOptionItem.id}
                        dndPricingOptionId={pricingOptionItem.id}
                        itemsNumber={paymentComboNumberItems}
                        pricingOptionType={
                          PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
                        }
                      />
                    );
                  }
                  if (
                    pricingOptionItem.id === CONTRACT_BOOKING_FUNNEL_STRING_ID
                  ) {
                    return (
                      <PricingOptionItemComponent
                        key={pricingOptionItem.id}
                        dndPricingOptionId={pricingOptionItem.id}
                        itemsNumber={contractNumberItems}
                        pricingOptionType={CONTRACT_BOOKING_FUNNEL_IDENTIFIER}
                      />
                    );
                  }
                  return null;
                })}
              </SortableContext>
            </DndContext>
          )}
        </Collapse>
      </div>
      <Button
        className={classes.confirm}
        color="primary"
        disabled={isSubmitting || !isValid}
        type="submit"
        variant="contained"
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  namesSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
}));

const ProductsOrderingPersonalizeFormSchema = Yup.object().shape({
  custom_pricing_option_ordering_enabled: Yup.boolean().required(),
  custom_pricing_option_ordering: Yup.array()
    .of(Yup.array().of(Yup.number().nullable(true)).min(2).max(2))
    .nullable(true),
});

const ProductsOrderingPersonalizeFormFormikHOC = withFormik<
  OwnProps,
  FormikValues
>({
  enableReinitialize: true,
  mapPropsToValues: ({
    customPricingOptionOrderingEnabled,
    currentPricingOptionOrdering,
  }) => {
    return {
      custom_pricing_option_ordering_enabled:
        !!customPricingOptionOrderingEnabled,
      custom_pricing_option_ordering: currentPricingOptionOrdering ?? null,
    };
  },
  validationSchema: ProductsOrderingPersonalizeFormSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, companyId }, setSubmitting, resetForm },
  ) => {
    const cleanedValues = {
      custom_pricing_option_ordering_enabled:
        values.custom_pricing_option_ordering_enabled,
      custom_pricing_option_ordering:
        values.custom_pricing_option_ordering ?? undefined,
    };
    onSubmit(companyId, cleanedValues, {
      onSuccess: () => {
        setSubmitting(false);
        resetForm({
          values: {
            custom_pricing_option_ordering_enabled:
              values.custom_pricing_option_ordering_enabled,
            custom_pricing_option_ordering: null,
          },
        });
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default ProductsOrderingPersonalizeFormFormikHOC(
  ProductsOrderingPersonalizeForm,
);
