// @ts-nocheck
// @flow

import React from 'react';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketplaceActivityV2 from '../MarketplaceActivityCSSOnly';
import { Offer } from '#libs/offer/types';
import './MarketplaceActivityDialogCSSOnly.css';
import { Theme } from '#libs/theme/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { Level } from '#libs/level/types';

type Props = {
  theme: Theme;
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
  return (
    <Dialog
      key={offerId}
      open={props.open}
      scroll="paper"
      onClose={onClose}
      maxWidth="md"
      disablePortal
      PaperProps={paperProps}
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
