import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import moment from 'moment';

import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup, GroupPreviewData } from '#libs/group-offer/types';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import GroupedOfferPreviewForm from './GroupedOfferPreview.component';
import { OptionCallback } from '../../../state/types';

import { Offer } from '#libs/offer/types';
import GroupedOfferCreateDuplicationForm from './GroupedOfferCreateDuplication.component';

export type Props = {
  open: boolean;
  metaActivity?: MetaActivity;
  group: OffersGroup<Offer>;
  groupPreview: Record<
    number,
    {
      offers_data: Offer[];
      group: OffersGroup<Offer>;
    }
  >;
  generatePreview: (arg0: GroupPreviewData, options?: OptionCallback) => void;
  createGroupOffers: (
    data: {
      group_data_with_offers: Record<
        number,
        {
          offers_data: Offer[];
          group: OffersGroup<Offer>;
        }
      >;
    },
    options?: OptionCallback,
  ) => void;
  resetPreview: () => void;

  onClose?: () => void;
};

const STEP_GROUPED_OPTION_FORM = 0;
const STEP_GROUPED_OPTION_PREVIEW = 1;

export const GroupedOfferDuplicateFormDrawer: React.FC<Props> = ({
  open,
  metaActivity = {},
  group,
  groupPreview = {},
  generatePreview,
  onClose,
  resetPreview,
  createGroupOffers,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  const [step, setStep] = useState<0 | 1>(STEP_GROUPED_OPTION_FORM);

  const handleNextStep = useCallback(() => {
    switch (step) {
      case STEP_GROUPED_OPTION_FORM:
        setStep(STEP_GROUPED_OPTION_PREVIEW);
        break;
      case STEP_GROUPED_OPTION_PREVIEW:
        onClose();
        break;
      default:
        break;
    }
  }, [onClose, step]);

  const handlePreviousStep = useCallback(() => {
    switch (step) {
      case STEP_GROUPED_OPTION_FORM:
        onClose();
        break;
      case STEP_GROUPED_OPTION_PREVIEW:
        setStep(STEP_GROUPED_OPTION_FORM);
        break;
      default:
        break;
    }
  }, [onClose, step]);

  const getSubtitle = useCallback(() => {
    switch (step) {
      case STEP_GROUPED_OPTION_FORM:
        return t('groupedOption.modal.duplicate');
      case STEP_GROUPED_OPTION_PREVIEW:
        return t('groupedOption.modal.subtitlePreview');
      default:
        return null;
    }
  }, [step, t]);

  const groups = useMemo(
    () =>
      Object.keys(groupPreview).map((key) => ({
        ...groupPreview[key]?.group,
        offers: groupPreview[key]?.offers_data,
      })),
    [groupPreview],
  );

  const generatePreviewFromSettings = useCallback(
    ({ values }) => {
      const {
        meta_activity,
        level,
        allow_booking_after_start,
        full_booking_only,
        available,
        manager_only,
        offers: offersGroup = [],
      } = group;

      resetPreview();

      const firstOffer = [...offersGroup].sort((a, b) =>
        moment(a.date_start).isBefore(b.date_start) ? -1 : 1,
      )?.[0];

      if (!firstOffer) {
        onClose();
      }

      const day_delta = moment(values.timeStart).diff(
        moment(firstOffer.date_start),
        'days',
      );

      const offers_data = offersGroup.map((o) => ({
        ...o,
        date_start: moment(o.date_start).add(day_delta, 'days').unix(),
      }));

      generatePreview(
        {
          group_data: {
            meta_activity,
            level,
            allow_booking_after_start,
            full_booking_only,
            available,
            manager_only,
            name: values.name,
          },
          recurrence_rule: values.copyRecurrence ? group.recurrence_rule : null,
          offers_data,
        },
        {
          onSuccess: () => {
            handleNextStep();
          },
        },
      );
    },
    [group, generatePreview, handleNextStep, onClose, resetPreview],
  );

  const handlecreateGroupOffer = useCallback(
    ({ values }) => {
      // for each groups add the group details
      const group_data_with_offers = values.reduce(
        (acc, formikGroup, index) => {
          const { offers, ..._formikGroup } = formikGroup;
          acc[index] = {
            group: _formikGroup,
            offers_data: offers.map((o) => ({
              waiting_list_max_size: parseInt(o.waiting_list_max_size),
              effectif: parseInt(o.effectif),
              credits: parseInt(o.credits),
              available_on_partnership: o.available_on_partnership,
              blacklist_tags: o.blacklist_tags,
              broadcast_link: o.broadcast_link,
              coach: o.coach,
              coach_payment_rule: o.coach_payment_rule,
              date_start: o.date_start,
              duration_minute: o.duration_minute,
              establishment: o.establishment,
              level: o.level,
              manager_only: o.manager_only,
              partner_max_booking_count: o.partner_max_booking_count,
              whitelist_tags: o.whitelist_tags,
            })),
          };
          return acc;
        },
        {},
      );
      createGroupOffers(
        { group_data_with_offers },
        {
          onSuccess: () => {
            handleNextStep();
          },
        },
      );
    },
    [createGroupOffers, handleNextStep],
  );

  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={onClose}
      title={t('groupedOption.modal.title')}
      subtitle={getSubtitle()}
    >
      <div className={classes.drawerInner}>
        {step === STEP_GROUPED_OPTION_FORM && (
          <GroupedOfferCreateDuplicationForm
            initial={group}
            onSubmit={generatePreviewFromSettings}
            handlePreviousStep={handlePreviousStep}
          />
        )}
        {step === STEP_GROUPED_OPTION_PREVIEW && groupPreview && (
          <GroupedOfferPreviewForm
            groups={groups}
            metaActivity={metaActivity}
            onSubmit={handlecreateGroupOffer}
            handlePreviousStep={handlePreviousStep}
          />
        )}
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  drawerInner: {
    paddingTop: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default GroupedOfferDuplicateFormDrawer;
