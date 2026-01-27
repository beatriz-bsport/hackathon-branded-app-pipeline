import React, { useEffect } from 'react';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { Offer } from '#src/libs/offer/types';
import { Theme as CompanyTheme } from '#src/libs/theme/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Level } from '#src/libs/level/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import WidgetPortalSlidingContainer from '#src/libs/widget/components/PortalContainer';
import MarketplaceActivityV2 from '../MarketplaceActivityCSSOnly';

import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import { trackGroupActivitySessionViewedEvent } from '#src/events/booking/trackers';
import './MarketplaceActivityDialogCSSOnly.css';
import { ImmutableObject } from 'seamless-immutable';

export type Props = {
  companyTheme: CompanyTheme;
  open: boolean;
  metaActivities: ImmutableObject<{ [key: number]: MetaActivity }>;
  establishments: ReadonlyArray<Establishment>;
  coaches: Array<Coach>;
  customLevels: Array<Level>;
  offer: Offer;
  onClose: () => void;
  mapContainerClassName?: string;
  onClickBook: (offer: Offer) => void;
  onClickBookOption: (offer: Offer) => void;
  hideCoach: boolean;
  width: string;
  group: { [key: number]: OffersGroup };
  // Ugly Props we should not change component for this feature
  isCustomCssPreview?: boolean;
};

export function MarketplaceActivityDialog(props: Props) {
  const { onClose, offer, isCustomCssPreview, metaActivities, open } = props;
  const paperProps = {
    style: {
      margin: '10px',
      borderRadius: '12px',
      maxHeight: '80vh',
    },
    className: 'bs-activity--dialog_paper',
  };
  const useWidgetSlidingPortal =
    WidgetUtils.isWidget() &&
    WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED;

  useEffect(() => {
    if (!open || !offer || !metaActivities) return;

    analyticsClientB2C.track(
      trackGroupActivitySessionViewedEvent({
        activity_id: offer.activity,
        activity_name: metaActivities[offer.meta_activity]?.name || '',
        offer_id: offer.id,
        is_waiting_list: offer.full,
        session_type: metaActivities[offer.meta_activity]?.is_workshop
          ? 'workshop'
          : 'group-activity',
      }),
    );
  }, [open, offer, metaActivities]);

  if (useWidgetSlidingPortal) {
    return (
      <WidgetPortalSlidingContainer isOpen={props.open}>
        {props.open ? (
          <MarketplaceActivityV2
            {...props}
            coachDisplay={props.companyTheme?.coach_display}
            hideLevel={!props.companyTheme?.show_level}
            width="xs"
          />
        ) : null}
      </WidgetPortalSlidingContainer>
    );
  }

  return (
    <Dialog
      key={`marketplace_activity_dialog_${offer?.id}`}
      disablePortal
      disableEnforceFocus={isCustomCssPreview}
      id="bs-activity--dialog"
      maxWidth="md"
      onClose={onClose}
      open={props.open}
      PaperProps={paperProps}
      scroll="paper"
    >
      <DialogContent id="bs-activity--dialog__content">
        {props.open ? (
          <MarketplaceActivityV2
            {...props}
            coachDisplay={props.companyTheme?.coach_display}
            hideLevel={!props.companyTheme?.show_level}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  MarketplaceActivityDialog,
);
