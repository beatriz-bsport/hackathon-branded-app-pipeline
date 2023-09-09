import React from 'react';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketplaceActivityV2 from '../MarketplaceActivityCSSOnly';
import { Offer } from '#libs/offer/types';
import './MarketplaceActivityDialogCSSOnly.css';
import { Theme as CompanyTheme } from '#libs/theme/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { Level } from '#libs/level/types';
import { OffersGroup } from '#libs/group-offer/types';
import { WidgetUtils } from '#libs/widget/WidgetUtils';
import WidgetPortalSlidingContainer from '#libs/widget/components/PortalContainer';

type Props = {
  companyTheme: CompanyTheme;
  open: boolean;
  metaActivities: { [key: number]: MetaActivity };
  establishments: Array<Establishment>;
  coaches: Array<Coach>;
  customLevels: Array<Level>;
  offer: Offer;
  classes: { [className: string]: string };
  onClose: () => void;
  offerId: number;
  mapContainerClassName?: string;
  fullScreen: boolean;
  onClickBook: (offer: Offer) => void;
  onClickBookOption: (offer: Offer) => void;
  hideCoach: boolean;
  width: string;
  group: { [key: number]: OffersGroup };
};

export function MarketplaceActivityDialog(props: Props) {
  const { onClose, offerId, fullScreen } = props;
  const paperProps = {
    style: {
      margin: '10px',
      borderRadius: fullScreen ? '0px' : '12px',
      maxHeight: '80vh',
    },
  };

  if (WidgetUtils.isWidget()) {
    return (
      <WidgetPortalSlidingContainer isOpen={props.open}>
        {props.open ? <MarketplaceActivityV2 {...props} width="xs" /> : null}
      </WidgetPortalSlidingContainer>
    );
  }
  return (
    <Dialog
      key={offerId}
      disablePortal
      maxWidth="md"
      onClose={onClose}
      open={props.open}
      PaperProps={paperProps}
      scroll="paper"
    >
      <DialogContent id="bs-activity--dialog">
        {props.open ? <MarketplaceActivityV2 {...props} /> : null}
      </DialogContent>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  MarketplaceActivityDialog,
);
