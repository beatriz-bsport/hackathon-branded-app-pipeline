// @flow

import React from 'react';
import type { Node } from 'react';

import { Dialog, DialogContent } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import ConsumerMenu from '../navigation/ConsumerMenu.component';

type Props = {
  children: Node,
  fullScreen: boolean,
};

export function ConsumerModalContainer(props: Props) {
  return (
    <div>
      <ConsumerMenu />
      <Dialog
        fullScreen={props.fullScreen}
        open
        aria-labelledby="responsive-consumer-dialog"
      >
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </div>
  );
}

export default withMobileDialog()(ConsumerModalContainer);
