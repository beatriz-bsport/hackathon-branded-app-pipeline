// @flow

import React from 'react';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import MarketplaceActivityV2 from '../MarketplaceActivityCSSOnly';
import { Offer } from '#libs/offer/types';
import './MarketplaceActivityDialogCSSOnly.css';

type Props = {
  open: boolean;
  offer: Offer;
  classes: { [className: string]: string };
  onClose: () => void;
  fullScreen: boolean;
  offerId: number;
  mapContainerClassName?: string;
};

export function MarketplaceActivityDialog(props: Props) {
  const { onClose, offerId } = props;
  return (
    <Dialog
      key={offerId}
      open={props.open}
      scroll="paper"
      onClose={onClose}
      fullWidth
      maxWidth="md"
      disablePortal
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
